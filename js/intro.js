/* ════════════════════════════════════════════════════════════
   DJ CREATE — Pantalla de carga · v7.0
   5 escenas (≈5s total): bg → panel → load → exit → curtain
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === 'className') node.className = attrs[key];
        else if (key === 'text') node.textContent = attrs[key];
        else node.setAttribute(key, attrs[key]);
      });
    }
    (children || []).forEach(function (child) {
      if (typeof child === 'string') node.appendChild(document.createTextNode(child));
      else if (child) node.appendChild(child);
    });
    return node;
  }

  // ── Build DOM ────────────────────────────────────────────────
  var root = el('div', { id: 'dj-intro' });

  // Two halves (curtain bg)
  var halfL = el('div', { className: 'dj-half dj-half--left' }, [
    el('span', { className: 'dj-shape dj-shape--1' }),
    el('span', { className: 'dj-shape dj-shape--2' })
  ]);
  var halfR = el('div', { className: 'dj-half dj-half--right' }, [
    el('span', { className: 'dj-shape dj-shape--3' }),
    el('span', { className: 'dj-shape dj-shape--4' })
  ]);
  root.appendChild(halfL);
  root.appendChild(halfR);

  // Panel
  var eyebrow = el('div', { className: 'dj-eyebrow' });
  eyebrow.textContent = 'Diseño • Desarrollo • Experiencia';

  var dj = el('span', { className: 'dj-tx-dj' });
  dj.textContent = 'DJ';
  var create = el('span', { className: 'dj-tx-create' });
  create.textContent = 'Create';
  var logoRow = el('div', { className: 'dj-logo-row' }, [dj, create]);

  var tagline = el('div', { className: 'dj-tagline' });
  tagline.textContent = 'Estudio de diseño Web — Murcia';

  var loaderLabel = el('span', { className: 'dj-loader-label' });
  loaderLabel.textContent = 'Preparando experiencia';
  var loaderPct = el('span', { className: 'dj-loader-pct' });
  loaderPct.textContent = '0%';
  var loaderRow = el('div', { className: 'dj-loader-row' }, [loaderLabel, loaderPct]);

  var loaderFill = el('div', { className: 'dj-loader-fill' });
  var loaderBar = el('div', { className: 'dj-loader-bar' }, [loaderFill]);
  var loader = el('div', { className: 'dj-loader' }, [loaderRow, loaderBar]);

  var content = el('div', { className: 'dj-panel-content' }, [
    eyebrow, logoRow, tagline, loader
  ]);
  var panel = el('div', { className: 'dj-panel' }, [content]);
  root.appendChild(panel);

  document.body.prepend(root);
  document.documentElement.classList.add('intro-active');
  document.body.classList.add('intro-active');
  window.scrollTo(0, 0);

  // ── Sequence ─────────────────────────────────────────────────
  // Escena 1 (0-1000): solo fondo
  // Escena 2 (1000-2000): panel + textos aparecen via CSS animations
  // Escena 3 (2000-3000): barra fills 0→100% + counter
  // Escena 4 (3000-4000): contenido + panel desaparecen
  // Escena 5 (4000-5000): telón se separa
  // Cleanup (5050): remove

  // Escena 3: T+2000 — barra llena + counter
  setTimeout(function () {
    loaderLabel.textContent = 'Cargando...';
    loaderFill.classList.add('is-active');
    loaderFill.style.width = '100%';

    var startTime = performance.now();
    var duration = 1000;
    function animatePct() {
      var t = Math.min(1, (performance.now() - startTime) / duration);
      var eased = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      var value = Math.round(eased * 100);
      loaderPct.textContent = value + '%';
      if (t < 1) requestAnimationFrame(animatePct);
      else loaderPct.textContent = '100%';
    }
    requestAnimationFrame(animatePct);
  }, 2000);

  // Escena 4: T+3000 — contenido fade out
  setTimeout(function () {
    root.classList.add('is-exit-content');
  }, 3000);

  // Escena 4: T+3500 — panel fade out con destello
  setTimeout(function () {
    root.classList.add('is-exit-panel');
  }, 3500);

  // Escena 5: T+4000 — telón se separa + revela hero content
  setTimeout(function () {
    root.classList.add('is-curtain');
    var hc = document.getElementById('heroContent');
    if (hc) hc.classList.add('visible');
  }, 4000);

  // Cleanup: T+5050
  setTimeout(function () {
    document.documentElement.classList.remove('intro-active');
    document.body.classList.remove('intro-active');
    if (root.parentNode) root.parentNode.removeChild(root);
  }, 5050);

})();
