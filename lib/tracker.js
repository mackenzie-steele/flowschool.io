// Records tool visits to localStorage so the dashboard can show "Continue Where You Left Off."
// Include this script on every tool page.
(function () {
  const META = {
    'movement-experiment-generator.html': { name: 'Movement Experiments', icon: 'gesture' },
    'arbitrary-rule-generator.html':      { name: 'Arbitrary Rules',        icon: 'casino' },
    'playlist-builder.html':              { name: 'Playlist Builder',       icon: 'queue_music' },
    'shorthand-library.html':             { name: 'Shorthand Library',      icon: 'book' },
    'story-structure.html':              { name: 'Story Builder',           icon: 'auto_stories' },
    'breath-pace-trainer.html':           { name: 'Breath Pacer',           icon: 'air' },
    'v-ybp-d.html':                       { name: 'Cue Lab',                icon: 'record_voice_over' },
  };

  const page = window.location.pathname.split('/').pop();
  const tool = META[page];
  if (!tool) return;

  const KEY = 'flowschool_recent';
  const entry = { ...tool, href: page, time: Date.now() };

  try {
    const recent = JSON.parse(localStorage.getItem(KEY) || '[]');
    const filtered = recent.filter(function (r) { return r.href !== entry.href; });
    localStorage.setItem(KEY, JSON.stringify([entry].concat(filtered).slice(0, 6)));
  } catch (_) {}
})();
