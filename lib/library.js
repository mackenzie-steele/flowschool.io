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
