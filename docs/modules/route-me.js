/* SoulCap route module — You tools / screeners / stories (SOUL-P1-06). */
(function (w) {
  function ensure() {
    if (typeof w.soulEnsureCatalogs !== 'function') return Promise.resolve();
    return w.soulEnsureCatalogs(['SCREENERS', 'STORIES', 'DISTORTIONS']);
  }
  w.SoulCapRoutes = w.SoulCapRoutes || {};
  w.SoulCapRoutes.me = { ensure: ensure };
  if (w.SoulCapRoutes._resolveMe) w.SoulCapRoutes._resolveMe();
})(window);
