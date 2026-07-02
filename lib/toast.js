// Shared toast notification. Requires a <div class="toast" id="toast"> in the page.
(function () {
  var timer = null;
  window.toast = function (msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(function () { el.classList.remove('show'); }, 2800);
  };
})();
