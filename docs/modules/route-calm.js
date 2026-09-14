/* SoulCap route module — Calm / library (SOUL-P1-06).
 * Loaded on first visit to Calm (or idle prefetch). Ensures catalogs are warm.
 */
(function (w) {
  function ensure() {
    if (typeof w.soulEnsureCatalogs !== 'function') return Promise.resolve();
    return w.soulEnsureCatalogs(['EXPERIENCES', 'ARTICLES']);
  }
  w.SoulCapRoutes = w.SoulCapRoutes || {};
  w.SoulCapRoutes.calm = { ensure: ensure };
  if (w.SoulCapRoutes._resolveCalm) w.SoulCapRoutes._resolveCalm();
})(window);
