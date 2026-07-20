// Shared "arm to confirm" delete interaction for saved-item lists.
// First click arms the button (turns into a red trash icon); a second click
// within the window confirms the delete. Arming a different button, or
// letting the timer lapse, disarms the previous one. Only one button can be
// armed at a time across the whole page.
//
// Usage:
//   wireConfirmDelete(buttonEl, () => { /* actually delete */ }, () => canDeleteRightNow);
//
// The button needs its own CSS for the armed state, e.g.:
//   .my-del-btn.confirm-delete-armed { color: #e05252; }
(function () {
  var ARM_MS = 2200;
  var armedBtn = null;
  var armedRestoreHTML = null;
  var armedTitle = null;
  var armedTooltip = null;
  var timer = null;

  // a ~90ms content crossfade — the glyph swap must never flicker
  function fadeSwap(btn, apply) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { apply(); return; }
    btn.style.transition = 'opacity .09s ease';
    btn.style.opacity = '0';
    setTimeout(function () {
      apply();
      btn.style.opacity = '1';
      setTimeout(function () { btn.style.transition = ''; btn.style.opacity = ''; }, 100);
    }, 90);
  }

  // `eased` = the timeout lapsing — the window closes visibly instead of
  // the user discovering it closed; confirms and re-arms restore instantly
  function disarm(eased) {
    if (armedBtn) {
      var btn = armedBtn, html = armedRestoreHTML, title = armedTitle, tooltip = armedTooltip;
      var restore = function () {
        btn.classList.remove('confirm-delete-armed');
        btn.innerHTML = html;
        btn.title = title;
        if (tooltip) btn.setAttribute('data-tooltip', tooltip);
      };
      if (eased) fadeSwap(btn, restore); else restore();
    }
    clearTimeout(timer);
    armedBtn = null;
    armedRestoreHTML = null;
    armedTitle = null;
    armedTooltip = null;
    timer = null;
  }

  // `canArm` is an optional predicate — return false to refuse arming
  // (e.g. "keep at least one row"). Checked fresh on every first click.
  window.wireConfirmDelete = function (btn, onConfirm, canArm) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();

      if (btn === armedBtn) {
        disarm();
        onConfirm();
        return;
      }

      if (typeof canArm === 'function' && !canArm()) return;

      var restoreHTML = btn.innerHTML;
      var title = btn.title || 'Delete';
      disarm();
      armedBtn = btn;
      armedRestoreHTML = restoreHTML;
      armedTitle = title;
      btn.classList.add('confirm-delete-armed');
      // state arms instantly (a second click confirms mid-fade);
      // only the glyph crossfades
      fadeSwap(btn, function () {
        if (armedBtn === btn) btn.innerHTML = '<span class="material-symbols-sharp">delete</span>';
      });
      btn.title = 'Click again to remove';
      armedTooltip = btn.getAttribute('data-tooltip');
      if (armedTooltip) btn.setAttribute('data-tooltip', 'Click again');
      timer = setTimeout(function () { disarm(true); }, ARM_MS);
    });
  };
})();
