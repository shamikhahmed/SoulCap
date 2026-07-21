/* SoulCap — application logic
 * Local-first. Zero network calls. No account, no server, no LLM, no analytics.
 */
(function () {
  'use strict';

  /* ── Safety kernel ────────────────────────────────────────────────────────
   * Ported from backend SafetyGateService. This is the ONLY place risk is
   * assessed. Tier 3 is terminal — it hands off to the hard-coded crisis
   * surface and nothing may override it.
   *
   * Inflected forms are listed explicitly: matching is substring-based and
   * "end my life" is NOT a substring of "ending my life". Listing base forms
   * alone let the most common phrasings through entirely.
   * Keep in sync with backend/src/ai/safety/safety-gate.service.ts.
   */
  var CRISIS_HARD = [
    'kill myself','killing myself','kill my self',
    'end my life','ending my life','end my own life','ending my own life',
    'take my own life','taking my own life',
    'end it all','ending it all',
    'want to die','wanna die','want to be dead',
    'suicide','suicidal',
    'hurt myself','hurting myself','harm myself','harming myself',
    'cut myself','cutting myself',
    'overdose','overdosing',
    'not worth living','no reason to live','nothing to live for',
    "don't want to be here",'dont want to be here',
    'everyone would be better without me','better off without me','kms'
  ];
  var CRISIS_CONTEXTUAL = ['saying goodbye','giving away','farewell','final note','last message'];
  var DISTRESS_CONTEXT = ['pain','hopeless','desperate',"can't take",'exhausted','done','over',
    'anymore','nothing left','end it','tired of living','worthless'];
  var ELEVATED = ['think about dying','wish i was dead','fantasize about death',
    'nothing matters','completely hopeless','no way out','never gets better',
    "can't go on",'too much pain','done with everything',"don't want to wake up"];

  function assessRisk(text) {
    if (!text) return 0;
    var s = String(text).toLowerCase();
    for (var i = 0; i < CRISIS_HARD.length; i++) if (s.indexOf(CRISIS_HARD[i]) !== -1) return 3;
    var ctx = CRISIS_CONTEXTUAL.some(function (k) { return s.indexOf(k) !== -1; });
    var dis = DISTRESS_CONTEXT.some(function (k) { return s.indexOf(k) !== -1; });
    if (ctx && dis) return 3;
    for (var j = 0; j < ELEVATED.length; j++) if (s.indexOf(ELEVATED[j]) !== -1) return 2;
    return 0;
  }

  /* ── State ─────────────────────────────────────────────────────────────── */
  var KEY = 'soulcap_v1';
  var DEFAULT = {
    v: 2, onboarded: false, welcomed: false, ageOk: null, region: null, consent: false,
    concerns: [], checkins: [], skillRuns: [], people: [], links: [], inferences: [],
    safetyPlan: {}, episodes: [], favourites: [],
    theme: null, rings: 3,
    voice: { on: false, name: null, rate: 0.85, pitch: 1 },
    haptics: true, showLinks: false, trackContact: false
  };
  var state = load();

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return clone(DEFAULT);
      return Object.assign(clone(DEFAULT), JSON.parse(raw));
    } catch (e) { return clone(DEFAULT); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function uid() { return Math.random().toString(36).slice(2, 10); }

  /* ── DOM ───────────────────────────────────────────────────────────────── */
  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }

  /* ── Theme ─────────────────────────────────────────────────────────────── */
  function applyTheme() {
    if (state.theme) document.documentElement.setAttribute('data-theme', state.theme);
    else document.documentElement.removeAttribute('data-theme');
    // Mirrored to its own key so the pre-paint script can read it without
    // parsing the whole state blob. Keep the two in sync.
    try {
      if (state.theme) localStorage.setItem('soulcap_theme', state.theme);
      else localStorage.removeItem('soulcap_theme');
    } catch (e) {}
  }

  /* ── Haptics ───────────────────────────────────────────────────────────── */
  function buzz(pattern) {
    if (!state.haptics) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (navigator.vibrate) { try { navigator.vibrate(pattern); } catch (e) {} }
  }

  /* ── Voice ─────────────────────────────────────────────────────────────── */
  // Device voices only. Bundling a custom voice would need audio files or a
  // network TTS service, and this app makes no network calls by design. On
  // Apple hardware the device list includes the high-quality system voices.
  var voices = [];
  function loadVoices() {
    if (!('speechSynthesis' in window)) return;
    voices = window.speechSynthesis.getVoices().filter(function (v) {
      return v.lang && v.lang.toLowerCase().indexOf('en') === 0;
    });
  }
  function bestVoice() {
    if (!voices.length) return null;
    if (state.voice.name) {
      var picked = voices.filter(function (v) { return v.name === state.voice.name; })[0];
      if (picked) return picked;
    }
    // Prefer voices the platform marks as enhanced/premium where exposed.
    var nice = voices.filter(function (v) { return /premium|enhanced|siri|samantha|serena|daniel/i.test(v.name); });
    return nice[0] || voices[0];
  }
  function speak(text) {
    if (!state.voice.on || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      var v = bestVoice();
      if (v) u.voice = v;
      u.rate = state.voice.rate;
      u.pitch = state.voice.pitch;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }
  function hushVoice() { try { window.speechSynthesis.cancel(); } catch (e) {} }

  /* ── Crisis ────────────────────────────────────────────────────────────── */
  function crisisList() {
    var r = REGIONS.filter(function (x) { return x.code === state.region; })[0];
    return CRISIS[(r && r.crisis) || 'INTL'];
  }
  function renderCrisisLinks(container) {
    clear(container);
    // Only the first is filled. Three blocks of alarm red is the opposite of
    // calming, and spending the reserved colour repeatedly drains its signal.
    crisisList().forEach(function (c, i) {
      container.appendChild(c.href
        ? el('a', { href: c.href, class: 'btn ' + (i === 0 ? 'panic-call' : 'crisis-alt'),
                    style: 'text-decoration:none', text: c.name + ' — ' + c.detail })
        : el('div', { class: 'notice', text: c.name + ' — ' + c.detail }));
    });
  }

  var pacerTimer = null, pacerPhase = 0;
  var PHASES = [
    { label: 'Breathe in, slowly.', scale: 1 },
    { label: 'Hold.', scale: 1 },
    { label: 'Breathe out, slowly.', scale: 0.7 },
    { label: 'Hold.', scale: 0.7 }
  ];

  function openPanic() {
    $('#panic').classList.add('on');
    $('#panic').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderCrisisLinks($('#panicLinks'));
    runPacer();
    buzz(18);
    $('#panicExit').focus();
  }
  function closePanic() {
    $('#panic').classList.remove('on');
    $('#panic').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    stopPacer(); hushVoice();
    maybeAskEpisode();
  }
  function runPacer() {
    stopPacer(); pacerPhase = 0;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var circle = $('#pacer'), ring = $('#pacerRing');
    var count = $('#pacerCount'), label = $('#panicInstruction'), step = $('#panicStep');
    function tick() {
      var ph = PHASES[pacerPhase % 4];
      label.textContent = ph.label;
      step.textContent = 'Step ' + ((pacerPhase % 4) + 1) + ' of 4';
      if (!reduced) {
        circle.style.transform = 'scale(' + ph.scale + ')';
        ring.style.transform = 'scale(' + (ph.scale + 0.12) + ')';
      }
      if (pacerPhase % 2 === 0) buzz(ph.scale === 1 ? [12, 90, 12] : 12);
      speak(ph.label);
      var n = 4; count.textContent = n;
      var cd = setInterval(function () {
        n -= 1;
        if (n <= 0) { clearInterval(cd); return; }
        count.textContent = n;
      }, 1000);
      pacerPhase++;
    }
    tick();
    pacerTimer = setInterval(tick, 4000);
  }
  function stopPacer() { if (pacerTimer) { clearInterval(pacerTimer); pacerTimer = null; } }

  /* ── Post-episode capture ──────────────────────────────────────────────── */
  function maybeAskEpisode() {
    var lastRun = state.skillRuns[state.skillRuns.length - 1];
    if (lastRun && Date.now() - lastRun.t < 60000) return; // already captured
    openSheet(function (p) {
      p.appendChild(el('h2', { class: 'h-sec', text: 'That was a hard moment.' }));
      p.appendChild(el('p', { class: 'p-sm', text: 'One tap, then it’s done. This is only for you — it helps SoulCap learn what actually works for you.' }));
      ['A bit easier now', 'About the same', 'Still hard'].forEach(function (label, i) {
        p.appendChild(el('button', { class: 'opt', text: label, onclick: function () {
          state.episodes.push({ t: Date.now(), outcome: i });
          save(); closeSheet(); render();
        } }));
      });
      p.appendChild(el('button', { class: 'btn quiet', text: 'Skip', onclick: closeSheet }));
    });
  }

  /* ── Skill selection ───────────────────────────────────────────────────── */
  function capRank(c) { return c === 'low' ? 0 : c === 'medium' ? 1 : 2; }
  function latestCheckin() { return state.checkins.length ? state.checkins[state.checkins.length - 1] : null; }
  /** Only a recent check-in describes how someone is now. Older is history, and
   *  citing it as current state ("you said you're feeling steady") reads as wrong. */
  function currentCheckin() {
    var c = latestCheckin();
    return c && (Date.now() - c.t) < 12 * 3600 * 1000 ? c : null;
  }
  function currentCapacity() {
    var c = currentCheckin();
    if (!c) return 'any';
    if (c.state === 'Wired' || c.state === 'Heavy') return 'low';
    if (c.state === 'Flat') return 'medium';
    return 'any';
  }
  function helpfulScore(id) {
    var runs = state.skillRuns.filter(function (r) { return r.id === id; });
    if (!runs.length) return 0;
    return (runs.filter(function (r) { return r.helpful === true; }).length / runs.length) * 2;
  }

  function suggestSkill() {
    var cap = currentCapacity();
    var last = currentCheckin();
    var recent = state.skillRuns.slice(-3).map(function (r) { return r.id; });
    var pool = SKILLS.filter(function (s) {
      if (cap === 'low' && capRank(s.capacity) > 0) return false;
      if (cap === 'medium' && capRank(s.capacity) > 1) return false;
      return true;
    });
    if (!pool.length) pool = SKILLS.slice();

    var scored = pool.map(function (s) {
      var score = 0, why = [];
      var h = helpfulScore(s.id);
      if (h > 0) { score += h; why.push('it has helped you before'); }
      if (state.favourites.indexOf(s.id) !== -1) { score += 1.2; why.push('you saved it'); }
      if (last) {
        var map = { Wired: ['anxiety','panic','wired'], Heavy: ['low','shame','self-critical'],
                    Flat: ['low','flat','withdrawn'], Steady: ['stable','stuck'] };
        var want = map[last.state] || [];
        if (s.indication.some(function (i) { return want.indexOf(i) !== -1; })) {
          score += 1.5; why.push('you said you’re feeling ' + last.state.toLowerCase());
        }
      }
      state.concerns.forEach(function (c) {
        var k = c.toLowerCase();
        if (k.indexOf('sleep') !== -1 && s.domain === 'rest') { score += 1; why.push('sleep is on your list'); }
        if (k.indexOf('lonel') !== -1 && s.domain === 'connect') { score += 1; why.push('you mentioned loneliness'); }
        if (k.indexOf('panic') !== -1 && s.family === 'autonomic') { score += 1; why.push('you mentioned panic'); }
        if (k.indexOf('low mood') !== -1 && s.domain === 'move') { score += 1; why.push('you mentioned low mood'); }
      });
      // Late at night, sleep beats everything. An 8-minute values exercise at
      // 1am is the wrong answer no matter what the other signals say.
      var hour = new Date().getHours();
      if (hour >= 22 || hour <= 5) {
        if (s.domain === 'rest') { score += 3; why.push('it’s late'); }
        if (s.domain === 'reflect' || s.domain === 'move') score -= 2;
      }
      if (recent.indexOf(s.id) !== -1) score -= 2;
      return { skill: s, score: score, why: why };
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored[0];
  }

  function reasonText(pick) {
    if (!pick.why.length) return 'I don’t know you yet — this is a good place for most people to start.';
    var uniq = pick.why.filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 2);
    return 'Because ' + uniq.join(', and ') + '.';
  }

  /* ── Skill runner — guided, paced, spoken ──────────────────────────────────
   * "Guide me" turns it into a therapist pacing you through: the orb breathes,
   * each step is spoken, and it advances on its own at a calm reading pace.
   * Manual Next is always there for anyone who wants to move faster.  */
  var runState = null;

  function startSkill(id) {
    var s = SKILLS.filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    runState = { skill: s, i: 0, guide: false, timer: null };
    $('#runner').classList.add('on');
    $('#runner').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderRunner();
  }

  function clearRunTimer() { if (runState && runState.timer) { clearTimeout(runState.timer); runState.timer = null; } }

  function stepDuration(text) {
    // A calm reading pace, with a floor so short steps don't rush.
    return Math.max(5200, text.split(/\s+/).length * 420);
  }

  function scheduleAdvance() {
    clearRunTimer();
    var s = runState.skill;
    runState.timer = setTimeout(function () {
      runState.i++;
      renderRunner();
    }, stepDuration(s.steps[runState.i]));
  }

  function renderRunner() {
    clearRunTimer();
    var s = runState.skill, done = runState.i >= s.steps.length;
    var orb = $('#runOrb'), ring = $('#runOrbRing'), count = $('#runOrbCount');
    count.textContent = '';

    $('#runStep').textContent = done ? s.name + ' · done' : s.name;
    var prog = $('#runProgress'); clear(prog);
    s.steps.forEach(function (_, i) { prog.appendChild(el('i', { class: (done || i <= runState.i) ? 'on' : '' })); });

    $('#runText').textContent = done ? 'That’s it. Did that help at all?' : s.steps[runState.i];
    var why = $('#runWhy');
    why.textContent = done ? '' : (runState.i === 0 ? s.mechanism : '');
    why.style.display = (!done && runState.i === 0) ? '' : 'none';

    var guideBtn = $('#runGuide');
    guideBtn.style.display = done ? 'none' : '';
    guideBtn.setAttribute('aria-pressed', runState.guide ? 'true' : 'false');
    $('#runGuideLabel').textContent = runState.guide ? 'Guiding' : 'Guide me';
    $('#runGuideIcon').innerHTML = runState.guide ? '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>' : '<path d="M8 5v14l11-7z"/>';

    if (!done) {
      speak(s.steps[runState.i]); buzz(10);
      if (runState.guide) scheduleAdvance();
    } else {
      hushVoice();
      orb.style.transform = 'scale(.82)';
    }

    var actions = $('#runActions'); clear(actions);
    if (done) {
      actions.appendChild(el('button', { class: 'btn', text: 'It helped', onclick: function () { finishSkill(true); } }));
      actions.appendChild(el('button', { class: 'btn ghost', text: 'Not really', onclick: function () { finishSkill(false); } }));
      actions.appendChild(el('button', { class: 'btn quiet', text: 'Skip', onclick: function () { finishSkill(null); } }));
    } else {
      actions.appendChild(el('button', { class: 'btn',
        text: runState.i === s.steps.length - 1 ? 'Finish' : 'Next',
        onclick: function () { clearRunTimer(); runState.i++; renderRunner(); } }));
      actions.appendChild(el('button', { class: 'btn quiet', text: 'Stop — no problem', onclick: closeRunner }));
    }
  }

  function toggleGuide() {
    if (!runState || runState.i >= runState.skill.steps.length) return;
    runState.guide = !runState.guide;
    buzz(12);
    renderRunner();
  }

  function finishSkill(helpful) {
    state.skillRuns.push({ t: Date.now(), id: runState.skill.id, helpful: helpful });
    save(); closeRunner(); render();
  }
  function closeRunner() {
    clearRunTimer();
    $('#runner').classList.remove('on');
    $('#runner').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    runState = null; hushVoice();
  }

  /* ── Sheet ─────────────────────────────────────────────────────────────── */
  function openSheet(build) {
    var panel = $('#sheetPanel'); clear(panel);
    panel.appendChild(el('div', { class: 'grab' }));
    build(panel);
    $('#sheet').classList.add('on');
    $('#sheet').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var f = panel.querySelector('button, input, select, textarea, a');
    if (f) f.focus();
  }
  function closeSheet() {
    $('#sheet').classList.remove('on');
    $('#sheet').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ── Technique detail ──────────────────────────────────────────────────── */
  function skillSheet(id) {
    var s = SKILLS.filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    var dm = DOMAIN_META[s.domain], fm = FAMILY_META[s.family];
    openSheet(function (p) {
      p.appendChild(el('span', { class: 'domain', style: 'color:var(' + dm.cssVar + ')', text: dm.label }));
      p.appendChild(el('h2', { class: 'h-sec', text: s.name }));
      p.appendChild(el('p', { class: 'meta', text: s.mins + ' min · ' + fm.label + ' · ' + NEEDS_META[s.needs].label }));
      p.appendChild(el('hr', { class: 'sep' }));
      p.appendChild(el('p', { class: 'eyebrow', text: 'Why it works' }));
      p.appendChild(el('p', { class: 'p', text: s.mechanism }));
      if (s.contraindication.length) {
        p.appendChild(el('div', { class: 'notice', html:
          '<b>Not for everyone.</b> Skip this one if: ' + s.contraindication.join(', ') +
          '. If you are unsure, ask a professional rather than this app.' }));
      }
      p.appendChild(el('p', { class: 'p-sm', text: 'Source: ' + s.source }));
      p.appendChild(el('button', { class: 'btn', text: 'Begin', onclick: function () { closeSheet(); startSkill(s.id); } }));
      var fav = state.favourites.indexOf(s.id) !== -1;
      p.appendChild(el('button', { class: 'btn ghost', text: fav ? 'Saved — remove' : 'Save to my shortlist',
        onclick: function () {
          var i = state.favourites.indexOf(s.id);
          if (i === -1) state.favourites.push(s.id); else state.favourites.splice(i, 1);
          save(); closeSheet(); render();
        } }));
      p.appendChild(el('button', { class: 'btn quiet', text: 'Close', onclick: closeSheet }));
    });
  }

  function skillCard(s, showWhy) {
    var dm = DOMAIN_META[s.domain];
    return el('button', { class: 'card tap', onclick: function () { skillSheet(s.id); } }, [
      el('div', { class: 'card-head' }, [
        el('h3', { class: 'card-title', text: s.name }),
        el('span', { class: 'domain', style: 'color:var(' + dm.cssVar + ')', text: dm.label })
      ]),
      el('p', { class: 'meta', text: s.mins + ' min · ' + NEEDS_META[s.needs].label }),
      showWhy ? el('p', { class: 'p-sm', text: s.blurb }) : null
    ]);
  }

  /* ── Calm tab — context filtering ──────────────────────────────────────── */
  var calmCtx = { needs: null, seen: null };

  function renderCalm() {
    var v = $('#view-calm'); clear(v);
    v.appendChild(el('div', {}, [
      el('p', { class: 'eyebrow', text: 'Calm' }),
      el('h1', { class: 'h-voice', text: 'Something for right now.' })
    ]));

    v.appendChild(el('button', { class: 'help-btn', text: 'I need help now', onclick: openPanic }));

    // Context questions. Most apps hand you a technique you cannot actually do
    // in the moment you need it — cold water needs a sink, humming needs privacy.
    v.appendChild(el('div', {}, [
      el('p', { class: 'p-voice', text: 'Where are you right now?' }),
      el('div', { style: 'height:11px' }),
      el('div', { class: 'chips' }, [
        el('button', { class: 'chip', 'aria-pressed': calmCtx.seen === false ? 'true' : 'false',
          text: 'On my own', onclick: function () { calmCtx.seen = calmCtx.seen === false ? null : false; renderCalm(); } }),
        el('button', { class: 'chip', 'aria-pressed': calmCtx.seen === true ? 'true' : 'false',
          text: 'Around people', onclick: function () { calmCtx.seen = calmCtx.seen === true ? null : true; renderCalm(); } })
      ])
    ]));

    var needOpts = [
      { k: 'water', label: 'A tap or drink' },
      { k: 'cold', label: 'Something cold' },
      { k: 'sour', label: 'Something sour' },
      { k: 'space', label: 'Room to move' }
    ];
    v.appendChild(el('div', {}, [
      el('p', { class: 'p-voice', text: 'What have you got to hand?' }),
      el('div', { style: 'height:11px' }),
      el('div', { class: 'chips' }, needOpts.map(function (o) {
        return el('button', { class: 'chip', 'aria-pressed': calmCtx.needs === o.k ? 'true' : 'false',
          text: o.label, onclick: function () { calmCtx.needs = calmCtx.needs === o.k ? null : o.k; renderCalm(); } });
      }))
    ]));

    // Filter: contraindications are removed, never ranked down.
    var cap = currentCapacity();
    var list = SKILLS.filter(function (s) {
      if (capRank(s.capacity) > (cap === 'low' ? 0 : cap === 'medium' ? 1 : 2)) return false;
      if (calmCtx.seen === true && !s.discreet) return false;
      if (s.needs !== 'none' && calmCtx.needs !== s.needs) {
        if (['water', 'cold', 'sour'].indexOf(s.needs) !== -1) return false;
      }
      return true;
    });

    if (state.favourites.length) {
      var favs = list.filter(function (s) { return state.favourites.indexOf(s.id) !== -1; });
      if (favs.length) {
        v.appendChild(el('p', { class: 'eyebrow', text: 'Your shortlist' }));
        favs.forEach(function (s) { v.appendChild(skillCard(s, true)); });
      }
    }

    v.appendChild(el('p', { class: 'eyebrow', text: list.length + ' that work here' }));
    if (!list.length) {
      v.appendChild(el('div', { class: 'notice', text: 'Nothing matches that combination. Clear a filter and try again — or use the help button above.' }));
    }
    Object.keys(FAMILY_META).forEach(function (fam) {
      var items = list.filter(function (s) { return s.family === fam && state.favourites.indexOf(s.id) === -1; });
      if (!items.length) return;
      v.appendChild(el('div', {}, [
        el('p', { class: 'domain', style: 'color:var(--ink-3);margin:14px 0 3px', text: FAMILY_META[fam].label }),
        el('p', { class: 'p-sm', style: 'margin-bottom:10px', text: FAMILY_META[fam].note })
      ]));
      items.forEach(function (s) { v.appendChild(skillCard(s, false)); });
    });
  }

  /* ── Constellation ─────────────────────────────────────────────────────── */
  function ringDefs() {
    var names = ['CLOSE', 'PRESENT', 'DISTANT', 'FURTHER', 'EDGE'];
    var out = [];
    // Outer ring caps at 140 so that node (r15) plus its label (+32) still fits
    // inside the 400x400 viewBox once the group rotates.
    var INNER = 54, OUTER = 140;
    for (var i = 0; i < state.rings; i++) {
      out.push({
        key: 'r' + i,
        label: names[i] || 'RING ' + (i + 1),
        r: INNER + i * ((OUTER - INNER) / Math.max(state.rings - 1, 1))
      });
    }
    return out;
  }
  function typeMeta(code) {
    return RELATIONSHIP_TYPES.filter(function (t) { return t.code === code; })[0] || RELATIONSHIP_TYPES[5];
  }

  function drawMap() {
    var svg = $('#map'); if (!svg) return;
    clear(svg);
    var NS = 'http://www.w3.org/2000/svg';
    function s(tag, a) {
      var n = document.createElementNS(NS, tag);
      Object.keys(a).forEach(function (k) { n.setAttribute(k, a[k]); });
      return n;
    }
    var rings = ringDefs();
    rings.forEach(function (ring) {
      svg.appendChild(s('circle', { class: 'orbit', 'data-key': ring.key, cx: 200, cy: 200, r: ring.r }));
      var lab = s('text', { class: 'orbit-lab', x: 146, y: 200 - ring.r + 14, 'text-anchor': 'middle' });
      lab.textContent = ring.label;
      svg.appendChild(lab);
    });

    // Rotating group — very slow, and frozen entirely under reduced-motion.
    var g = s('g', { id: 'orbitGroup' });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) g.style.animation = 'none';

    if (state.showLinks) {
      state.links.forEach(function (lk) {
        var a = state.people.filter(function (p) { return p.id === lk.a; })[0];
        var b = state.people.filter(function (p) { return p.id === lk.b; })[0];
        if (!a || !b) return;
        var pa = pos(a, rings), pb = pos(b, rings);
        g.appendChild(s('line', { class: 'edge', x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y }));
      });
    }

    state.people.forEach(function (p) {
      var pt = pos(p, rings);
      var node = s('g', { class: 'node' + (p.hard ? ' hard' : ''), tabindex: '0', role: 'button',
                          'aria-label': p.name + ', ' + typeMeta(p.type).label + (p.hard ? ', hard right now' : '') });
      var c = s('circle', { cx: pt.x, cy: pt.y, r: 15, fill: 'var(' + typeMeta(p.type).cssVar + ')',
                            stroke: p.hard ? 'var(--ink-3)' : 'var(--surface)', 'stroke-width': p.hard ? 1.5 : 2 });
      if (p.hard) c.setAttribute('stroke-dasharray', '3 3');
      var t = s('text', { class: 'node-lab', x: pt.x, y: pt.y + (pt.y >= 200 ? 32 : -22) });
      t.textContent = p.name;
      node.appendChild(c); node.appendChild(t);
      attachNodeDrag(node, c, t, p, svg);
      node.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); personSheet(p.id); }
      });
      g.appendChild(node);
    });
    svg.appendChild(g);

    // Sun on top of the orbiting group so it never sits behind a node.
    svg.appendChild(s('circle', { class: 'sun', cx: 200, cy: 200, r: 31, fill: 'var(--accent)' }));
    var you = s('text', { class: 'sun-lab', x: 200, y: 205 });
    you.textContent = 'You';
    svg.appendChild(you);
  }

  /* Drag a person in or out to change how close they feel. Tap (no drag) opens
   * their detail. The map freezes while dragging so screen↔SVG maths stays clean. */
  function attachNodeDrag(node, circle, label, p, svg) {
    var drag = null;
    function localPoint(clientX, clientY) {
      var gEl = document.getElementById('orbitGroup') || svg;
      var pt = svg.createSVGPoint(); pt.x = clientX; pt.y = clientY;
      var ctm = gEl.getScreenCTM();
      return ctm ? pt.matrixTransform(ctm.inverse()) : null;
    }
    function nearestRing(x, y) {
      var d = Math.hypot(x - 200, y - 200), rings = ringDefs(), best = rings[0], bd = Infinity;
      rings.forEach(function (r) { var dd = Math.abs(r.r - d); if (dd < bd) { bd = dd; best = r; } });
      return best;
    }
    function highlight(key) {
      Array.prototype.forEach.call(svg.querySelectorAll('.orbit'), function (o) {
        o.classList.toggle('drop', o.getAttribute('data-key') === key);
      });
    }
    node.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      drag = { moved: false, x: e.clientX, y: e.clientY };
      node.classList.add('dragging');
      svg.classList.add('frozen');
      try { node.setPointerCapture(e.pointerId); } catch (_) {}
    });
    node.addEventListener('pointermove', function (e) {
      if (!drag) return;
      if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 5) drag.moved = true;
      var lp = localPoint(e.clientX, e.clientY);
      if (!lp) return;
      // Inverse-then-forward transform is identity, so the node sits exactly under the finger.
      circle.setAttribute('cx', lp.x); circle.setAttribute('cy', lp.y);
      label.setAttribute('x', lp.x); label.setAttribute('y', lp.y + (lp.y >= 200 ? 32 : -22));
      highlight(nearestRing(lp.x, lp.y).key);
    });
    function end(e) {
      if (!drag) return;
      var wasDrag = drag.moved;
      node.classList.remove('dragging');
      svg.classList.remove('frozen');
      highlight(null);
      if (wasDrag) {
        var lp = localPoint(e.clientX, e.clientY);
        if (lp) { p.ring = nearestRing(lp.x, lp.y).key; save(); buzz(12); }
        render();
      } else {
        personSheet(p.id);
      }
      drag = null;
    }
    node.addEventListener('pointerup', end);
    node.addEventListener('pointercancel', function () {
      if (drag) { node.classList.remove('dragging'); svg.classList.remove('frozen'); highlight(null); drag = null; render(); }
    });
  }

  function pos(p, rings) {
    var ring = rings.filter(function (r) { return r.key === p.ring; })[0] || rings[rings.length - 1];
    var peers = state.people.filter(function (x) { return x.ring === p.ring; });
    var i = peers.indexOf(p);
    var ringIndex = rings.indexOf(ring);
    // Per-ring phase offset, otherwise every ring starts at the same angle and
    // the nodes stack into a vertical line.
    var phase = -Math.PI / 2 + 0.4 + ringIndex * 1.1;
    var angle = phase + (i / Math.max(peers.length, 1)) * Math.PI * 2;
    return { x: 200 + ring.r * Math.cos(angle), y: 200 + ring.r * Math.sin(angle) };
  }

  function suggestPerson() {
    var pool = state.people.filter(function (p) {
      return !p.hard && p.suggestible !== false && p.supportive >= 0.5 && p.drain <= 0.6;
    });
    if (!pool.length) return null;
    pool.sort(function (a, b) {
      var rank = function (x) {
        var ri = ringDefs().findIndex(function (r) { return r.key === x.ring; });
        return x.supportive - x.drain + (ri === 0 ? 0.5 : ri === 1 ? 0.2 : 0);
      };
      return rank(b) - rank(a);
    });
    return pool[0];
  }

  function personSheet(id) {
    var p = state.people.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    openSheet(function (panel) {
      panel.appendChild(el('h2', { class: 'h-sec', text: p.name }));
      panel.appendChild(el('p', { class: 'eyebrow', text: typeMeta(p.type).label }));

      [['Feels supportive', 'supportive'], ['Costs me energy', 'drain']].forEach(function (pair) {
        panel.appendChild(el('div', {}, [
          el('div', { class: 'meta', text: pair[0] }),
          el('div', { class: 'bar' }, [el('i', { style: 'width:' + Math.round(p[pair[1]] * 100) + '%' })])
        ]));
      });

      panel.appendChild(el('p', { class: 'eyebrow', style: 'margin-top:8px', text: 'How close' }));
      panel.appendChild(el('div', { class: 'chips' }, ringDefs().map(function (r) {
        return el('button', { class: 'chip', 'aria-pressed': p.ring === r.key ? 'true' : 'false',
          text: r.label.charAt(0) + r.label.slice(1).toLowerCase(),
          onclick: function () { p.ring = r.key; save(); closeSheet(); render(); } });
      })));

      if (state.trackContact) {
        panel.appendChild(el('hr', { class: 'sep' }));
        panel.appendChild(el('p', { class: 'meta', text: p.lastContact
          ? 'Last spoke: ' + Math.round((Date.now() - p.lastContact) / 86400000) + ' days ago'
          : 'No contact logged' }));
        panel.appendChild(el('button', { class: 'btn ghost', text: 'We spoke today',
          onclick: function () { p.lastContact = Date.now(); save(); closeSheet(); render(); } }));
      }

      panel.appendChild(el('hr', { class: 'sep' }));
      panel.appendChild(el('button', {
        class: 'btn ' + (p.hard ? '' : 'ghost'),
        text: p.hard ? 'This is hard right now — on' : 'Mark “hard right now”',
        onclick: function () { p.hard = !p.hard; save(); closeSheet(); render(); }
      }));
      panel.appendChild(el('p', { class: 'p-sm', text: p.hard
        ? 'While this is on, SoulCap will never suggest contacting them, and won’t mention how long it’s been.'
        : 'Turn this on and they’re excluded from every suggestion. No nudges to reconcile, ever.' }));

      panel.appendChild(el('button', { class: 'btn danger', text: 'Remove from Constellation',
        onclick: function () {
          state.people = state.people.filter(function (x) { return x.id !== id; });
          state.links = state.links.filter(function (l) { return l.a !== id && l.b !== id; });
          save(); closeSheet(); render();
        } }));
      panel.appendChild(el('button', { class: 'btn quiet', text: 'Close', onclick: closeSheet }));
    });
  }

  function addPersonSheet() {
    openSheet(function (panel) {
      panel.appendChild(el('h2', { class: 'h-sec', text: 'Add someone' }));
      panel.appendChild(el('p', { class: 'p-sm', text: 'A first name or nickname is plenty. This never leaves your device.' }));
      var name = el('input', { type: 'text', placeholder: 'Name or nickname', 'aria-label': 'Name' });
      panel.appendChild(name);
      var typeSel = el('select', { 'aria-label': 'Relationship' },
        RELATIONSHIP_TYPES.map(function (t) { return el('option', { value: t.code, text: t.label }); }));
      panel.appendChild(typeSel);
      var ringSel = el('select', { 'aria-label': 'How close' }, ringDefs().map(function (r) {
        return el('option', { value: r.key, text: r.label.charAt(0) + r.label.slice(1).toLowerCase() });
      }));
      panel.appendChild(ringSel);
      panel.appendChild(el('div', { class: 'meta', text: 'When things are hard, do they help?' }));
      var sup = el('select', { 'aria-label': 'Supportive' }, [
        el('option', { value: '0.85', text: 'Usually helps' }),
        el('option', { value: '0.5', text: 'Sometimes helps' }),
        el('option', { value: '0.2', text: 'Not really' })
      ]);
      panel.appendChild(sup);
      panel.appendChild(el('button', { class: 'btn', text: 'Add', onclick: function () {
        var n = name.value.trim();
        if (!n) { name.focus(); return; }
        state.people.push({ id: uid(), name: n.slice(0, 24), type: typeSel.value, ring: ringSel.value,
          supportive: parseFloat(sup.value), drain: 1 - parseFloat(sup.value),
          hard: false, suggestible: true, lastContact: null });
        save(); closeSheet(); render();
      } }));
      panel.appendChild(el('button', { class: 'btn quiet', text: 'Cancel', onclick: closeSheet }));
    });
  }

  function renderMap() {
    var v = $('#view-map'); clear(v);
    v.appendChild(el('div', {}, [
      el('p', { class: 'eyebrow', text: 'Constellation' }),
      el('h1', { class: 'h-voice', text: 'The people around you.' })
    ]));

    if (!state.people.length) {
      v.appendChild(el('div', { class: 'card' }, [
        el('p', { class: 'p-voice', text: 'You at the centre. The people in your life placed by how close they actually feel — not how close they’re supposed to feel.' }),
        el('p', { class: 'p-sm', text: 'Nobody else ever sees this. It stays on your device.' }),
        el('button', { class: 'btn', text: 'Add the first person', onclick: addPersonSheet })
      ]));
    } else {
      var wrap = el('div', { class: 'map-wrap' });
      wrap.appendChild(el('div', { html: '<svg id="map" viewBox="0 0 400 400" role="img" aria-label="Your constellation"></svg>' }));
      var legend = el('div', { class: 'legend' });
      RELATIONSHIP_TYPES.forEach(function (t) {
        if (!state.people.some(function (p) { return p.type === t.code; })) return;
        legend.appendChild(el('span', { html: '<i style="background:var(' + t.cssVar + ')"></i>' + t.label }));
      });
      if (state.people.some(function (p) { return p.hard; })) {
        legend.appendChild(el('span', { html: '<i style="border:1.5px dashed var(--ink-3)"></i>Hard right now' }));
      }
      wrap.appendChild(legend);
      v.appendChild(wrap);

      v.appendChild(el('button', { class: 'btn ghost', text: 'Add someone', onclick: addPersonSheet }));
      v.appendChild(el('div', {}, [
        el('p', { class: 'eyebrow', text: 'Rings' }),
        el('div', { class: 'chips' }, [3, 4, 5].map(function (n) {
          return el('button', { class: 'chip', 'aria-pressed': state.rings === n ? 'true' : 'false',
            text: n + ' rings', onclick: function () { state.rings = n; save(); render(); } });
        }))
      ]));
      v.appendChild(el('p', { class: 'p-sm', text: 'Tap anyone to move them, or to mark that things are hard with them right now.' }));
    }
    v.appendChild(el('button', { class: 'help-btn', text: 'I need help now', onclick: openPanic }));
  }

  /* ── Now ───────────────────────────────────────────────────────────────── */
  function greeting() {
    var h = new Date().getHours();
    if (h < 5) return 'It’s late.';
    if (h < 12) return 'Good morning.';
    if (h < 18) return 'Good afternoon.';
    return 'Good evening.';
  }

  function renderNow() {
    var v = $('#view-now'); clear(v);
    v.appendChild(el('div', {}, [
      el('p', { class: 'eyebrow', text: new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }) }),
      el('h1', { class: 'h-voice', text: greeting() })
    ]));

    var states = ['Steady', 'Wired', 'Flat', 'Heavy', 'Not sure'];
    var rc = currentCheckin();
    var today = rc && (Date.now() - rc.t < 6 * 3600 * 1000) ? rc.state : null;
    v.appendChild(el('div', {}, [
      el('p', { class: 'p-voice', text: 'How are you arriving right now?' }),
      el('div', { style: 'height:11px' }),
      el('div', { class: 'chips' }, states.map(function (s) {
        return el('button', { class: 'chip', 'aria-pressed': today === s ? 'true' : 'false', text: s,
          onclick: function () { state.checkins.push({ t: Date.now(), state: s }); buzz(10); save(); render(); } });
      }))
    ]));

    var pick = suggestSkill();
    var dm = DOMAIN_META[pick.skill.domain];
    v.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'card-head' }, [
        el('h2', { class: 'card-title', text: pick.skill.name }),
        el('span', { class: 'domain', style: 'color:var(' + dm.cssVar + ')', text: dm.label })
      ]),
      el('p', { class: 'meta', text: pick.skill.mins + ' min · works offline' }),
      el('p', { class: 'reason', text: reasonText(pick) }),
      el('button', { class: 'btn', text: 'Begin', onclick: function () { startSkill(pick.skill.id); } }),
      el('button', { class: 'btn quiet', text: 'Why this one?', onclick: function () { skillSheet(pick.skill.id); } })
    ]));

    var person = suggestPerson();
    if (person) {
      v.appendChild(el('div', { class: 'card' }, [
        el('div', { class: 'card-head' }, [
          el('h2', { class: 'card-title', text: 'Message ' + person.name + '?' }),
          el('span', { class: 'domain', style: 'color:var(--connect)', text: 'Connect' })
        ]),
        el('p', { class: 'reason', text: 'You said ' + person.name + ' usually helps when things are hard.' }),
        el('p', { class: 'p-sm', text: 'SoulCap never sends anything. This just opens your own messages.' }),
        el('a', { class: 'btn ghost', href: 'sms:', style: 'text-decoration:none', text: 'Open messages' })
      ]));
    }

    var recent = state.checkins.slice(-7);
    if (recent.length > 1) {
      var order = { Steady: 8, 'Not sure': 18, Flat: 26, Wired: 31, Heavy: 37 };
      var pts = recent.map(function (c, i) {
        return (6 + i * (268 / Math.max(recent.length - 1, 1))).toFixed(0) + ',' + (order[c.state] || 20);
      }).join(' ');
      v.appendChild(el('div', {}, [
        el('p', { class: 'eyebrow', text: 'Recent check-ins · ' + recent.length }),
        el('div', { class: 'spark', html:
          '<svg viewBox="0 0 280 46" preserveAspectRatio="none" width="100%" height="46" aria-hidden="true">' +
          '<polyline points="' + pts + '" fill="none" stroke="var(--accent)" stroke-width="2" ' +
          'stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/></svg>' })
      ]));
    }

    v.appendChild(el('button', { class: 'help-btn', text: 'I need help now', onclick: openPanic }));
  }

  /* ── Skills ────────────────────────────────────────────────────────────── */
  function renderSkills() {
    var v = $('#view-skills'); clear(v);
    v.appendChild(el('div', {}, [
      el('p', { class: 'eyebrow', text: 'All techniques · ' + SKILLS.length }),
      el('h1', { class: 'h-voice', text: 'Things that help.' })
    ]));
    v.appendChild(el('div', { class: 'notice', html:
      '<b>Not yet clinically reviewed.</b> These are drawn from established, publicly ' +
      'documented techniques with their sources listed, but no licensed clinician has ' +
      'signed them off yet. They are not treatment.' }));

    Object.keys(FAMILY_META).forEach(function (fam) {
      var items = SKILLS.filter(function (s) { return s.family === fam; });
      if (!items.length) return;
      v.appendChild(el('div', {}, [
        el('p', { class: 'domain', style: 'color:var(--ink-3);margin:14px 0 3px', text: FAMILY_META[fam].label }),
        el('p', { class: 'p-sm', style: 'margin-bottom:10px', text: FAMILY_META[fam].note })
      ]));
      items.forEach(function (s) { v.appendChild(skillCard(s, true)); });
    });
    v.appendChild(el('button', { class: 'help-btn', text: 'I need help now', onclick: openPanic }));
  }

  /* ── Safety plan ───────────────────────────────────────────────────────── */
  function safetyPlanSheet() {
    openSheet(function (p) {
      p.appendChild(el('h2', { class: 'h-sec', text: 'My plan' }));
      p.appendChild(el('p', { class: 'p-sm', text: 'Written now, while you have room to think. It’ll be here when you don’t.' }));
      SAFETY_PLAN_STEPS.forEach(function (step) {
        var ta = el('textarea', { placeholder: step.placeholder, 'aria-label': step.title });
        ta.value = state.safetyPlan[step.key] || '';
        ta.addEventListener('change', function () {
          state.safetyPlan[step.key] = ta.value;
          save();
        });
        p.appendChild(el('div', {}, [
          el('p', { class: 'eyebrow', style: 'margin-top:10px', text: step.title }),
          el('p', { class: 'p-sm', style: 'margin-bottom:8px', text: step.hint }),
          ta
        ]));
      });
      p.appendChild(el('button', { class: 'btn', text: 'Done', onclick: function () { save(); closeSheet(); render(); } }));
    });
  }

  function planFilled() {
    return SAFETY_PLAN_STEPS.filter(function (s) {
      return (state.safetyPlan[s.key] || '').trim().length > 0;
    }).length;
  }

  /* ── Me ────────────────────────────────────────────────────────────────── */
  function renderMe() {
    var v = $('#view-me'); clear(v);
    v.appendChild(el('div', {}, [
      el('p', { class: 'eyebrow', text: 'About you' }),
      el('h1', { class: 'h-voice', text: 'What SoulCap knows.' })
    ]));

    // Safety plan
    var filled = planFilled();
    v.appendChild(el('button', { class: 'card tap', onclick: safetyPlanSheet }, [
      el('div', { class: 'card-head' }, [
        el('h2', { class: 'card-title', text: 'My plan' }),
        el('span', { class: 'pill', text: filled + '/' + SAFETY_PLAN_STEPS.length })
      ]),
      el('p', { class: 'p-sm', text: filled
        ? 'Your warning signs, what helps, and who to tell. Tap to update.'
        : 'Write it while you’re steady, so it’s ready when you’re not. Six short prompts.' })
    ]));

    // Journey
    var runs = state.skillRuns.length, helped = state.skillRuns.filter(function (r) { return r.helpful; }).length;
    if (runs) {
      var top = {};
      state.skillRuns.forEach(function (r) { if (r.helpful) top[r.id] = (top[r.id] || 0) + 1; });
      var best = Object.keys(top).sort(function (a, b) { return top[b] - top[a]; })[0];
      var bestSkill = best ? SKILLS.filter(function (s) { return s.id === best; })[0] : null;
      v.appendChild(el('div', { class: 'card' }, [
        el('h2', { class: 'card-title', text: 'Your journey' }),
        el('p', { class: 'p', text: runs + ' exercise' + (runs === 1 ? '' : 's') + ' so far · ' +
          helped + ' helped · ' + state.checkins.length + ' check-in' + (state.checkins.length === 1 ? '' : 's') }),
        bestSkill ? el('p', { class: 'reason', text: bestSkill.name + ' seems to work best for you.' }) : null,
        el('p', { class: 'p-sm', text: 'No score, no rating. Just what’s happened.' })
      ]));
    }

    // Trust tiers
    var rows = el('div', {}); var any = false;
    state.concerns.forEach(function (c) {
      any = true;
      rows.appendChild(el('div', { class: 'row' }, [
        el('div', {}, [el('div', { class: 'lab', text: c }), el('div', { class: 'sub', text: 'You picked this when you started' })]),
        el('span', { class: 'tier declared', text: 'You said' })
      ]));
    });
    var helpful = {};
    state.skillRuns.forEach(function (r) { if (r.helpful === true) helpful[r.id] = (helpful[r.id] || 0) + 1; });
    Object.keys(helpful).forEach(function (id) {
      var s = SKILLS.filter(function (x) { return x.id === id; })[0];
      if (!s) return;
      any = true;
      rows.appendChild(el('div', { class: 'row' }, [
        el('div', {}, [el('div', { class: 'lab', text: s.name + ' seems to help' }),
                       el('div', { class: 'sub', text: 'You said it helped ' + helpful[id] + ' time' + (helpful[id] > 1 ? 's' : '') })]),
        el('span', { class: 'tier observed', text: 'Observed' })
      ]));
    });
    var lateCount = state.checkins.filter(function (c) {
      var h = new Date(c.t).getHours(); return h >= 22 || h <= 4;
    }).length;
    var inf = state.inferences.filter(function (i) { return i.id === 'late-nights'; })[0];
    if (lateCount >= 3 && !inf) {
      any = true;
      rows.appendChild(el('div', { class: 'row' }, [
        el('div', {}, [
          el('div', { class: 'lab', text: 'Nights might be harder for you' }),
          el('div', { class: 'sub', text: 'Guessed from when you check in. Is that right?' }),
          el('div', { style: 'display:flex;gap:8px;margin-top:11px' }, [
            el('button', { class: 'chip', text: 'Yes', onclick: function () { setInference('late-nights', true); } }),
            el('button', { class: 'chip', text: 'Not really', onclick: function () { setInference('late-nights', false); } })
          ])
        ]),
        el('span', { class: 'tier guess', text: 'A guess' })
      ]));
    }
    if (!any) rows.appendChild(el('p', { class: 'p-voice', text: 'Nothing yet. It learns from what you tell it and what you actually use — not from watching you.' }));
    v.appendChild(rows);

    // Settings
    v.appendChild(el('hr', { class: 'sep' }));
    v.appendChild(el('p', { class: 'eyebrow', text: 'Appearance' }));
    v.appendChild(el('div', { class: 'chips' }, [
      { k: null, l: 'Auto' }, { k: 'light', l: 'Light' }, { k: 'dark', l: 'Dark' }, { k: 'night', l: 'Night' }
    ].map(function (t) {
      return el('button', { class: 'chip', 'aria-pressed': state.theme === t.k ? 'true' : 'false', text: t.l,
        onclick: function () { state.theme = t.k; save(); applyTheme(); render(); } });
    })));
    v.appendChild(el('p', { class: 'p-sm', text: 'Night is dimmer than dark — for 3am, when a normal screen is still too bright.' }));

    v.appendChild(el('p', { class: 'eyebrow', style: 'margin-top:14px', text: 'Guidance' }));
    v.appendChild(el('div', { class: 'stack' }, [
      el('button', { class: 'btn ghost', text: 'Spoken guidance: ' + (state.voice.on ? 'on' : 'off'),
        onclick: function () { state.voice.on = !state.voice.on; save(); render(); } }),
      state.voice.on ? el('button', { class: 'btn ghost', text: 'Voice & speed', onclick: voiceSheet }) : null,
      el('button', { class: 'btn ghost', text: 'Vibration: ' + (state.haptics ? 'on' : 'off'),
        onclick: function () { state.haptics = !state.haptics; save(); buzz(14); render(); } })
    ]));

    v.appendChild(el('p', { class: 'eyebrow', style: 'margin-top:14px', text: 'Constellation extras' }));
    v.appendChild(el('div', { class: 'stack' }, [
      el('button', { class: 'btn ghost', text: 'Show links between people: ' + (state.showLinks ? 'on' : 'off'),
        onclick: function () { state.showLinks = !state.showLinks; save(); render(); } }),
      el('button', { class: 'btn ghost', text: 'Track when we last spoke: ' + (state.trackContact ? 'on' : 'off'),
        onclick: function () { state.trackContact = !state.trackContact; save(); render(); } })
    ]));
    v.appendChild(el('p', { class: 'p-sm', text: 'Both off by default. Contact tracking only ever shows you the number — it will never tell you to reach out to anyone.' }));

    v.appendChild(el('p', { class: 'eyebrow', style: 'margin-top:14px', text: 'Your data' }));
    v.appendChild(el('div', { class: 'stack' }, [
      el('button', { class: 'btn ghost', text: 'Export everything', onclick: exportData }),
      el('button', { class: 'btn danger', text: 'Delete everything, permanently', onclick: confirmDelete })
    ]));

    v.appendChild(el('div', { class: 'notice', html:
      '<b>SoulCap is not therapy</b>, not a doctor, and not a crisis service. ' +
      'Nothing you write leaves this device. There is no account and no server.' }));
    v.appendChild(el('button', { class: 'help-btn', text: 'I need help now', onclick: openPanic }));
  }

  function voiceSheet() {
    loadVoices();
    openSheet(function (p) {
      p.appendChild(el('h2', { class: 'h-sec', text: 'Voice & speed' }));
      p.appendChild(el('p', { class: 'p-sm', text: 'These are the voices your device provides. On Apple hardware the higher-quality system voices appear here.' }));
      if (!voices.length) {
        p.appendChild(el('div', { class: 'notice', text: 'No voices available on this device yet. Try again in a moment.' }));
      } else {
        var sel = el('select', { 'aria-label': 'Voice' }, voices.map(function (v) {
          return el('option', { value: v.name, text: v.name, selected: state.voice.name === v.name ? 'selected' : null });
        }));
        sel.addEventListener('change', function () { state.voice.name = sel.value; save(); speak('This is how I’ll sound.'); });
        p.appendChild(sel);
      }
      [['Speed', 'rate', 0.5, 1.3, 0.05], ['Pitch', 'pitch', 0.6, 1.4, 0.05]].forEach(function (cfg) {
        var r = el('input', { type: 'range', min: cfg[2], max: cfg[3], step: cfg[4], value: state.voice[cfg[1]], 'aria-label': cfg[0] });
        r.addEventListener('change', function () {
          state.voice[cfg[1]] = parseFloat(r.value); save(); speak('Breathe out, slowly.');
        });
        p.appendChild(el('div', {}, [el('p', { class: 'eyebrow', text: cfg[0] }), r]));
      });
      p.appendChild(el('button', { class: 'btn ghost', text: 'Hear it', onclick: function () { speak('Breathe in, slowly. Hold. Breathe out.'); } }));
      p.appendChild(el('button', { class: 'btn', text: 'Done', onclick: function () { hushVoice(); closeSheet(); } }));
    });
  }

  function setInference(id, val) {
    state.inferences.push({ id: id, confirmed: val });
    if (val) state.concerns.push('Nights are harder');
    save(); render();
  }
  function exportData() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'soulcap-export.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function confirmDelete() {
    openSheet(function (p) {
      p.appendChild(el('h2', { class: 'h-sec', text: 'Delete everything?' }));
      p.appendChild(el('p', { class: 'p', text: 'Check-ins, exercises, your Constellation, your plan. This cannot be undone, and there is no backup anywhere.' }));
      p.appendChild(el('button', { class: 'btn danger', text: 'Yes, delete it all', onclick: function () {
        try { localStorage.removeItem(KEY); localStorage.removeItem('soulcap_theme'); } catch (e) {}
        state = clone(DEFAULT); closeSheet(); applyTheme(); render();
      } }));
      p.appendChild(el('button', { class: 'btn quiet', text: 'Keep my data', onclick: closeSheet }));
    });
  }

  /* ── Welcome & onboarding ──────────────────────────────────────────────── */
  var obStep = 0;
  function renderWelcome() {
    var v = $('#view-welcome'); clear(v);
    v.appendChild(el('div', { style: 'flex:1;display:flex;flex-direction:column;justify-content:center;gap:22px' }, [
      el('img', { src: 'icons/mark.svg', alt: '', width: '62', height: '62' }),
      el('h1', { class: 'h-voice', style: 'font-size:34px', text: 'A quiet place to steady yourself.' }),
      el('p', { class: 'p-voice', text: 'Techniques that work in a few minutes. A map of the people around you. Everything stays on your phone.' }),
      el('p', { class: 'p-sm', text: 'Not therapy. Not a crisis service. Just something that helps.' })
    ]));
    v.appendChild(el('div', { class: 'stack' }, [
      el('button', { class: 'btn', text: 'Begin', onclick: function () { state.welcomed = true; save(); render(); } }),
      el('button', { class: 'help-btn', text: 'I need help now', onclick: openPanic })
    ]));
  }

  function renderOnboarding() {
    var v = $('#view-onboarding'); clear(v);
    v.appendChild(el('div', { style: 'display:flex;gap:5px;margin-bottom:8px' },
      [0, 1, 2, 3].map(function (i) {
        return el('i', { style: 'height:3px;flex:1;border-radius:2px;display:block;background:' +
          (i <= obStep ? 'var(--accent)' : 'var(--line-strong)') });
      })));

    if (obStep === 0) {
      v.appendChild(el('h1', { class: 'h-voice', text: 'First — how old are you?' }));
      v.appendChild(el('p', { class: 'p', text: 'SoulCap is built for adults. We ask because the right support for someone under 18 looks different, and we’d rather point you somewhere better than get it wrong.' }));
      v.appendChild(el('div', { class: 'stack' }, [
        el('button', { class: 'opt', html: '18 or older', onclick: function () { state.ageOk = true; save(); obStep = 1; render(); } }),
        el('button', { class: 'opt', html: 'Under 18<span class="os">We’ll show you services built for younger people</span>',
          onclick: function () { state.ageOk = false; save(); render(); } })
      ]));
      if (state.ageOk === false) {
        v.appendChild(el('div', { class: 'card' }, [
          el('p', { class: 'p-voice', text: 'SoulCap isn’t the right fit yet — but these are, and they’re good.' }),
          el('a', { class: 'btn', href: 'https://findahelpline.com', target: '_blank', rel: 'noopener',
                    style: 'text-decoration:none', text: 'Find support for your age and country' })
        ]));
      }
    } else if (obStep === 1) {
      v.appendChild(el('h1', { class: 'h-voice', text: 'Where are you?' }));
      v.appendChild(el('p', { class: 'p', text: 'This sets which crisis services we show you. A helpline from the wrong country is worse than none.' }));
      v.appendChild(el('div', { class: 'stack' }, REGIONS.map(function (r) {
        return el('button', { class: 'opt', 'aria-pressed': state.region === r.code ? 'true' : 'false',
          html: r.label + (r.code === 'PK' ? '<span class="os">We show the international directory — we haven’t verified local lines yet</span>' : ''),
          onclick: function () { state.region = r.code; save(); obStep = 2; render(); } });
      })));
    } else if (obStep === 2) {
      v.appendChild(el('h1', { class: 'h-voice', text: 'What this is, plainly.' }));
      v.appendChild(el('div', { class: 'notice', html:
        '<b>SoulCap is not therapy</b>, not a doctor, and not a crisis service. It teaches skills and helps you notice patterns.' +
        '<ul style="margin:9px 0 0;padding-left:17px">' +
        '<li>Everything stays on your phone. No account, no server.</li>' +
        '<li>We never sell your data or train on it.</li>' +
        '<li>You can export or delete all of it, any time.</li>' +
        '<li>If you’re in danger, we’ll always point you to real people.</li></ul>' }));
      v.appendChild(el('button', { class: 'btn', text: 'I understand', onclick: function () { state.consent = true; save(); obStep = 3; render(); } }));
    } else {
      v.appendChild(el('h1', { class: 'h-voice', text: 'What’s been hard lately?' }));
      v.appendChild(el('p', { class: 'p', text: 'Pick any, or none. You can change this whenever — skipping doesn’t break anything.' }));
      v.appendChild(el('div', { class: 'chips' }, CONCERNS.map(function (c) {
        return el('button', { class: 'chip', 'aria-pressed': state.concerns.indexOf(c) !== -1 ? 'true' : 'false', text: c,
          onclick: function () {
            var i = state.concerns.indexOf(c);
            if (i === -1) state.concerns.push(c); else state.concerns.splice(i, 1);
            save(); render();
          } });
      })));
      v.appendChild(el('button', { class: 'btn', text: 'Start', onclick: finishOnboarding }));
      v.appendChild(el('button', { class: 'btn quiet', text: 'Skip — just let me in', onclick: finishOnboarding }));
    }
    v.appendChild(el('button', { class: 'help-btn', style: 'margin-top:auto', text: 'I need help now', onclick: openPanic }));
  }
  function finishOnboarding() {
    state.onboarded = true;
    if (!state.region) state.region = 'INTL';
    save(); render();
  }

  /* ── Router ────────────────────────────────────────────────────────────── */
  var tab = 'now';
  function selectTab(t) { tab = t; render(); window.scrollTo(0, 0); }

  var VIEWS = ['welcome', 'onboarding', 'now', 'calm', 'skills', 'map', 'me'];

  function render() {
    applyTheme();
    VIEWS.forEach(function (v) { $('#view-' + v).classList.remove('on'); });

    if (!state.welcomed) {
      $('#tabs').style.display = 'none';
      $('#fab').classList.remove('on');
      renderWelcome(); $('#view-welcome').classList.add('on'); return;
    }
    if (!state.onboarded) {
      $('#tabs').style.display = 'none';
      $('#fab').classList.remove('on');
      renderOnboarding(); $('#view-onboarding').classList.add('on'); return;
    }
    $('#tabs').style.display = 'flex';
    $('#fab').classList.add('on');

    if (tab === 'now') renderNow();
    if (tab === 'calm') renderCalm();
    if (tab === 'skills') renderSkills();
    if (tab === 'map') renderMap();
    if (tab === 'me') renderMe();
    $('#view-' + tab).classList.add('on');

    Array.prototype.forEach.call($('#tabs').children, function (b) {
      b.setAttribute('aria-selected', b.dataset.tab === tab ? 'true' : 'false');
    });
    if (tab === 'map' && state.people.length) drawMap();
  }

  /* ── Demo ──────────────────────────────────────────────────────────────── */
  function seedDemo() {
    state = clone(DEFAULT);
    state.welcomed = true; state.onboarded = true; state.ageOk = true;
    // Pakistan is the target market — demo shows what those users actually see
    // (the international directory), not a region-specific list they'd never get.
    state.region = 'PK'; state.consent = true;
    state.concerns = ['Hard to switch off', 'Low mood'];
    var day = 86400000, now = Date.now();
    ['Wired','Flat','Steady','Heavy','Wired','Steady'].forEach(function (s, i) {
      state.checkins.push({ t: now - (6 - i) * day, state: s });
    });
    state.skillRuns.push({ t: now - 3 * day, id: 'box-breathing', helpful: true });
    state.skillRuns.push({ t: now - 2 * day, id: 'box-breathing', helpful: true });
    state.skillRuns.push({ t: now - day, id: 'grounding-54321', helpful: true });
    state.favourites = ['physiological-sigh'];
    state.people = [
      { id: uid(), name: 'Amina', type: 'FAMILY', ring: 'r0', supportive: .85, drain: .15, hard: false, suggestible: true, lastContact: now - 9 * day },
      { id: uid(), name: 'Bilal', type: 'FRIEND', ring: 'r0', supportive: .7, drain: .3, hard: false, suggestible: true, lastContact: null },
      { id: uid(), name: 'Mum', type: 'FAMILY', ring: 'r1', supportive: .6, drain: .4, hard: false, suggestible: true, lastContact: null },
      { id: uid(), name: 'Dr. Naveed', type: 'CARE', ring: 'r1', supportive: .8, drain: .2, hard: false, suggestible: false, lastContact: null },
      { id: uid(), name: 'Usman', type: 'COLLEAGUE', ring: 'r2', supportive: .3, drain: .6, hard: false, suggestible: true, lastContact: null },
      { id: uid(), name: 'Dad', type: 'FAMILY', ring: 'r2', supportive: .3, drain: .8, hard: true, suggestible: true, lastContact: null }
    ];
    save();
  }

  /* ── Boot ──────────────────────────────────────────────────────────────── */
  function boot() {
    if (location.search.indexOf('demo=1') !== -1) seedDemo();

    $('#panicExit').addEventListener('click', closePanic);
    $('#runClose').addEventListener('click', closeRunner);
    $('#runGuide').addEventListener('click', toggleGuide);
    $('#sheetScrim').addEventListener('click', closeSheet);
    $('#fab').addEventListener('click', function () { buzz(14); openPanic(); });

    Array.prototype.forEach.call($('#tabs').children, function (b) {
      b.addEventListener('click', function () { buzz(8); selectTab(b.dataset.tab); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if ($('#sheet').classList.contains('on')) closeSheet();
      else if ($('#runner').classList.contains('on')) closeRunner();
      else if ($('#panic').classList.contains('on')) closePanic();
    });

    window.addEventListener('offline', function () { $('#offline').hidden = false; });
    window.addEventListener('online', function () { $('#offline').hidden = true; });
    if (!navigator.onLine) $('#offline').hidden = false;

    if ('speechSynthesis' in window) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    render();

    // Splash holds briefly, then hands over. Skipped entirely for returning
    // users in a hurry — tapping anywhere dismisses it.
    var splash = $('#splash');
    var dismiss = function () { splash.classList.add('gone'); };
    setTimeout(dismiss, state.onboarded ? 1500 : 2300);
    splash.addEventListener('click', dismiss);

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () {});
      });
    }
  }

  // Exposed for tests only.
  window.__soulcap = {
    assessRisk: assessRisk, suggestSkill: suggestSkill, suggestPerson: suggestPerson,
    getState: function () { return state; }, skillCount: SKILLS.length
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
