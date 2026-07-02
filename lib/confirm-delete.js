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
  var timer = null;

  function disarm() {
    if (armedBtn) {
      armedBtn.classList.remove('confirm-delete-armed');
      armedBtn.innerHTML = armedRestoreHTML;
      armedBtn.title = armedTitle;
    }
    clearTimeout(timer);
    armedBtn = null;
    armedRestoreHTML = null;
    armedTitle = null;
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
      btn.innerHTML = '<span class="material-symbols-sharp">delete</span>';
      btn.title = 'Click again to remove';
      timer = setTimeout(disarm, ARM_MS);
    });
  };
})();
