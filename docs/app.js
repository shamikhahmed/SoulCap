/* SoulCap — application logic
 * Local-first. Nothing leaves the device. No network calls, no analytics, no LLM.
 */
(function () {
  'use strict';

  // ── Safety kernel ────────────────────────────────────────────────────────
  // Ported from backend SafetyGateService so the two cannot drift independently.
  // This is the ONLY place risk is assessed. Tier 3 is terminal: it hands off to
  // the hard-coded crisis surface and no other path may override it.

  // Inflected forms matter: "end my life" is NOT a substring of "ending my life",
  // so a list of base forms alone lets the most common phrasings through. Every
  // stem here is listed in the forms people actually type.
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
    'everyone would be better without me','better off without me',
    'kms'
  ];
  var CRISIS_CONTEXTUAL = ['saying goodbye','giving away','farewell','final note','last message'];
  var DISTRESS_CONTEXT = [
    'pain','hopeless','desperate',"can't take",'exhausted','done','over',
    'anymore','nothing left','end it','tired of living','worthless'
  ];
  var ELEVATED = [
    'think about dying','wish i was dead','fantasize about death',
    'nothing matters','completely hopeless','no way out','never gets better',
    "can't go on",'too much pain','done with everything',"don't want to wake up"
  ];

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

  // ── State ────────────────────────────────────────────────────────────────
  var KEY = 'soulcap_v1';
  var DEFAULT = {
    v: 1, onboarded: false, ageOk: null, region: null, consent: false,
    concerns: [], checkins: [], skillRuns: [], people: [], inferences: [], theme: null
  };
  var state = load();

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return clone(DEFAULT);
      var parsed = JSON.parse(raw);
      return Object.assign(clone(DEFAULT), parsed);
    } catch (e) { return clone(DEFAULT); }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function uid() { return Math.random().toString(36).slice(2, 10); }

  // ── DOM helpers ──────────────────────────────────────────────────────────
  function $(sel, root) { return (root || document).querySelector(sel); }
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

  // ── Theme ────────────────────────────────────────────────────────────────
  function applyTheme() {
    if (state.theme) document.documentElement.setAttribute('data-theme', state.theme);
    else document.documentElement.removeAttribute('data-theme');
    // Mirrored to its own key so the pre-paint script in index.html can read it
    // without parsing the whole state blob. Keep the two in sync.
    try {
      if (state.theme) localStorage.setItem('soulcap_theme', state.theme);
      else localStorage.removeItem('soulcap_theme');
    } catch (e) { /* private mode */ }
  }
  function toggleTheme() {
    var dark = state.theme
      ? state.theme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    state.theme = dark ? 'light' : 'dark';
    save(); applyTheme(); render();
  }

  // ── Crisis surface ───────────────────────────────────────────────────────
  function crisisList() {
    var r = REGIONS.filter(function (x) { return x.code === state.region; })[0];
    return CRISIS[(r && r.crisis) || 'INTL'];
  }

  function openPanic() {
    var p = $('#panic');
    p.classList.add('on');
    p.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    runPacer();
    $('#panicExit').focus();
  }
  function closePanic() {
    var p = $('#panic');
    p.classList.remove('on');
    p.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    stopPacer();
  }

  var pacerTimer = null, pacerPhase = 0;
  var PHASES = [
    { label: 'Breathe in, slowly.', scale: 1 },
    { label: 'Hold.', scale: 1 },
    { label: 'Breathe out, slowly.', scale: 0.7 },
    { label: 'Hold.', scale: 0.7 }
  ];
  function runPacer() {
    stopPacer();
    pacerPhase = 0;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var circle = $('#pacer');
    var count = $('#pacerCount');
    var label = $('#panicInstruction');
    var step = $('#panicStep');

    function tick() {
      var ph = PHASES[pacerPhase % 4];
      label.textContent = ph.label;
      step.textContent = 'Step ' + ((pacerPhase % 4) + 1) + ' of 4';
      if (!reduced) circle.style.transform = 'scale(' + ph.scale + ')';
      var n = 4;
      count.textContent = n;
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

  function renderCrisisLinks(container) {
    clear(container);
    // Only the first line is filled. Three blocks of alarm red is the opposite of
    // calming at the moment someone least needs it, and spending the reserved
    // colour three times over drains the signal from all of them.
    crisisList().forEach(function (c, i) {
      var node = c.href
        ? el('a', {
            href: c.href,
            class: 'btn ' + (i === 0 ? 'panic-call' : 'crisis-alt'),
            style: 'text-decoration:none',
            text: c.name + ' — ' + c.detail
          })
        : el('div', { class: 'notice', text: c.name + ' — ' + c.detail });
      container.appendChild(node);
    });
  }

  // ── Skill selection ──────────────────────────────────────────────────────
  function capacityRank(c) { return c === 'low' ? 0 : c === 'medium' ? 1 : 2; }

  function latestCheckin() { return state.checkins.length ? state.checkins[state.checkins.length - 1] : null; }

  /** Only a recent check-in describes how someone is *now*. Anything older is history,
   *  and citing it as current state ("you said you're feeling steady") reads as wrong. */
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
    var good = runs.filter(function (r) { return r.helpful === true; }).length;
    return (good / runs.length) * 2;
  }

  function suggestSkill() {
    var cap = currentCapacity();
    var last = currentCheckin();
    var recent = state.skillRuns.slice(-3).map(function (r) { return r.id; });

    var pool = SKILLS.filter(function (s) {
      if (cap === 'low' && capacityRank(s.capacity) > 0) return false;
      if (cap === 'medium' && capacityRank(s.capacity) > 1) return false;
      return true;
    });
    if (!pool.length) pool = SKILLS.slice();

    var scored = pool.map(function (s) {
      var score = 0;
      var why = [];
      var h = helpfulScore(s.id);
      if (h > 0) { score += h; why.push('it has helped you before'); }
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
        if (k.indexOf('panic') !== -1 && s.domain === 'breath') { score += 1; why.push('you mentioned panic'); }
        if (k.indexOf('low mood') !== -1 && s.domain === 'move') { score += 1; why.push('you mentioned low mood'); }
      });
      // Late at night, sleep beats everything else. Offering an 8-minute values
      // exercise at 1am is the wrong answer no matter what the other signals say.
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

  // ── Skill runner ─────────────────────────────────────────────────────────
  var runState = null;
  function startSkill(id) {
    var s = SKILLS.filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    runState = { skill: s, i: 0 };
    $('#runner').classList.add('on');
    $('#runner').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderRunner();
  }
  function renderRunner() {
    var s = runState.skill;
    var done = runState.i >= s.steps.length;
    $('#runStep').textContent = done ? 'Done' : 'Step ' + (runState.i + 1) + ' of ' + s.steps.length;
    $('#runText').textContent = done ? 'That’s it. Did that help at all?' : s.steps[runState.i];
    var actions = $('#runActions');
    clear(actions);
    if (done) {
      actions.appendChild(el('button', { class: 'btn', text: 'It helped', onclick: function () { finishSkill(true); } }));
      actions.appendChild(el('button', { class: 'btn ghost', text: 'Not really', onclick: function () { finishSkill(false); } }));
      actions.appendChild(el('button', { class: 'btn quiet', text: 'Skip', onclick: function () { finishSkill(null); } }));
    } else {
      actions.appendChild(el('button', { class: 'btn', text: runState.i === s.steps.length - 1 ? 'Finish' : 'Next',
        onclick: function () { runState.i++; renderRunner(); } }));
      actions.appendChild(el('button', { class: 'btn quiet', text: 'Stop — no problem', onclick: function () { closeRunner(); } }));
    }
  }
  function finishSkill(helpful) {
    state.skillRuns.push({ t: Date.now(), id: runState.skill.id, helpful: helpful });
    save();
    closeRunner();
    render();
  }
  function closeRunner() {
    $('#runner').classList.remove('on');
    $('#runner').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    runState = null;
  }

  // ── Sheet ────────────────────────────────────────────────────────────────
  function openSheet(build) {
    var panel = $('#sheetPanel');
    clear(panel);
    build(panel);
    $('#sheet').classList.add('on');
    $('#sheet').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var f = panel.querySelector('button, input, select, a');
    if (f) f.focus();
  }
  function closeSheet() {
    $('#sheet').classList.remove('on');
    $('#sheet').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ── Constellation ────────────────────────────────────────────────────────
  var RINGS = [
    { key: 'close',   label: 'CLOSE',   r: 62  },
    { key: 'present', label: 'PRESENT', r: 106 },
    { key: 'distant', label: 'DISTANT', r: 150 }
  ];

  function typeMeta(code) {
    return RELATIONSHIP_TYPES.filter(function (t) { return t.code === code; })[0] || RELATIONSHIP_TYPES[5];
  }

  function drawMap() {
    var svg = $('#map');
    clear(svg);
    var NS = 'http://www.w3.org/2000/svg';
    function s(tag, attrs) {
      var n = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
      return n;
    }
    RINGS.forEach(function (ring) {
      svg.appendChild(s('circle', { class: 'orbit', cx: 200, cy: 200, r: ring.r }));
      // Offset left of centre: node placement favours the vertical axis, and a
      // centred label collides with whichever node lands nearest the top.
      var lab = s('text', { class: 'orbit-lab', x: 146, y: 200 - ring.r + 14, 'text-anchor': 'middle' });
      lab.textContent = ring.label;
      svg.appendChild(lab);
    });
    svg.appendChild(s('circle', { cx: 200, cy: 200, r: 30, fill: 'var(--accent)' }));
    var you = s('text', { class: 'sun-lab', x: 200, y: 205 });
    you.textContent = 'You';
    svg.appendChild(you);

    RINGS.forEach(function (ring, ringIndex) {
      var people = state.people.filter(function (p) { return p.ring === ring.key; });
      // Each ring gets its own phase offset, otherwise every ring starts at the
      // same angle and the nodes stack into a vertical line.
      var phase = -Math.PI / 2 + 0.4 + ringIndex * 1.1;
      people.forEach(function (p, i) {
        var angle = phase + (i / Math.max(people.length, 1)) * Math.PI * 2;
        var x = 200 + ring.r * Math.cos(angle);
        var y = 200 + ring.r * Math.sin(angle);
        var g = s('g', { class: 'node' + (p.hard ? ' hard' : ''), tabindex: '0', role: 'button',
                         'aria-label': p.name + ', ' + typeMeta(p.type).label });
        var c = s('circle', { cx: x, cy: y, r: 14, fill: 'var(' + typeMeta(p.type).cssVar + ')',
                              stroke: p.hard ? 'var(--ink-3)' : 'var(--surface)', 'stroke-width': p.hard ? 1.5 : 2 });
        if (p.hard) c.setAttribute('stroke-dasharray', '3 3');
        // Label sits on the far side of the node from the centre, so it never
        // covers an inner ring's node.
        var t = s('text', { class: 'node-lab', x: x, y: y + (y >= 200 ? 31 : -21) });
        t.textContent = p.name;
        g.appendChild(c); g.appendChild(t);
        g.addEventListener('click', function () { personSheet(p.id); });
        g.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); personSheet(p.id); }
        });
        svg.appendChild(g);
      });
    });
  }

  function suggestPerson() {
    var last = latestCheckin();
    if (last && (last.state === 'Heavy' || last.state === 'Wired')) {
      // still allowed — but never at risk tier >= 2, enforced by caller
    }
    var pool = state.people.filter(function (p) {
      return !p.hard && p.suggestible !== false && p.supportive >= 0.5 && p.drain <= 0.6;
    });
    if (!pool.length) return null;
    pool.sort(function (a, b) {
      var sa = a.supportive - a.drain + (a.ring === 'close' ? 0.5 : a.ring === 'present' ? 0.2 : 0);
      var sb = b.supportive - b.drain + (b.ring === 'close' ? 0.5 : b.ring === 'present' ? 0.2 : 0);
      return sb - sa;
    });
    return pool[0];
  }

  function personSheet(id) {
    var p = state.people.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    openSheet(function (panel) {
      panel.appendChild(el('h2', { class: 'h-sec', text: p.name }));
      panel.appendChild(el('p', { class: 'eyebrow', text: typeMeta(p.type).label + ' · ' + p.ring }));

      [['Feels supportive', 'supportive'], ['Costs me energy', 'drain']].forEach(function (pair) {
        var wrap = el('div', {}, [
          el('div', { class: 'meta', text: pair[0] }),
          el('div', { class: 'bar' }, [el('i', { style: 'width:' + Math.round(p[pair[1]] * 100) + '%' })])
        ]);
        panel.appendChild(wrap);
      });

      panel.appendChild(el('hr', { class: 'sep' }));

      var hardBtn = el('button', {
        class: 'btn ' + (p.hard ? '' : 'ghost'),
        text: p.hard ? 'This is hard right now — on' : 'Mark “hard right now”',
        onclick: function () {
          p.hard = !p.hard; save(); closeSheet(); render();
        }
      });
      panel.appendChild(hardBtn);
      panel.appendChild(el('p', { class: 'p-sm', text: p.hard
        ? 'While this is on, SoulCap will never suggest contacting them, and won’t mention how long it’s been.'
        : 'Turn this on and they’re excluded from every suggestion. No nudges to reconcile, ever.' }));

      panel.appendChild(el('button', { class: 'btn danger', text: 'Remove from Constellation',
        onclick: function () {
          state.people = state.people.filter(function (x) { return x.id !== id; });
          save(); closeSheet(); render();
        } }));
      panel.appendChild(el('button', { class: 'btn quiet', text: 'Close', onclick: closeSheet }));
    });
  }

  function addPersonSheet() {
    openSheet(function (panel) {
      panel.appendChild(el('h2', { class: 'h-sec', text: 'Add someone' }));
      panel.appendChild(el('p', { class: 'p-sm', text: 'A first name or nickname is plenty. This stays on your device.' }));

      var name = el('input', { type: 'text', placeholder: 'Name or nickname', 'aria-label': 'Name' });
      panel.appendChild(name);

      var typeSel = el('select', { 'aria-label': 'Relationship' },
        RELATIONSHIP_TYPES.map(function (t) { return el('option', { value: t.code, text: t.label }); }));
      panel.appendChild(typeSel);

      var ringSel = el('select', { 'aria-label': 'How close' }, RINGS.map(function (r) {
        return el('option', { value: r.key, text: r.label.charAt(0) + r.label.slice(1).toLowerCase() });
      }));
      panel.appendChild(ringSel);

      var sup = el('select', { 'aria-label': 'Supportive' }, [
        el('option', { value: '0.85', text: 'Usually helps' }),
        el('option', { value: '0.5', text: 'Sometimes helps' }),
        el('option', { value: '0.2', text: 'Not really' })
      ]);
      panel.appendChild(el('div', { class: 'meta', text: 'When things are hard, do they help?' }));
      panel.appendChild(sup);

      panel.appendChild(el('button', { class: 'btn', text: 'Add', onclick: function () {
        var n = name.value.trim();
        if (!n) { name.focus(); return; }
        state.people.push({
          id: uid(), name: n.slice(0, 24), type: typeSel.value, ring: ringSel.value,
          supportive: parseFloat(sup.value), drain: 1 - parseFloat(sup.value),
          hard: false, suggestible: true
        });
        save(); closeSheet(); render();
      } }));
      panel.appendChild(el('button', { class: 'btn quiet', text: 'Cancel', onclick: closeSheet }));
    });
  }

  // ── Views ────────────────────────────────────────────────────────────────
  function greeting() {
    var h = new Date().getHours();
    if (h < 5) return 'It’s late.';
    if (h < 12) return 'Good morning.';
    if (h < 18) return 'Good afternoon.';
    return 'Good evening.';
  }

  function renderNow() {
    var v = $('#view-now');
    clear(v);

    v.appendChild(el('div', {}, [
      el('p', { class: 'eyebrow', text: new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }) }),
      el('h1', { class: 'h-voice', text: greeting() })
    ]));

    // check-in
    var states = ['Steady', 'Wired', 'Flat', 'Heavy', 'Not sure'];
    var recentCheck = currentCheckin();
    var today = recentCheck && (Date.now() - recentCheck.t < 6 * 3600 * 1000) ? recentCheck.state : null;
    var chips = el('div', { class: 'chips' }, states.map(function (s) {
      return el('button', {
        class: 'chip', 'aria-pressed': today === s ? 'true' : 'false', text: s,
        onclick: function () { state.checkins.push({ t: Date.now(), state: s }); save(); render(); }
      });
    }));
    v.appendChild(el('div', {}, [
      el('p', { class: 'p-voice', text: 'How are you arriving right now?' }),
      el('div', { style: 'height:11px' }), chips
    ]));

    // suggestion
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
      el('button', { class: 'btn quiet', text: 'Something else', onclick: function () { selectTab('skills'); } })
    ]));

    // constellation nudge — never at elevated risk
    var person = suggestPerson();
    if (person) {
      v.appendChild(el('div', { class: 'card' }, [
        el('div', { class: 'card-head' }, [
          el('h2', { class: 'card-title', text: 'Message ' + person.name + '?' }),
          el('span', { class: 'domain', style: 'color:var(--connect)', text: 'Connect' })
        ]),
        el('p', { class: 'reason', text: 'You said ' + person.name + ' usually helps when things are hard.' }),
        el('p', { class: 'p-sm', text: 'SoulCap never sends anything. This just opens your own messages.' }),
        el('button', { class: 'btn ghost', text: 'Open messages', onclick: function () {
          window.location.href = 'sms:';
        } })
      ]));
    }

    // week strip
    var recent = state.checkins.slice(-7);
    if (recent.length > 1) {
      var pts = recent.map(function (c, i) {
        var order = { Steady: 6, 'Not sure': 18, Flat: 26, Wired: 30, Heavy: 36 };
        var x = 6 + (i * (268 / Math.max(recent.length - 1, 1)));
        return x.toFixed(0) + ',' + (order[c.state] || 20);
      }).join(' ');
      v.appendChild(el('div', {}, [
        el('p', { class: 'eyebrow', text: 'Recent check-ins · ' + recent.length }),
        el('div', { class: 'spark', html:
          '<svg viewBox="0 0 280 44" preserveAspectRatio="none" width="100%" height="44" aria-hidden="true">' +
          '<polyline points="' + pts + '" fill="none" stroke="var(--accent)" stroke-width="2" ' +
          'stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/></svg>' })
      ]));
    }

    v.appendChild(el('button', { class: 'help-btn', text: 'I need help now', onclick: openPanic }));
  }

  function renderSkills() {
    var v = $('#view-skills');
    clear(v);
    v.appendChild(el('div', {}, [
      el('p', { class: 'eyebrow', text: 'All skills' }),
      el('h1', { class: 'h-voice', text: 'Things that help.' })
    ]));

    v.appendChild(el('div', { class: 'notice', html:
      '<b>Not yet clinically reviewed.</b> These are drawn from established, publicly ' +
      'documented techniques, but no licensed clinician has signed them off yet. ' +
      'They are not treatment.' }));

    Object.keys(DOMAIN_META).forEach(function (d) {
      var items = SKILLS.filter(function (s) { return s.domain === d; });
      if (!items.length) return;
      var dm = DOMAIN_META[d];
      var group = el('div', {}, [
        el('p', { class: 'domain', style: 'color:var(' + dm.cssVar + ');margin:0 0 9px', text: dm.label })
      ]);
      items.forEach(function (s) {
        group.appendChild(el('button', {
          class: 'opt', style: 'margin-bottom:8px', onclick: function () { startSkill(s.id); },
          html: '<span>' + s.name + '</span><span class="os">' + s.blurb + ' · ' + s.mins + ' min</span>'
        }));
      });
      v.appendChild(group);
    });

    v.appendChild(el('button', { class: 'help-btn', text: 'I need help now', onclick: openPanic }));
  }

  function renderMap() {
    var v = $('#view-map');
    clear(v);
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
      wrap.appendChild(el('div', { html:
        '<svg id="map" viewBox="0 0 400 400" role="img" aria-label="Your constellation"></svg>' }));
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
      v.appendChild(el('p', { class: 'p-sm', text: 'Tap anyone to change how they sit, or to mark that things are hard with them right now.' }));
    }

    v.appendChild(el('button', { class: 'help-btn', text: 'I need help now', onclick: openPanic }));
  }

  function renderMe() {
    var v = $('#view-me');
    clear(v);
    v.appendChild(el('div', {}, [
      el('p', { class: 'eyebrow', text: 'About you' }),
      el('h1', { class: 'h-voice', text: 'What SoulCap thinks it knows.' })
    ]));

    var rows = el('div', {});
    var any = false;

    state.concerns.forEach(function (c) {
      any = true;
      rows.appendChild(el('div', { class: 'row' }, [
        el('div', {}, [el('div', { class: 'lab', text: c }), el('div', { class: 'sub', text: 'You picked this when you started' })]),
        el('span', { class: 'tier declared', text: 'You said' })
      ]));
    });

    var helpful = {};
    state.skillRuns.forEach(function (r) {
      if (r.helpful === true) helpful[r.id] = (helpful[r.id] || 0) + 1;
    });
    Object.keys(helpful).forEach(function (id) {
      var s = SKILLS.filter(function (x) { return x.id === id; })[0];
      if (!s) return;
      any = true;
      rows.appendChild(el('div', { class: 'row' }, [
        el('div', {}, [
          el('div', { class: 'lab', text: s.name + ' seems to help' }),
          el('div', { class: 'sub', text: 'You said it helped ' + helpful[id] + ' time' + (helpful[id] > 1 ? 's' : '') })
        ]),
        el('span', { class: 'tier observed', text: 'Observed' })
      ]));
    });

    var lateCount = state.checkins.filter(function (c) {
      var h = new Date(c.t).getHours(); return h >= 22 || h <= 4;
    }).length;
    if (lateCount >= 3) {
      any = true;
      var inf = state.inferences.filter(function (i) { return i.id === 'late-nights'; })[0];
      if (!inf || inf.confirmed === null) {
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
    }

    if (!any) {
      rows.appendChild(el('p', { class: 'p-voice', text: 'Nothing yet. It learns from what you tell it and what you actually use — not from watching you.' }));
    }
    v.appendChild(rows);

    v.appendChild(el('hr', { class: 'sep' }));
    v.appendChild(el('p', { class: 'eyebrow', text: 'Your data' }));
    v.appendChild(el('div', { class: 'stack' }, [
      el('button', { class: 'btn ghost', text: 'Export everything', onclick: exportData }),
      el('button', { class: 'btn ghost', text: (state.theme === 'dark' ? 'Light' : 'Dark') + ' theme', onclick: toggleTheme }),
      el('button', { class: 'btn danger', text: 'Delete everything, permanently', onclick: confirmDelete })
    ]));

    v.appendChild(el('div', { class: 'notice', html:
      '<b>SoulCap is not therapy</b>, not a doctor, and not a crisis service. ' +
      'Nothing you write leaves this device. There is no account and no server.' }));

    v.appendChild(el('button', { class: 'help-btn', text: 'I need help now', onclick: openPanic }));
  }

  function setInference(id, val) {
    var i = state.inferences.filter(function (x) { return x.id === id; })[0];
    if (i) i.confirmed = val; else state.inferences.push({ id: id, confirmed: val });
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
    openSheet(function (panel) {
      panel.appendChild(el('h2', { class: 'h-sec', text: 'Delete everything?' }));
      panel.appendChild(el('p', { class: 'p', text: 'Check-ins, skills, your Constellation, all of it. This cannot be undone, and there is no backup anywhere.' }));
      panel.appendChild(el('button', { class: 'btn danger', text: 'Yes, delete it all', onclick: function () {
        try { localStorage.removeItem(KEY); } catch (e) {}
        state = clone(DEFAULT);
        closeSheet(); applyTheme(); render();
      } }));
      panel.appendChild(el('button', { class: 'btn quiet', text: 'Keep my data', onclick: closeSheet }));
    });
  }

  // ── Onboarding ───────────────────────────────────────────────────────────
  var obStep = 0;
  function renderOnboarding() {
    var v = $('#view-onboarding');
    clear(v);
    var dots = el('div', { style: 'display:flex;gap:5px;margin-bottom:8px' },
      [0, 1, 2, 3].map(function (i) {
        return el('i', { style: 'height:3px;flex:1;border-radius:2px;display:block;background:' +
          (i <= obStep ? 'var(--accent)' : 'var(--line-strong)') });
      }));
    v.appendChild(dots);

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
        return el('button', {
          class: 'opt', 'aria-pressed': state.region === r.code ? 'true' : 'false',
          html: r.label + (r.crisis === 'INTL' && r.code === 'PK'
            ? '<span class="os">We show the international directory — we haven’t verified local lines yet</span>' : ''),
          onclick: function () { state.region = r.code; save(); obStep = 2; render(); }
        });
      })));
    } else if (obStep === 2) {
      v.appendChild(el('h1', { class: 'h-voice', text: 'What this is, plainly.' }));
      v.appendChild(el('div', { class: 'notice', html:
        '<b>SoulCap is not therapy</b>, not a doctor, and not a crisis service. It teaches skills and helps you notice patterns.' +
        '<ul style="margin:9px 0 0;padding-left:17px">' +
        '<li>Everything stays on your phone. There is no account and no server.</li>' +
        '<li>We never sell your data or train on it.</li>' +
        '<li>You can export or delete all of it, any time.</li>' +
        '<li>If you’re in danger, we’ll always point you to real people.</li></ul>' }));
      v.appendChild(el('button', { class: 'btn', text: 'I understand', onclick: function () { state.consent = true; save(); obStep = 3; render(); } }));
    } else {
      v.appendChild(el('h1', { class: 'h-voice', text: 'What’s been hard lately?' }));
      v.appendChild(el('p', { class: 'p', text: 'Pick any, or none. You can change this whenever — skipping it doesn’t break anything.' }));
      v.appendChild(el('div', { class: 'chips' }, CONCERNS.map(function (c) {
        return el('button', {
          class: 'chip', 'aria-pressed': state.concerns.indexOf(c) !== -1 ? 'true' : 'false', text: c,
          onclick: function () {
            var i = state.concerns.indexOf(c);
            if (i === -1) state.concerns.push(c); else state.concerns.splice(i, 1);
            save(); render();
          }
        });
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

  // ── Router ───────────────────────────────────────────────────────────────
  var tab = 'now';
  function selectTab(t) { tab = t; render(); window.scrollTo(0, 0); }

  function render() {
    applyTheme();
    var onboarding = !state.onboarded;
    ['onboarding', 'now', 'skills', 'map', 'me'].forEach(function (v) {
      $('#view-' + v).classList.remove('on');
    });
    $('#tabs').style.display = onboarding ? 'none' : 'flex';

    if (onboarding) { renderOnboarding(); $('#view-onboarding').classList.add('on'); return; }

    if (tab === 'now') renderNow();
    if (tab === 'skills') renderSkills();
    if (tab === 'map') renderMap();
    if (tab === 'me') renderMe();
    $('#view-' + tab).classList.add('on');

    Array.prototype.forEach.call($('#tabs').children, function (b) {
      b.setAttribute('aria-selected', b.dataset.tab === tab ? 'true' : 'false');
    });

    if (tab === 'map' && state.people.length) drawMap();
    renderCrisisLinks($('#panicLinks'));
  }

  // ── Demo seed ────────────────────────────────────────────────────────────
  function seedDemo() {
    state = clone(DEFAULT);
    state.onboarded = true; state.ageOk = true; state.region = 'UK'; state.consent = true;
    state.concerns = ['Hard to switch off', 'Low mood'];
    var day = 86400000, now = Date.now();
    ['Wired','Flat','Steady','Heavy','Wired','Steady'].forEach(function (s, i) {
      state.checkins.push({ t: now - (6 - i) * day, state: s });
    });
    state.skillRuns.push({ t: now - 3 * day, id: 'box-breathing', helpful: true });
    state.skillRuns.push({ t: now - 2 * day, id: 'box-breathing', helpful: true });
    state.skillRuns.push({ t: now - day, id: 'grounding-54321', helpful: true });
    state.people = [
      { id: uid(), name: 'Amina', type: 'FAMILY', ring: 'close', supportive: .85, drain: .15, hard: false, suggestible: true },
      { id: uid(), name: 'Bilal', type: 'FRIEND', ring: 'close', supportive: .7, drain: .3, hard: false, suggestible: true },
      { id: uid(), name: 'Mum', type: 'FAMILY', ring: 'present', supportive: .6, drain: .4, hard: false, suggestible: true },
      { id: uid(), name: 'Dr. Naveed', type: 'CARE', ring: 'present', supportive: .8, drain: .2, hard: false, suggestible: false },
      { id: uid(), name: 'Usman', type: 'COLLEAGUE', ring: 'distant', supportive: .3, drain: .6, hard: false, suggestible: true },
      { id: uid(), name: 'Dad', type: 'FAMILY', ring: 'distant', supportive: .3, drain: .8, hard: true, suggestible: true }
    ];
    save();
  }

  // ── Boot ─────────────────────────────────────────────────────────────────
  function boot() {
    if (location.search.indexOf('demo=1') !== -1) seedDemo();

    $('#panicExit').addEventListener('click', closePanic);
    $('#runClose').addEventListener('click', closeRunner);
    $('#sheetScrim').addEventListener('click', closeSheet);

    Array.prototype.forEach.call($('#tabs').children, function (b) {
      b.addEventListener('click', function () { selectTab(b.dataset.tab); });
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

    render();

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () { /* offline-first is best-effort */ });
      });
    }
  }

  // Exposed for tests only.
  window.__soulcap = { assessRisk: assessRisk, suggestSkill: suggestSkill, suggestPerson: suggestPerson,
                       getState: function () { return state; } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
