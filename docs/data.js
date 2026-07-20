/* SoulCap — content layer
 * Skill cards and crisis directory.
 *
 * CLINICAL REVIEW STATUS: every card below carries reviewedBy:null, which means
 * it has NOT been signed off by a licensed clinician. The UI surfaces this.
 * Do not remove the banner until a named reviewer has signed each card.
 */

const SKILLS = [
  // ── breath ──────────────────────────────────────────────
  { id:'box-breathing', name:'Box breathing', domain:'breath', mins:4, capacity:'low',
    indication:['anxiety','panic','wired'], contraindication:[],
    blurb:'Even, counted breathing. Slows the exhale, which nudges the nervous system toward rest.',
    steps:[
      'Sit or lie however you are. Nothing to fix.',
      'Breathe in through your nose while I count to four.',
      'Hold for four. Loose, not clenched.',
      'Out through your mouth for four. Slow.',
      'Hold empty for four.',
      'Again. Four more rounds, then we stop.'
    ], source:'Paced breathing — widely used; see WHO mhGAP self-help materials' },

  { id:'physiological-sigh', name:'Physiological sigh', domain:'breath', mins:2, capacity:'low',
    indication:['panic','wired','acute'], contraindication:[],
    blurb:'Two inhales, one long exhale. The fastest way to bring arousal down.',
    steps:[
      'Breathe in through your nose.',
      'Now a second, shorter sniff on top. Fill the last bit.',
      'Long, slow breath out through your mouth. Let it all go.',
      'Again — twice in, once long out.',
      'Three more. Then just breathe normally.'
    ], source:'Cyclic sighing — respiratory physiology literature' },

  { id:'tipp-temperature', name:'Cold water reset', domain:'breath', mins:3, capacity:'low',
    indication:['acute','panic','overwhelmed'], contraindication:['heart condition','eating disorder'],
    blurb:'Cold on the face triggers a reflex that slows the heart. Blunt, physical, fast.',
    steps:[
      'Get to a sink, or hold something cold.',
      'Cold water on your face — especially around the eyes.',
      'Or hold the cold thing against your cheeks for thirty seconds.',
      'Breathe out slowly while you do it.',
      'Notice if anything shifted. Even slightly counts.'
    ], source:'DBT distress tolerance (TIPP) — technique in general clinical use' },

  // ── grounding ───────────────────────────────────────────
  { id:'grounding-54321', name:'5-4-3-2-1', domain:'breath', mins:3, capacity:'low',
    indication:['dissociation','anxiety','panic'], contraindication:[],
    blurb:'Sensory grounding. Pulls attention out of your head and into the room.',
    steps:[
      'Five things you can see. Say them, or just notice them.',
      'Four things you can feel. Chair, floor, fabric, air.',
      'Three things you can hear.',
      'Two things you can smell.',
      'One thing you can taste.',
      'You are here. That is the whole point of the exercise.'
    ], source:'Sensory grounding — standard technique, no single owner' },

  // ── rest ────────────────────────────────────────────────
  { id:'stimulus-control', name:'Getting back to sleep', domain:'rest', mins:6, capacity:'any',
    indication:['sleep','3am','rumination'], contraindication:[],
    blurb:'If you have been awake a while, staying in bed makes it worse. Counterintuitive but well supported.',
    steps:[
      'If you have been lying awake more than about twenty minutes, get up.',
      'Go to another room if you can. Keep the light low.',
      'Do something dull. Not your phone.',
      'Wait until you feel sleepy — not tired, sleepy.',
      'Then go back to bed.',
      'If it happens again, do it again. The bed is for sleeping.'
    ], source:'Stimulus control, CBT-I — see NICE guidance on insomnia' },

  { id:'wind-down', name:'Wind-down', domain:'rest', mins:10, capacity:'any',
    indication:['sleep','wired'], contraindication:[],
    blurb:'A boundary between the day and the night, so your body gets a signal.',
    steps:[
      'Pick a time. Roughly an hour before you want to sleep.',
      'Lights down. Screens away or dimmed.',
      'Write down anything you are holding on to. It will keep until morning.',
      'Something slow — stretching, washing, reading paper.',
      'Same order, most nights. Predictability is the active ingredient.'
    ], source:'Sleep hygiene — CBT-I components' },

  { id:'worry-postponement', name:'Worry postponement', domain:'rest', mins:5, capacity:'any',
    indication:['rumination','3am','sleep'], contraindication:[],
    blurb:'Not suppressing the worry. Scheduling it.',
    steps:[
      'Write the worry down. One line is enough.',
      'Pick a time tomorrow to think about it properly. Fifteen minutes.',
      'Tell yourself: not now, then. It is on the list.',
      'When it comes back — and it will — point at the list.',
      'Keep the appointment tomorrow. That is what makes it work next time.'
    ], source:'Stimulus control for worry — CBT for GAD' },

  // ── clarity ─────────────────────────────────────────────
  { id:'thought-record', name:'Thought record', domain:'clarity', mins:9, capacity:'any',
    indication:['rumination','low','self-critical'], contraindication:['acute'],
    blurb:'Get the thought out of your head and onto something you can look at.',
    steps:[
      'What happened? Just the facts, no interpretation.',
      'What went through your mind?',
      'How much do you believe it, zero to a hundred?',
      'What supports it? Actual evidence, not feelings.',
      'What does not support it?',
      'Given both — is there a fairer way to say it?',
      'How much do you believe the original now?'
    ], source:'Cognitive restructuring — core CBT technique' },

  { id:'defusion', name:'Stepping back from a thought', domain:'clarity', mins:4, capacity:'any',
    indication:['rumination','self-critical'], contraindication:[],
    blurb:'You do not have to argue with a thought to loosen its grip.',
    steps:[
      'Catch the thought. Say it plainly to yourself.',
      'Now put "I am having the thought that" in front of it.',
      'Say it again with that added.',
      'Now: "I notice I am having the thought that…"',
      'Same words. Slightly more room around them.',
      'You are not trying to make it untrue. Just less close.'
    ], source:'Cognitive defusion — ACT technique' },

  { id:'worry-vs-problem', name:'Worry or problem?', domain:'clarity', mins:5, capacity:'any',
    indication:['rumination','anxiety'], contraindication:[],
    blurb:'Some worries have an action. Most do not. Sorting them helps.',
    steps:[
      'Name the worry.',
      'Is there something you could actually do about it today?',
      'If yes — what is the smallest first step? Write it down. Do that.',
      'If no — it is a worry, not a problem. Nothing to solve.',
      'For worries: let it be there without working on it. It is allowed to exist.'
    ], source:'Worry classification — CBT for GAD' },

  // ── move ────────────────────────────────────────────────
  { id:'ten-minute-walk', name:'Ten-minute walk', domain:'move', mins:10, capacity:'medium',
    indication:['low','flat','rumination'], contraindication:['acute','panic'],
    blurb:'Among the best-evidenced things for low mood. Unglamorous and it works.',
    steps:[
      'Shoes on. That is the hard part, genuinely.',
      'Out the door. Any direction.',
      'Five minutes out, five minutes back. That is the whole plan.',
      'You do not have to enjoy it or think about anything.',
      'If ten is too much, go to the end of the road and come back.'
    ], source:'Physical activity for depression — see NICE depression guidance' },

  { id:'behavioural-activation', name:'One small thing', domain:'move', mins:6, capacity:'medium',
    indication:['low','flat','withdrawn'], contraindication:['acute'],
    blurb:'Action before motivation, not after. Waiting to feel like it is the trap.',
    steps:[
      'Think of something you used to do that you have stopped doing.',
      'Shrink it until it is almost too small to count.',
      'Not "cook a meal" — "take one thing out of the fridge".',
      'Pick a time today. Any time.',
      'Do the small version. Motivation shows up afterwards, not before.'
    ], source:'Behavioural activation — see NICE depression guidance' },

  // ── warmth ──────────────────────────────────────────────
  { id:'self-compassion-break', name:'Self-compassion break', domain:'warmth', mins:5, capacity:'low',
    indication:['self-critical','shame','low'], contraindication:[],
    blurb:'Speak to yourself the way you would to someone you like.',
    steps:[
      'Name what is hard right now. "This is difficult."',
      'Remind yourself: other people feel this too. You are not defective for it.',
      'Hand on your chest, if that is not uncomfortable.',
      'Say what you would say to a friend in this exact spot.',
      'Say it to yourself. It will feel false. Do it anyway.'
    ], source:'Self-compassion practice — mindful self-compassion literature' },

  { id:'opposite-action', name:'Opposite action', domain:'warmth', mins:6, capacity:'medium',
    indication:['shame','anger','withdrawn'], contraindication:['acute'],
    blurb:'When the urge does not fit the facts, do the opposite of what it says.',
    steps:[
      'Name the feeling and what it is pushing you to do.',
      'Does the action actually fit the situation? Be honest.',
      'If it does not — what would the opposite look like?',
      'Shame says hide. Opposite is to stay visible.',
      'Do the opposite, all the way, not half.'
    ], source:'Opposite action — DBT emotion regulation' },

  // ── connect ─────────────────────────────────────────────
  { id:'reach-out', name:'Reach out to one person', domain:'connect', mins:5, capacity:'medium',
    indication:['lonely','withdrawn','low'], contraindication:['acute'],
    blurb:'Withdrawal is one of the most reliable signs things are sliding. One message counts.',
    steps:[
      'Pick one person. Your Constellation can suggest someone if you have set it up.',
      'You do not have to explain how you are.',
      '"Thinking of you" is a complete message.',
      'Send it before you talk yourself out of it.',
      'No obligation to reply-manage anything after.'
    ], source:'Social connection and mood — behavioural activation component' },

  { id:'sit-near-people', name:'Be around people', domain:'connect', mins:20, capacity:'medium',
    indication:['lonely','withdrawn'], contraindication:['acute'],
    blurb:'Not socialising. Just being in the same room as other humans.',
    steps:[
      'Somewhere public with people in it. Café, library, park bench.',
      'Bring something to do so you have a reason to be there.',
      'You do not have to speak to anyone.',
      'Twenty minutes is plenty.',
      'Presence counts even without conversation.'
    ], source:'Behavioural activation — social contact hierarchy' },

  // ── reflect ─────────────────────────────────────────────
  { id:'values-check', name:'Values check', domain:'reflect', mins:8, capacity:'any',
    indication:['stuck','stable'], contraindication:['acute'],
    blurb:'For steadier days. What actually matters to you, versus what you are spending yourself on.',
    steps:[
      'Name three things that matter to you. Not goals — directions.',
      'For each, how much of last week went toward it? Rough guess.',
      'Where is the biggest gap?',
      'What is one small thing this week that closes it slightly?',
      'Small. This is not a life overhaul.'
    ], source:'Values clarification — ACT' }
];

const DOMAIN_META = {
  breath:  { label:'Breath',  cssVar:'--breath'  },
  rest:    { label:'Rest',    cssVar:'--rest'    },
  clarity: { label:'Clarity', cssVar:'--clarity' },
  move:    { label:'Move',    cssVar:'--move'    },
  warmth:  { label:'Warmth',  cssVar:'--warmth'  },
  connect: { label:'Connect', cssVar:'--connect' },
  reflect: { label:'Reflect', cssVar:'--reflect' }
};

/* Crisis directory.
 * Only services that are long-established and publicly documented are listed.
 * NO Pakistan-specific entry: no local service has been independently verified as
 * live and staffed. PK users get the international directory instead — an absent
 * local number is safer than a wrong one. Do not add entries without verification.
 */
const CRISIS = {
  US: [
    { name:'988 Suicide & Crisis Lifeline', detail:'Call or text 988', href:'tel:988' },
    { name:'Crisis Text Line', detail:'Text HOME to 741741', href:'sms:741741&body=HOME' },
    { name:'Emergency services', detail:'911', href:'tel:911' }
  ],
  UK: [
    { name:'Samaritans', detail:'Call 116 123 — free, 24 hours', href:'tel:116123' },
    { name:'Shout', detail:'Text SHOUT to 85258', href:'sms:85258&body=SHOUT' },
    { name:'Emergency services', detail:'999', href:'tel:999' }
  ],
  INTL: [
    { name:'Find a Helpline', detail:'Verified crisis lines by country', href:'https://findahelpline.com' },
    { name:'IASP crisis centres', detail:'International directory', href:'https://www.iasp.info/resources/Crisis_Centres/' },
    { name:'Local emergency services', detail:'Your country’s emergency number', href:null }
  ]
};

const REGIONS = [
  { code:'US',   label:'United States',  crisis:'US'   },
  { code:'UK',   label:'United Kingdom', crisis:'UK'   },
  { code:'PK',   label:'Pakistan',       crisis:'INTL' },
  { code:'INTL', label:'Somewhere else', crisis:'INTL' }
];

const CONCERNS = [
  'Hard to switch off','Sleep','Low mood','Panic','Grief',
  'Anger','Loneliness','Work','Family','Not sure yet'
];

const RELATIONSHIP_TYPES = [
  { code:'FAMILY',    label:'Family',    cssVar:'--warmth'  },
  { code:'FRIEND',    label:'Friend',    cssVar:'--clarity' },
  { code:'PARTNER',   label:'Partner',   cssVar:'--rest'    },
  { code:'CARE',      label:'Care team', cssVar:'--breath'  },
  { code:'COLLEAGUE', label:'Work',      cssVar:'--reflect' },
  { code:'OTHER',     label:'Other',     cssVar:'--connect' }
];
