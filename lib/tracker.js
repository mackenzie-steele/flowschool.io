// Records tool visits to localStorage so the dashboard can show "Continue Where You Left Off."
// Include this script on every tool page.
(function () {
  const META = {
    'movement-experiments.html': { name: 'Movement Experiments', icon: 'gesture' },
    'arbitrary-rules.html':      { name: 'Arbitrary Rules',      icon: 'casino' },
    'playlist-builder.html':              { name: 'Playlist Builder',     icon: 'queue_music' },
    'pose-library.html':                  { name: 'Pose Library',         icon: 'book' },
    'teaching-log.html':                  { name: 'Teaching Log',         icon: 'history_edu' },
    'breath-pace.html':           { name: 'Breath Pace',         icon: 'air' },
    'your-cues.html':                     { name: 'Your Cues', icon: 'edit_note' },
    'pose-popcorn.html':                  { name: 'Pose Popcorn',         icon: 'conversion_path' },
    'story-starters.html':                { name: 'Story Starters',       icon: 'auto_stories' },
    'your-classes.html':                  { name: 'Your Classes',         icon: 'edit_document' },
    'your-flows.html':                    { name: 'Your Flows',           icon: 'airline_stops' },
    'stories.html':                       { name: 'Your Stories',         icon: 'library_books' },
  };

  const raw = window.location.pathname.split('/').pop() || 'dashboard.html';
  const key = raw.indexOf('.') === -1 ? raw + '.html' : raw; // clean URLs → META lookup key
  const tool = META[key];
  if (!tool) return;

  const KEY = 'flowschool_recent';
  const entry = { ...tool, href: key.replace(/\.html$/, ''), time: Date.now() }; // store the clean link

  try {
    const recent = JSON.parse(localStorage.getItem(KEY) || '[]');
    const filtered = recent.filter(function (r) { return r.href !== entry.href; });
    localStorage.setItem(KEY, JSON.stringify([entry].concat(filtered).slice(0, 6)));
  } catch (_) {}
})();
