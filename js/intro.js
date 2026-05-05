/* ════════════════════════════════════════════════════════════
   DJ CREATE — Loader controller
   Tiempos exactos: entrada 3s + salida 2s + cortina 2s = 7s
   Solo gestiona lock de scroll, pointer-events y la eliminación
   del DOM. Toda la animación visual está en css/intro.css.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var loader = document.getElementById('dj-loader-root');
  if (!loader) return;

  var html = document.documentElement;
  var body = document.body;

  // Lock scroll y reseteo a top
  html.classList.add('dj-loader-active');
  body.classList.add('dj-loader-active');
  window.scrollTo(0, 0);

  // prefers-reduced-motion: skip directo a la app
  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function cleanup() {
    html.classList.remove('dj-loader-active');
    body.classList.remove('dj-loader-active');
    if (loader.parentNode) loader.parentNode.removeChild(loader);
  }

  if (reduce) {
    cleanup();
    return;
  }

  // 6.5s — pointer-events: none para no bloquear clicks durante la cortina final
  setTimeout(function () {
    loader.style.pointerEvents = 'none';
  }, 6500);

  // 7s exactos — eliminar del DOM
  setTimeout(cleanup, 7000);

})();
