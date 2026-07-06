// ─────────────────────────────────────────────────────────────────────────────
// lib/library.js — shared helpers for the library pages
// (Your Classes · Your Flows · Your Stories)
//
// Load after lib/nav.js and before the page's own <script>. Everything here
// is either pure or wires elements the library pages share by convention:
//   #sort-label          — the sort toggle's text
//   #discard-modal / #discard-yes / #discard-keep — the unsaved-changes modal
// ─────────────────────────────────────────────────────────────────────────────

// ── text ─────────────────────────────────────────────────────────────────────

function fsEsc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fsFmtDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fsAutoGrow(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

// poses are separated by slashes (or lines) in the shorthand convention
function fsPoseCount(text) {
  return (text || '').split(/[\/\n]/).map(function (p) { return p.trim(); }).filter(Boolean).length;
}

// ── created ↔ edited stamps — one site-wide preference ──────────────────────

function fsDateMode() {
  return localStorage.getItem('fs-date-mode') === 'edited' ? 'edited' : 'created';
}

function fsToggleDateMode() {
  localStorage.setItem('fs-date-mode', fsDateMode() === 'edited' ? 'created' : 'edited');
}

function fsStampFor(obj) {
  var edited = fsDateMode() === 'edited';
  return {
    label: edited ? 'Edited' : 'Created',
    ts: edited ? (obj.editedAt || obj.id) : obj.id,
  };
}

// ── sorting — a preference per library ───────────────────────────────────────

function fsSortMode(key) {
  return localStorage.getItem(key) === 'created' ? 'created' : 'edited';
}

function fsSorterFor(mode) {
  return mode === 'edited'
    ? function (a, b) { return (b.editedAt || b.id) - (a.editedAt || a.id); }
    : function (a, b) { return b.id - a.id; };
}

function fsRenderSortLabel(mode) {
  var el = document.getElementById('sort-label');
  if (el) el.textContent = mode === 'edited' ? 'Recently Edited' : 'Recently Created';
}

// ── unsaved-changes modal ────────────────────────────────────────────────────
// Wires the shared #discard-modal once and returns confirm(cb);
// cb(true) = discard, cb(false) = keep editing.

function fsWireDiscardModal() {
  var pending = null;
  var modal = document.getElementById('discard-modal');

  function settle(discard) {
    modal.hidden = true;
    var cb = pending;
    pending = null;
    if (cb) cb(discard);
  }

  document.getElementById('discard-yes').addEventListener('click', function () { settle(true); });
  document.getElementById('discard-keep').addEventListener('click', function () { settle(false); });
  modal.addEventListener('click', function (e) {
    if (e.target === e.currentTarget) settle(false);
  });

  return function confirm(cb) {
    pending = cb;
    modal.hidden = false;
  };
}

// ── editorial empty state — the ghost of the future index ────────────────────

function fsGhostRows() {
  return '<div class="library-empty-ghost" aria-hidden="true">' +
    '<div class="library-empty-ghost-row"><i></i><i></i></div>' +
    '<div class="library-empty-ghost-row"><i></i><i></i></div>' +
    '<div class="library-empty-ghost-row"><i></i><i></i></div>' +
    '</div>';
}

// ── custom shorthand — the teacher's own codes ───────────────────────────────

function fsCustomShorthand() {
  try { return JSON.parse(localStorage.getItem('flowschool_shorthand') || '[]'); } catch (_) { return []; }
}

// every write goes through here — the sync layer slots in at this seam
function fsSaveCustomShorthand(list) {
  localStorage.setItem('flowschool_shorthand', JSON.stringify(list));
}

function fsShorthandAll() {
  var base = typeof SHORTHAND === 'undefined' ? [] : SHORTHAND;
  return base.concat(fsCustomShorthand());
}

// ── shorthand suggest — the platform's signature completion ─────────────────
// Caret-anchored panel over an auto-growing textarea. Tab inserts the
// top (or armed) match, arrows arm, Enter only when armed, Esc
// dismisses for the current token. cfg:
//   container   — element (or selector) the panel positions within
//   sep(el)     — separator appended after an inserted code (default ' / ')
//   afterInsert — optional callback(el) after an insert lands

function fsShorthandSuggest(cfg) {
  var container = typeof cfg.container === 'string'
    ? document.querySelector(cfg.container) : cfg.container;
  var panel = document.createElement('div');
  panel.className = 'sh-suggest';
  panel.hidden = true;
  container.appendChild(panel);

  var state = { el: null, items: [], sel: -1, tokenStart: 0, dismissed: null };

  function tokenAt(el) {
    var upto = el.value.slice(0, el.selectionStart);
    var start = Math.max(upto.lastIndexOf('/'), upto.lastIndexOf('\n')) + 1;
    return { start: start, text: upto.slice(start) };
  }

  function rank(q) {
    q = q.toLowerCase();
    var scored = [];
    fsShorthandAll().forEach(function (e) {
      var code = e.short.toLowerCase();
      var full = e.full.toLowerCase();
      var sc = -1;
      if (code.indexOf(q) === 0) sc = 0;
      else if (full.split(/\s+/).some(function (w) { return w.indexOf(q) === 0; })) sc = 1;
      else if (code.indexOf(q) !== -1) sc = 2;
      else if (full.indexOf(q) !== -1) sc = 3;
      if (sc >= 0) scored.push({ e: e, sc: sc });
    });
    scored.sort(function (a, b) { return a.sc - b.sc || a.e.short.length - b.e.short.length; });
    return scored.slice(0, 6).map(function (x) { return x.e; });
  }

  function caretXY(el) {
    var m = document.createElement('div');
    var cs = getComputedStyle(el);
    m.style.cssText = 'position:absolute;visibility:hidden;white-space:pre-wrap;word-wrap:break-word;box-sizing:border-box;' +
      'width:' + el.clientWidth + 'px;padding:' + cs.padding + ';font:' + cs.font + ';line-height:' + cs.lineHeight + ';letter-spacing:' + cs.letterSpacing + ';';
    m.textContent = el.value.slice(0, el.selectionStart);
    var mark = document.createElement('span');
    mark.textContent = '\u200b';
    m.appendChild(mark);
    document.body.appendChild(m);
    var xy = { x: mark.offsetLeft, y: mark.offsetTop + mark.offsetHeight };
    document.body.removeChild(m);
    return xy;
  }

  function hide() {
    panel.hidden = true;
    state.el = null;
    state.sel = -1;
  }

  function hideIfStale() {
    if (document.activeElement !== state.el) hide();
  }

  function render() {
    panel.innerHTML = state.items.map(function (e, i) {
      return '<div class="sh-row' + (i === state.sel ? ' sel' : '') + '" data-i="' + i + '">' +
        '<span class="sh-code">' + fsEsc(e.short) + '</span>' +
        '<span class="sh-full">' + fsEsc(e.full) + '</span>' +
      '</div>';
    }).join('') +
    '<div class="sh-hint"><span>tab &#183; insert</span><span>esc &#183; dismiss</span></div>';
  }

  function show(el) {
    var t = tokenAt(el);
    if (state.dismissed && state.dismissed.el === el && state.dismissed.start === t.start) return hide();
    var q = t.text.trim();
    if (q.length < 2) return hide();
    var items = rank(q);
    if (!items.length) return hide();

    var leading = t.text.length - t.text.replace(/^\s+/, '').length;
    state.el = el;
    state.items = items;
    state.sel = -1;
    state.tokenStart = t.start + leading;
    render();

    var xy = caretXY(el);
    var ed = container.getBoundingClientRect();
    var er = el.getBoundingClientRect();
    panel.hidden = false;
    var left = er.left - ed.left + xy.x;
    left = Math.min(left, ed.width - panel.offsetWidth);
    panel.style.left = Math.max(0, left) + 'px';
    panel.style.top = (er.top - ed.top + xy.y + 4) + 'px';
  }

  function insert(i) {
    var el = state.el;
    var e = state.items[i];
    if (!el || !e) return;
    var sep = cfg.sep ? cfg.sep(el) : ' / ';
    var before = el.value.slice(0, state.tokenStart);
    var after = el.value.slice(el.selectionStart);
    el.value = before + e.short + sep + after;
    var pos = (before + e.short + sep).length;
    el.setSelectionRange(pos, pos);
    hide();
    state.dismissed = null;
    fsAutoGrow(el);
    el.focus();
    if (cfg.afterInsert) cfg.afterInsert(el);
  }

  function onKey(ev) {
    if (panel.hidden || state.el !== ev.target) return;
    if (ev.key === 'Tab') {
      ev.preventDefault();
      insert(state.sel === -1 ? 0 : state.sel);
    } else if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      state.sel = (state.sel + 1) % state.items.length;
      render();
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      state.sel = state.sel <= 0 ? state.items.length - 1 : state.sel - 1;
      render();
    } else if (ev.key === 'Enter' && state.sel !== -1) {
      ev.preventDefault();
      insert(state.sel);
    } else if (ev.key === 'Escape') {
      state.dismissed = { el: ev.target, start: state.tokenStart };
      hide();
    }
  }

  panel.addEventListener('mousedown', function (ev) {
    var row = ev.target.closest('.sh-row');
    if (!row) return;
    ev.preventDefault();
    insert(parseInt(row.dataset.i, 10));
  });

  return { show: show, hide: hide, hideIfStale: hideIfStale, onKey: onKey };
}

// ── ⋯ item menu — arm-to-confirm actions behind one button ──────────────────
// menuEl's first class name determines the item class ('tv-menu' →
// 'tv-menu-item'). cfg:
//   items()  — [{act, icon, label, iconClass?, iconStyle?}] built per open
//   on(act)  — action handler (confirmed acts included)
//   confirm  — {act: 'armed label'} for two-step actions
//   detach   — remove menuEl from the DOM on close (dynamic anchoring)

function fsWireItemMenu(menuEl, cfg) {
  var itemCls = menuEl.className.split(' ')[0] + '-item';
  var armTimer = null;

  function render() {
    menuEl.innerHTML = cfg.items().map(function (it) {
      var iconCls = 'material-symbols-sharp' + (it.iconClass ? ' ' + it.iconClass : '');
      return '<button class="' + itemCls + '" data-act="' + it.act + '">' +
        '<span class="' + iconCls + '"' + (it.iconStyle ? ' style="' + it.iconStyle + '"' : '') + '>' + it.icon + '</span>' +
        it.label + '</button>';
    }).join('');
  }

  function close() {
    menuEl.hidden = true;
    clearTimeout(armTimer);
    if (cfg.detach && menuEl.parentElement) menuEl.parentElement.removeChild(menuEl);
  }

  function open(parent) {
    if (parent) parent.appendChild(menuEl);
    render();
    menuEl.hidden = false;
  }

  function toggle(parent) {
    if (menuEl.hidden) open(parent); else close();
  }

  menuEl.addEventListener('click', function (e) {
    var item = e.target.closest('.' + itemCls);
    if (!item) return;
    e.stopPropagation();
    var act = item.dataset.act;
    var armLabel = cfg.confirm && cfg.confirm[act];
    if (armLabel && !item.classList.contains('armed')) {
      item.classList.add('armed');
      item.innerHTML = '<span class="material-symbols-sharp">delete</span>' + armLabel;
      clearTimeout(armTimer);
      armTimer = setTimeout(function () { if (!menuEl.hidden) render(); }, 2200);
      return;
    }
    close();
    cfg.on(act);
  });

  document.addEventListener('click', function () { if (!menuEl.hidden) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menuEl.hidden) close();
  });

  return { open: open, close: close, toggle: toggle };
}

// ── the shape of your practice — six axes from real artifacts ────────────────
// A portrait, not a report card: every point is a receipt. Scores ease
// logarithmically toward 100 (the 3rd story moves more than the 30th).
// Reads existing keys only — no new tracking.

function fsPracticeShape() {
  var MONTH = Date.now() - 30 * 86400000;

  function load(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (_) { return []; }
  }

  // hyperbolic ease: early work shows quickly, but the rim is
  // asymptotic — a practice can always grow, so the shape can too.
  // 15pts→20 · 60pts→50 · 240pts→80 · the edge is never reached.
  function ease(pts) { return Math.round(100 * pts / (pts + 60)); }

  var classes = load('flowschool_classes');
  var flows = load('flowschool_flows');
  var stories = load('flowschool_stories');
  var playlists = load('flowschool_playlists');
  var shorthand = fsCustomShorthand();
  var rules = load('flowschool_arules');
  var chains = load('fs-pose-connector-saved');
  var favs = load('flowschool_favs');
  var cueSheets = [];
  try {
    var store = JSON.parse(localStorage.getItem('fs-cue-flows') || '{}');
    cueSheets = Object.values(store);
  } catch (_) {}

  function stamp(x) {
    if (!x) return 0;
    return x.editedAt || (typeof x.savedAt === 'string' ? Date.parse(x.savedAt) : x.savedAt) || x.ts || x.id || 0;
  }

  // one axis accumulates {pts, monthPts, receipts:[{text, href}]}
  function axis(key, label) {
    var a = { key: key, label: label, pts: 0, monthPts: 0, receipts: [] };
    a.add = function (count, weight, href, receipt) {
      if (!count) return;
      a.pts += count * weight;
      a.receipts.push({ text: receipt, href: href });
    };
    return a;
  }

  function recent(list) { return list.filter(function (x) { return stamp(x) >= MONTH; }); }
  function label(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  // ── PLAY ──
  var play = axis('play', 'Play');
  play.add(rules.length, 3, 'arbitrary-rules.html', label(rules.length, 'challenge saved', 'challenges saved'));
  play.monthPts += recent(rules).length * 3;
  play.add(chains.length, 3, 'pose-popcorn.html', label(chains.length, 'pose chain kept', 'pose chains kept'));
  play.monthPts += recent(chains).length * 3;
  play.add(favs.length, 2, 'movement-experiments.html', label(favs.length, 'experiment favorited', 'experiments favorited'));
  play.monthPts += recent(favs).length * 2;

  // ── SEQUENCE ──
  var seq = axis('sequence', 'Sequence');
  seq.add(flows.length, 3, 'your-flows.html', label(flows.length, 'flow built', 'flows built'));
  seq.monthPts += recent(flows).length * 3;
  var types = {};
  flows.forEach(function (f) { if (f.type) types[f.type] = 1; });
  var tv = Object.keys(types).length;
  seq.add(tv, 2, 'your-flows.html', label(tv, 'flow type explored', 'flow types explored'));
  seq.add(classes.length, 4, 'your-classes.html', label(classes.length, 'class written', 'classes written'));
  seq.monthPts += recent(classes).length * 4;
  var linked = 0, linkedMonth = 0;
  classes.forEach(function (c) {
    var m = c.sectionMeta || {};
    Object.keys(m).forEach(function (k) {
      if (m[k] && m[k].flowId != null) { linked++; if (stamp(c) >= MONTH) linkedMonth++; }
    });
  });
  seq.add(linked, 5, 'your-classes.html', label(linked, 'flow linked into a class', 'flows linked into classes'));
  seq.monthPts += linkedMonth * 5;

  // ── CUE ──
  var cue = axis('cue', 'Cue');
  cue.add(cueSheets.length, 4, 'verb-your-body-part-direction.html', label(cueSheets.length, 'cue sheet saved', 'cue sheets saved'));
  cue.monthPts += recent(cueSheets).length * 4;
  cue.add(shorthand.length, 3, 'pose-library.html', label(shorthand.length, 'shorthand of your own', 'shorthand of your own'));
  cue.monthPts += recent(shorthand).length * 3;
  var pol = fsSessionCounts('fs-pol-sessions');
  cue.add(pol.total, 2, 'verb-your-body-part-direction.html', label(pol.total, 'practice-out-loud session', 'practice-out-loud sessions'));
  cue.monthPts += pol.month * 2;

  // ── STORY ──
  var story = axis('story', 'Story');
  story.add(stories.length, 3, 'stories.html', label(stories.length, 'story written', 'stories written'));
  story.monthPts += recent(stories).length * 3;
  var titled = stories.filter(function (s) { return s.title; }).length;
  story.add(titled, 1, 'stories.html', label(titled, 'story titled', 'stories titled'));
  var told = 0, toldMonth = 0;
  classes.forEach(function (c) {
    var n = (c.storyIds || []).length;
    told += n;
    if (stamp(c) >= MONTH) toldMonth += n;
  });
  story.add(told, 5, 'your-classes.html', label(told, 'story attached to a class', 'stories attached to classes'));
  story.monthPts += toldMonth * 5;

  // ── SOUND ──
  var sound = axis('sound', 'Sound');
  sound.add(playlists.length, 4, 'playlist-builder.html', label(playlists.length, 'playlist saved', 'playlists saved'));
  sound.monthPts += recent(playlists).length * 4;
  var scored = classes.filter(function (c) { return c.playlist || c.playlistUrl; }).length;
  sound.add(scored, 3, 'your-classes.html', label(scored, 'class given a playlist', 'classes given playlists'));
  var bp = fsSessionCounts('fs-breath-sessions');
  sound.add(bp.total, 2, 'breath-pace.html', label(bp.total, 'breath session', 'breath sessions'));
  sound.monthPts += bp.month * 2;

  // ── REFLECT ──
  var reflect = axis('reflect', 'Reflect');
  var notes = 0, notesMonth = 0, refined = 0;
  classes.forEach(function (c) {
    var log = c.notesLog || [];
    notes += log.length;
    log.forEach(function (n) { if ((n.ts || 0) >= MONTH) notesMonth++; });
    // edited after its latest note = the repeat-and-refine loop
    if (log.length && c.editedAt && c.editedAt > Math.max.apply(null, log.map(function (n) { return n.ts || 0; }))) refined++;
  });
  reflect.add(notes, 4, 'teaching-log.html', label(notes, 'teaching note', 'teaching notes'));
  reflect.monthPts += notesMonth * 4;
  reflect.add(refined, 5, 'your-classes.html', label(refined, 'class refined after teaching', 'classes refined after teaching'));

  return [play, seq, cue, story, sound, reflect].map(function (a) {
    return { key: a.key, label: a.label, allTime: ease(a.pts), month: ease(a.monthPts), receipts: a.receipts };
  });
}

// ── session counters — the only new events the shape ever logs ──────────────
// One tiny key per instrument: total count + recent timestamps (for the
// 30-day window). Logged only when a session was real, not on a stray tap.

function fsLogSession(key) {
  var d = { total: 0, stamps: [] };
  try { d = JSON.parse(localStorage.getItem(key)) || d; } catch (_) {}
  d.total = (d.total || 0) + 1;
  d.stamps = (d.stamps || []).concat(Date.now()).slice(-100);
  localStorage.setItem(key, JSON.stringify(d));
}

function fsSessionCounts(key) {
  try {
    var d = JSON.parse(localStorage.getItem(key)) || {};
    var month = Date.now() - 30 * 86400000;
    return {
      total: d.total || 0,
      month: (d.stamps || []).filter(function (t) { return t >= month; }).length,
    };
  } catch (_) { return { total: 0, month: 0 }; }
}
