var EVENTS = [
  { date: new Date(2026, 5, 20), title: 'Live Workshop: Finding Your Voice', type: 'Workshop', time: '11am PT' },
  { date: new Date(2026, 5, 24), title: 'Cohort Call — Sequencing Deep Dive',  type: 'Cohort',   time: '10am PT' },
  { date: new Date(2026, 6,  2), title: 'Community Practice Session',          type: 'Practice',  time: '9am PT'  },
  { date: new Date(2026, 6,  8), title: 'New Course Drop: Circle Flows',       type: 'Release',   time: ''        },
  { date: new Date(2026, 6, 15), title: 'Q&A with Bonnie',                     type: 'Q&A',       time: '12pm PT' },
];

var COMMUNITY = [
  { name: 'Sarah M.',  action: 'completed the Flow Matrix',         time: '2h ago', avatar: 'S'                 },
  { name: 'Alex T.',   action: 'shared a new arm balance sequence', time: '4h ago', avatar: 'A'                 },
  { name: 'Jamie K.',  action: 'finished 10 movement experiments',  time: '6h ago', avatar: 'J'                 },
  { name: 'Bonnie',    action: 'added a new teaching prompt',       time: '1d ago', avatar: 'B', isBonnie: true },
  { name: 'Rachel L.', action: 'built a playlist for Yin class',    time: '1d ago', avatar: 'R'                 },
  { name: 'Marcus D.', action: 'started Circle Flows',              time: '2d ago', avatar: 'M'                 },
];


// MOCK DATA — replace with Supabase query to `user_skill_progress` when ready.
// Score formula: Math.min(100, Math.round(minutes / 1200 * 100))
// 20 hours = 1,200 minutes = 100%
var SKILL_MAP_DATA = [
  { skill: 'Sequencing',      minutes: 420, score: 35 },
  { skill: 'Cueing',          minutes: 240, score: 20 },
  { skill: 'Class Structure', minutes: 180, score: 15 },
  { skill: 'Storytelling',    minutes:  90, score:  8 },
];

// Tool-to-skill mapping — attributes session time to skill categories.
// Future: store in Supabase table `tool_skill_mappings`.
var TOOL_SKILL_MAP = {
  'arbitrary-rule-generator.html':      ['Sequencing'],
  'movement-experiment-generator.html': ['Sequencing'],
  'shorthand-library.html':             ['Sequencing', 'Class Structure'],
  'v-ybp-d.html':                       ['Cueing'],
  'breath-pace-trainer.html':           ['Cueing'],
  'story-structure.html':               ['Class Structure', 'Storytelling'],
  'playlist-builder.html':              ['Class Structure'],
};

// Suggested next action per weakest skill — includes link to the relevant tool
var SKILL_SUGGESTIONS = {
  'Sequencing':      { pre: 'Try 10 minutes with ', tool: 'Arbitrary Rule Generator', post: ' to grow Sequencing.',     href: 'arbitrary-rule-generator.html' },
  'Cueing':          { pre: 'Try 10 minutes in ',   tool: 'the Cue Lab',              post: ' to build cueing skills.',  href: 'v-ybp-d.html'                  },
  'Class Structure': { pre: 'Try 10 minutes in ',   tool: 'the Playlist Builder',     post: ' to grow Class Structure.', href: 'playlist-builder.html'          },
  'Storytelling':    { pre: 'Shape a class arc in the ', tool: 'Playlist Builder', post: ' — controlling energy over time is the foundation of storytelling.', href: 'playlist-builder.html' },
};

var NEXT_STEPS = [
  {
    trigger: 'movement-experiment-generator.html',
    title:   'Add creative structure',
    desc:    "You've been exploring movement. Now give it a rule. The Arbitrary Rule Generator adds a creative constraint to your next class so the movement has direction.",
    href:    'arbitrary-rule-generator.html',
    label:   'Generate a Rule',
  },
  {
    trigger: 'arbitrary-rule-generator.html',
    title:   'Build the soundscape',
    desc:    "You set the constraint. Now build the playlist to match. Use the Playlist Builder to shape the energy arc of your class.",
    href:    'playlist-builder.html',
    label:   'Build a Playlist',
  },
  {
    trigger: 'playlist-builder.html',
    title:   'Write your cues',
    desc:    "You have the music. Now sharpen the language. Use the Cue Worksheet to map out your verb, body part, and direction cues for each section of your class.",
    href:    'cue-worksheet.html',
    label:   'Open Cue Worksheet',
  },
  {
    trigger: 'cue-worksheet.html',
    title:   'Put it into shorthand',
    desc:    "You've been writing your cues. Now encode your sequences using Flow School shorthand so you can track and recall them over time.",
    href:    'shorthand-library.html',
    label:   'Open Shorthand Library',
  },
  {
    trigger: 'shorthand-library.html',
    title:   'Take your notes into movement',
    desc:    "You've been documenting sequences. Take one into a movement experiment and see what changes when you add a creative constraint.",
    href:    'movement-experiment-generator.html',
    label:   'Start a Movement Experiment',
  },
  {
    trigger: 'breath-pace-trainer.html',
    title:   'Build the playlist around the breath',
    desc:    "You've been working on breath pacing. Now build a playlist whose energy arc mirrors the breath pattern you want to teach.",
    href:    'playlist-builder.html',
    label:   'Build a Playlist',
  },
  {
    trigger: 'flow-checker.html',
    title:   'Take it into movement',
    desc:    "You've been reviewing your flow. Take one of the sequences into a movement experiment and see what changes when you add a creative constraint.",
    href:    'movement-experiment-generator.html',
    label:   'Start a Movement Experiment',
  },
  {
    trigger: 'default',
    title:   'Start with movement',
    desc:    "The fastest way to develop your teaching voice is to get in your body. Begin with a movement experiment and let the physical practice lead.",
    href:    'movement-experiment-generator.html',
    label:   'Start a Movement Experiment',
  },
];
