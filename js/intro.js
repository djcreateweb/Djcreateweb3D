/* ═══════════════════════════════════════════════════════════
   SITE INTRO — js/intro.js  (v2)
   Se ejecuta siempre al cargar. Espera a que Syne 800 esté
   disponible (máx. 800 ms) antes de arrancar la secuencia.

   Timing:
     T+0 ms   fondo + partículas                  (0.3 s)
     T+300    DJ clip-path reveal bottom→top       (0.5 s)
     T+800    Create slide from right + shimmer    (0.6 s)
     T+1400   línea gradiente reveal left→right    (0.5 s)
     T+1900   subtexto fade-in                     (0.4 s)
     T+2300   pausa con todo visible               (0.8 s)
     T+3100   stage fade-out                       (0.3 s)
     T+3400   máscara appear                       (0.2 s)
     T+3600   máscara expand                       (0.9 s)
     T+4500   overlay outro + nav desde arriba     (0.45 s)
     T+5050   cleanup
   ═══════════════════════════════════════════════════════════ */
(function siteIntro() {
  'use strict';

  const intro   = document.getElementById('siteIntro');
  if (!intro) return;

  const dj      = intro.querySelector('.si-dj');
  const create  = intro.querySelector('.si-create');
  const shimmer = intro.querySelector('.si-shimmer');
  const stage   = intro.querySelector('.si-stage');
  const line    = intro.querySelector('.si-line');
  const sub     = intro.querySelector('.si-sub');
  const mask    = intro.querySelector('.si-mask-layer');
  const canvas  = intro.querySelector('.si-canvas');
  const nav     = document.getElementById('nav');

  /* ── ocultar nav hasta que la intro complete ─────────── */
  if (nav) {
    nav.style.opacity    = '0';
    nav.style.transform  = 'translateX(-50%) translateY(-32px)';
    nav.style.transition = 'none';
  }

  /* ══════════════════════════════════════════════════════
     PARTÍCULAS  —  teal (#00F5D4) y púrpura (#7C3AED)
     1-3px de diámetro, flotando lentamente hacia arriba
  ══════════════════════════════════════════════════════ */
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, particles = [], rafId = 0, running = true;

  function initParticles() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    particles = Array.from({ length: 55 }, () => ({
      x:    Math.random() * W,
      y:    Math.random() * H,
      vx:   (Math.random() - 0.5) * 0.18,
      vy:   -(Math.random() * 0.32 + 0.05),
      r:    Math.random() * 1.0 + 0.5,    // 0.5–1.5px radio → 1–3px Ø
      a:    Math.random() * 0.09 + 0.03,  // 3–12% opacidad
      teal: Math.random() > 0.45,         // ~55% teal, ~45% purple
    }));
  }

  function tickParticles() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.teal
        ? `rgba(0,245,212,${p.a})`
        : `rgba(124,58,237,${p.a})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -4)    { p.y = H + 4; p.x = Math.random() * W; }
      if (p.x < -4)      p.x = W + 4;
      if (p.x > W + 4)   p.x = -4;
    }
    rafId = requestAnimationFrame(tickParticles);
  }

  initParticles();
  tickParticles();
  window.addEventListener('resize', initParticles, { passive: true });

  /* ══════════════════════════════════════════════════════
     SECUENCIA DE ANIMACIÓN
  ══════════════════════════════════════════════════════ */
  let seqStarted = false;

  function startSequence() {
    if (seqStarted) return;
    seqStarted = true;

    /* Fase 1 — fondo + partículas ya visibles (0.3 s de espera) */

    /* Fase 2 — DJ: clip-path reveal de abajo hacia arriba */
    setTimeout(() => dj.classList.add('si--show'), 300);

    /* Fase 3 — Create desliza desde la derecha + destello de luz */
    setTimeout(() => {
      create.classList.add('si--show');
      // Shimmer arranca ~60 ms después de que Create empieza a moverse
      setTimeout(() => shimmer.classList.add('si--sweep'), 60);
    }, 800);

    /* Fase 4 — Línea gradiente: reveal de izquierda a derecha */
    setTimeout(() => line.classList.add('si--show'), 1400);

    /* Fase 5 — Subtexto: fade-in */
    setTimeout(() => sub.classList.add('si--show'), 1900);

    /* Pausa 0.8 s — todo visible */

    /* Fase 6 — Stage fade-out */
    setTimeout(() => stage.classList.add('si--out'), 3100);

    /* Fase 7a — Máscara aparece (opacity 0→1 en 0.2 s) */
    setTimeout(() => {
      mask.classList.add('si--appear');
      canvas.classList.add('si--fade');   // partículas desaparecen
    }, 3400);

    /* Fase 7b — Máscara se expande (0.2 s después del appear) */
    setTimeout(() => mask.classList.add('si--expand'), 3600);

    /* Fase 8 — Overlay fade-out + nav entra desde arriba */
    setTimeout(() => {
      intro.classList.add('si--outro');

      // Liberar scroll (main.js también lo restaura ~T+4 s)
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';

      if (nav) {
        nav.style.transition =
          'opacity 0.45s ease, transform 0.48s cubic-bezier(0.2,0.82,0.2,1)';
        // Doble RAF: asegura que el navegador registra el estado
        // inicial (opacity 0 / translateY(-32px)) antes de la transición
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            nav.style.opacity   = '1';
            nav.style.transform = 'translateX(-50%) translateY(0)';
          });
        });
        // Limpiar inline styles una vez que la transición ha terminado
        setTimeout(() => {
          nav.style.transition = '';
          nav.style.opacity    = '';
          nav.style.transform  = '';
        }, 600);
      }
    }, 4500);

    /* Cleanup — eliminar el overlay del DOM */
    setTimeout(() => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', initParticles);
      if (intro.parentNode) intro.parentNode.removeChild(intro);
    }, 5050);
  }

  /* Esperar a que la fuente Syne 800 esté disponible.
     Si tarda más de 800 ms se inicia con la fuente fallback. */
  let fontReady = false;
  const onFontReady = () => {
    if (fontReady) return;
    fontReady = true;
    startSequence();
  };
  document.fonts.load('800 1em Syne').then(onFontReady).catch(onFontReady);
  setTimeout(onFontReady, 800);
})();
