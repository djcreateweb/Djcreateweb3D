/* ════════════════════════════════════════════════════════════
   DJ CREATE — Preloader · v8.0
   Orquestador del intro por capas. Timeline ≈ 5.4s.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var preloader = document.getElementById('dj-preloader');
  if (!preloader) return;

  var pageContent = document.getElementById('page-content');
  var percentEl   = document.getElementById('dj-percent');
  var fillEl      = preloader.querySelector('.dj-progress-fill');
  var html        = document.documentElement;
  var body        = document.body;

  // Lock scroll durante la intro
  html.classList.add('is-preloading');
  body.classList.add('is-preloading');
  window.scrollTo(0, 0);

  // Reduced motion: salta la animación
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    finish();
    return;
  }

  // ── Helpers ────────────────────────────────────────────────
  function delay(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function animatePercent(duration) {
    return new Promise(function (resolve) {
      var start = performance.now();
      function tick() {
        var elapsed = performance.now() - start;
        var t = Math.min(1, elapsed / duration);
        var value = Math.round(easeInOutQuad(t) * 100);
        if (percentEl) percentEl.textContent = value + '%';
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          if (percentEl) percentEl.textContent = '100%';
          resolve();
        }
      }
      requestAnimationFrame(tick);
    });
  }

  function finish() {
    preloader.classList.add('is-finished');
    if (pageContent) pageContent.classList.add('is-revealed');

    // Revela el contenido del hero (que por defecto solo aparece al scroll
    // según la lógica de frames.js)
    var heroContent = document.getElementById('heroContent');
    if (heroContent) heroContent.classList.add('visible');

    html.classList.remove('is-preloading');
    body.classList.remove('is-preloading');
    setTimeout(function () {
      if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
    }, 250);
  }

  // ── Secuencia ──────────────────────────────────────────────
  // 0–1.0s: solo fondo (telón cerrado, capas ocultas)
  // 1.0s: aparece recuadro
  // 1.5s: aparece logo
  // 2.0s: aparecen textos superiores
  // 2.3s: aparecen textos de carga + barra + porcentaje
  // 2.6s: barra avanza 0→100% (1s) sincronizada con el contador
  // 3.6s: capas + recuadro fade-out
  // 4.4s: telón se abre (1s)
  // 5.4s: contenido visible, preloader fuera del DOM
  (async function run() {
    await delay(1000);
    preloader.classList.add('is-card-visible');

    await delay(500);
    preloader.classList.add('is-logo-visible');

    await delay(500);
    preloader.classList.add('is-text-top-visible');

    await delay(300);
    preloader.classList.add('is-text-load-visible');

    await delay(300);
    preloader.classList.add('is-loading');
    if (fillEl) fillEl.style.width = '100%';
    await animatePercent(1000);

    await delay(50);
    preloader.classList.add('is-hiding-card');

    await delay(800);
    preloader.classList.add('is-opening');

    await delay(1000);
    finish();
  })();

})();
