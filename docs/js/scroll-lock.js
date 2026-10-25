'use strict';
/* ScrollLock — freezes the document while any sheet/overlay is open, then restores
 * the exact position. iOS ignores overflow:hidden on body for touch scrolling and
 * jumps when it is toggled, so the body is pinned with position:fixed + top:-scrollY
 * (ScentCap 3.0.1 recipe). ES5 — matches docs/ conventions. */
var ScrollLock = (function () {
  var OPEN = '#sheet.on, #panic.on, #runner.on, #journalEditor.on, #subview.on, #applock.on';
  var lockedY = null;
  var queued = false;

  function lock() {
    if (lockedY !== null) return;
    lockedY = window.scrollY || 0;
    var b = document.body.style;
    b.position = 'fixed';
    b.top = -lockedY + 'px';
    b.left = '0';
    b.right = '0';
    b.width = '100%';
  }

  function unlock() {
    if (lockedY === null) return;
    var y = lockedY;
    lockedY = null;
    var b = document.body.style;
    b.position = '';
    b.top = '';
    b.left = '';
    b.right = '';
    b.width = '';
    window.scrollTo(0, y);
  }

  function sync() {
    queued = false;
    if (document.querySelector(OPEN)) lock();
    else unlock();
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(sync);
  }

  function init() {
    if (!document.body) return;
    new MutationObserver(schedule).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'hidden']
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  function currentY() {
    return lockedY !== null ? lockedY : (window.scrollY || 0);
  }

  function scrollToY(y) {
    if (lockedY !== null) lockedY = y;
    else window.scrollTo(0, y);
  }

  return {
    lock: lock,
    unlock: unlock,
    sync: sync,
    currentY: currentY,
    scrollTo: scrollToY,
    isLocked: function () { return lockedY !== null; }
  };
})();

window.ScrollLock = ScrollLock;
