/* ═══════════════════════════════════════════════════════════
   SITE INTRO — js/intro.js
   Se ejecuta siempre al cargar. z-index 99999 tapa todo el
   contenido. Secuencia de 8 fases, ~4.4 s en total.
   ═══════════════════════════════════════════════════════════ */
(function siteIntro() {
  'use strict';

  const intro    = document.getElementById('siteIntro');
  if (!intro) return;

  const dj       = intro.querySelector('.si-dj');
  const create   = intro.querySelector('.si-create');
  const wordmark = intro.querySelector('.si-wordmark');
  const shimmer  = intro.querySelector('.si-shimmer');
  const stage    = intro.querySelector('.si-stage');
  const mask     = intro.querySelector('.si-mask-layer');
  const canvas   = intro.querySelector('.si-particles-canvas');
  const nav      = document.getElementById('nav');

  /* ── ocultar nav hasta que la intro complete ─────────── */
  if (nav) {
    nav.style.opacity    = '0';
    nav.style.transform  = 'translateX(-50%) translateY(-32px)';
    nav.style.transition = 'none';
  }

  /* ══════════════════════════════════════════════════════
     SISTEMA DE PARTÍCULAS
  ══════════════════════════════════════════════════════ */
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, particles = [], rafId = 0;

  function initParticles() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    particles = Array.from({ length: 52 }, () => ({
      x:    Math.random() * W,
      y:    Math.random() * H,
      vx:   (Math.random() - 0.5) * 0.2,
      vy:   -(Math.random() * 0.36 + 0.06),
      r:    Math.random() * 1.4 + 0.6,
      a:    Math.random() * 0.09 + 0.04,
      teal: Math.random() > 0.52,
    }));
  }

  function tickParticles() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.teal
        ? `rgba(0,245,212,${p.a})`
        : `rgba(255,255,255,${(p.a * 0.6).toFixed(3)})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
      if (p.x < -4) p.x = W + 4;
      if (p.x > W + 4) p.x = -4;
    }
    rafId = requestAnimationFrame(tickParticles);
  }

  initParticles();
  tickParticles();
  window.addEventListener('resize', initParticles, { passive: true });

  /* ══════════════════════════════════════════════════════
     SECUENCIA DE ANIMACIÓN
     T=0   pantalla negra + cuadrícula + partículas  (0.5 s)
     T=500 DJ entra: fade + escala 1.3→1 + deblur    (0.5 s)
     T=1050 Create desliza desde derecha              (0.65 s)
     T=1680 destello teal recorre el texto de izq→der (0.38 s)
     T=1750 glow teal+purple pausa de marca           (0.6 s)
     T=2350 texto hace fade-out                       (0.32 s)
     T=2700 aparece máscara rectangul-píldora         (0.22 s)
     T=2930 máscara se expande a pantalla completa    (0.82 s)
     T=3820 fade-out overlay + nav desliza desde arriba
  ══════════════════════════════════════════════════════ */

  // Fase 2 — DJ entra
  setTimeout(() => {
    dj.classList.add('si--visible');
  }, 500);

  // Fase 3 — Create desliza desde la derecha
  setTimeout(() => {
    create.classList.add('si--visible');
  }, 1050);

  // Destello teal cuando Create llega a su posición
  setTimeout(() => {
    shimmer.classList.add('si--sweep');
  }, 1680);

  // Fase 4 — Pausa con glow teal + purple
  setTimeout(() => {
    wordmark.classList.add('si--glow');
  }, 1750);

  // Fase 5 — Texto desaparece
  setTimeout(() => {
    stage.classList.add('si--fadeout');
  }, 2350);

  // Fase 6 — Aparece la máscara rectangular
  setTimeout(() => {
    mask.classList.add('si--appear');
  }, 2700);

  // Fase 7 — La máscara se expande hasta llenar pantalla
  setTimeout(() => {
    mask.classList.add('si--expand');
  }, 2930);

  // Fase 8 — Fade-out del overlay y entrada de la nav
  setTimeout(() => {
    intro.classList.add('si--outro');

    // Liberar scroll (main.js también lo libera ~T+4 s)
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    // Nav desliza desde arriba mientras el overlay desaparece
    if (nav) {
      nav.style.transition =
        'opacity 0.66s ease, transform 0.7s cubic-bezier(0.2, 0.82, 0.2, 1)';
      // Doble RAF para garantizar que el navegador registra
      // el estado inicial antes de lanzar la transición
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          nav.style.opacity   = '1';
          nav.style.transform = 'translateX(-50%) translateY(0)';
        });
      });

      // Limpiar estilos inline una vez finalizada la transición
      setTimeout(() => {
        nav.style.transition = '';
        nav.style.opacity    = '';
        nav.style.transform  = '';
      }, 850);
    }
  }, 3820);

  // Eliminar el overlay del DOM
  setTimeout(() => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', initParticles);
    if (intro.parentNode) intro.parentNode.removeChild(intro);
  }, 4420);
})();
