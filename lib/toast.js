// Shared toast notification. Requires a <div class="toast" id="toast"> in the page.
(function () {
  var timer = null;
  window.toast = function (msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    // transient feedback must reach screen readers too
    if (!el.getAttribute('role')) {
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(function () { el.classList.remove('show'); }, 2800);
  };
})();
