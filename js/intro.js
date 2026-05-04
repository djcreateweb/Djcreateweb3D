/* ════════════════════════════════════════════════════════════
   DJ CREATE — Targeting Sequence intro
   Canvas: anillos de reticle + partículas convergentes
   Timeline: ~5.8 s total
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── BUILD DOM ──────────────────────────────────────────────
  const el = document.createElement('div');
  el.id = 'dj-intro';
  el.innerHTML = `
    <canvas class="ic" id="ic"></canvas>

    <div class="if">
      <div class="ico ico--tl"><svg viewBox="0 0 52 52" fill="none"><path d="M2 32V2H32" stroke="#00F5D4" stroke-width="1.2" stroke-linecap="round"/><circle cx="2" cy="2" r="2.2" fill="#00F5D4"/></svg></div>
      <div class="ico ico--tr"><svg viewBox="0 0 52 52" fill="none"><path d="M2 32V2H32" stroke="#00F5D4" stroke-width="1.2" stroke-linecap="round"/><circle cx="2" cy="2" r="2.2" fill="#00F5D4"/></svg></div>
      <div class="ico ico--bl"><svg viewBox="0 0 52 52" fill="none"><path d="M2 32V2H32" stroke="#00B4FF" stroke-width="1.2" stroke-linecap="round"/><circle cx="2" cy="2" r="2.2" fill="#00B4FF"/></svg></div>
      <div class="ico ico--br"><svg viewBox="0 0 52 52" fill="none"><path d="M2 32V2H32" stroke="#00B4FF" stroke-width="1.2" stroke-linecap="round"/><circle cx="2" cy="2" r="2.2" fill="#00B4FF"/></svg></div>

      <div class="ib ib--t">
        <span class="itag">SYS.ACQUIRE&nbsp;·&nbsp;v2.4</span>
        <span class="itag">37°59'N&nbsp;&nbsp;1°07'W&nbsp;·&nbsp;MURCIA</span>
        <span class="itag itimer" id="itimer">00:000</span>
      </div>
      <div class="ib ib--b">
        <span class="itag">WEB.DESIGN.3D.STUDIO</span>
        <span class="itag">EST.2024</span>
      </div>

      <div class="itks itks--l"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
      <div class="itks itks--r"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
    </div>

    <div class="is" id="is">
      <div class="idj-w" id="idjw"><span class="idj">DJ</span></div>
      <div class="icr-w" id="icrw"><span class="icr">Create</span></div>
      <div class="ishm" id="ishm"></div>
      <div class="iln"  id="iln"></div>
      <p  class="isub" id="isub">Agencia de diseño web 3D &nbsp;·&nbsp; Murcia</p>
      <div class="iload" id="iload">
        <span>Cargando experiencia</span>
        <div class="iprog"><div class="iprog-f" id="ipf"></div></div>
      </div>
    </div>

  `;
  document.body.prepend(el);
  document.documentElement.classList.add('intro-active');
  document.body.classList.add('intro-active');
  window.scrollTo(0, 0);

  // ── CANVAS ─────────────────────────────────────────────────
  const cv  = document.getElementById('ic');
  const ctx = cv.getContext('2d');
  let W, H, CX, CY;
  let alive  = true;
  let rafId  = 0;
  let sec    = 0; // running time in seconds
  let lastTs = 0;

  // Controllable state
  let ringA    = 0;   // ring opacity (0→1)
  let lockPulse= 0;   // 0→1→0, decays

  // Particles — converge toward random inner positions
  const N_PT = 55;
  const pts  = [];

  function initPts () {
    pts.length = 0;
    for (let i = 0; i < N_PT; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * Math.max(W, H) * .65 + 80;
      pts.push({
        sx: CX + Math.cos(a) * d,
        sy: CY + Math.sin(a) * d,
        tx: CX + (Math.random() - .5) * 320,
        ty: CY + (Math.random() - .5) * 320,
        r:  Math.random() * 1.4 + .4,
        col: Math.random() > .5 ? '180,100%,65%' : '200,100%,60%', // HSL teal/blue
        spd: Math.random() * .35 + .25,
      });
    }
  }

  function resize () {
    const dpr = window.devicePixelRatio || 1;
    W = window.innerWidth; H = window.innerHeight;
    CX = W / 2; CY = H / 2;
    cv.width  = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    initPts();
  }

  function lerp (a, b, t) { return a + (b - a) * Math.min(1, Math.max(0, t)); }
  function ease (t) { return t < .5 ? 2*t*t : -1+(4-2*t)*t; } // easeInOut

  // ── DRAW RING ─────────────────────────────────────────────
  function ring (r, lw, color, dash, angle) {
    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.lineWidth = lw;
    ctx.strokeStyle = color;
    if (dash) ctx.setLineDash(dash); else ctx.setLineDash([]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // ── DRAW PARTIAL ARC ──────────────────────────────────────
  function arc (r, lw, color, startA, endA, angle) {
    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.arc(0, 0, r, startA, endA);
    ctx.lineWidth = lw;
    ctx.strokeStyle = color;
    ctx.setLineDash([]);
    ctx.stroke();
    ctx.restore();
  }

  // ── TICK MARKS ON OUTER RING ───────────────────────────────
  function ticks (r, n, color, angle) {
    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(angle);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const isMajor = i % (n / 4) === 0;
      const outer = r + (isMajor ? 14 : 7);
      const inner = r - (isMajor ?  4 : 1);
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
      ctx.lineTo(Math.cos(a) * outer, Math.sin(a) * outer);
      ctx.lineWidth = isMajor ? 1.2 : .6;
      ctx.strokeStyle = isMajor ? color : color.replace(/[\d.]+\)$/, '.4)');
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── MAIN FRAME ────────────────────────────────────────────
  function frame (ts) {
    if (!alive) return;
    rafId = requestAnimationFrame(frame);
    const dt = Math.min(.05, (ts - lastTs) / 1000);
    lastTs = ts;
    sec += dt;

    ctx.clearRect(0, 0, W, H);

    // Grid
    const gA = 0;
    if (gA > 0) {
      const step = 55;
      ctx.save();
      ctx.strokeStyle = `rgba(0,180,255,${gA * .038})`;
      ctx.lineWidth = .5;
      for (let x = ((CX % step) + step) % step; x < W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = ((CY % step) + step) % step; y < H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.restore();
    }

    // Particles
    const pAlpha = Math.min(1, sec * .9) * Math.max(0, 1 - Math.max(0, (sec - 3.2) / .9));
    if (pAlpha > 0) {
      pts.forEach(p => {
        const prog = ease(Math.min(1, sec / 3.5) * p.spd * 1.8);
        const px = lerp(p.sx, p.tx, prog);
        const py = lerp(p.sy, p.ty, prog);
        ctx.save();
        ctx.globalAlpha = pAlpha * .55;
        ctx.fillStyle = `hsl(${p.col})`;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // Soft outer orbit. Keep the center clear so no line cuts the logo.
    if (ringA > 0) {
      const a = ringA;
      const lp = lockPulse;
      const R1 = Math.min(W, H) * .38;

      // Outer orbit only: the center stays clear for the wordmark.
      arc(R1, .9, `rgba(0,245,212,${a * (.12 + lp * .2)})`,
        Math.PI * .12, Math.PI * .82, sec / 32 * Math.PI * 2);
      arc(R1 * .92, .7, `rgba(61,157,255,${a * .1})`,
        Math.PI * 1.08, Math.PI * 1.78, -(sec / 38) * Math.PI * 2);

      // Glow ring outer (locked)
      if (lp > 0) {
        ring(R1 * (1 + lp * .025), .8, `rgba(0,245,212,${lp * .18})`, null, 0);
      }

      // Mid ring — dashed, counter-rotation

      // Inner arc — 3/4 circle, faster

      // Second inner arc — 1/4, offset

    }

    // Decay lock pulse
    if (lockPulse > 0) lockPulse = Math.max(0, lockPulse - dt * 2.2);
  }

  const handleResize = () => { resize(); };
  resize();
  window.addEventListener('resize', handleResize, { passive: true });

  // ── ELEMENT REFS ───────────────────────────────────────────
  const stage = document.getElementById('is');
  const djw   = document.getElementById('idjw');
  const crw   = document.getElementById('icrw');
  const shm   = document.getElementById('ishm');
  const ln    = document.getElementById('iln');
  const sub   = document.getElementById('isub');
  const load  = document.getElementById('iload');
  const pfill = document.getElementById('ipf');
  const timer = document.getElementById('itimer');

  // ── TIMER ──────────────────────────────────────────────────
  const t0 = performance.now();
  let timerAlive = true;
  (function tickTimer () {
    if (!timerAlive) return;
    const ms = performance.now() - t0;
    const s = Math.floor(ms / 1000);
    const m = Math.floor(ms % 1000);
    timer.textContent = `${String(s).padStart(2,'0')}:${String(m).padStart(3,'0')}`;
    requestAnimationFrame(tickTimer);
  })();

  // ── START CANVAS LOOP ──────────────────────────────────────
  rafId = requestAnimationFrame(ts => { lastTs = ts; requestAnimationFrame(frame); });

  // ── ANIMATION HELPERS ─────────────────────────────────────
  function fadeIn (target, from, to, duration) {
    let v = from;
    const step = (to - from) / (duration / 16);
    const go = () => {
      v = (to > from) ? Math.min(to, v + step) : Math.max(to, v + step);
      target.value = v;
      if (v !== to) requestAnimationFrame(go);
    };
    requestAnimationFrame(go);
  }

  // Use a proxy object so the ring fade works cleanly
  const ringProxy = { set value(v) { ringA = v; }, get value() { return ringA; } };

  let revealPrepared = false;
  let revealHero = null;
  let revealNav = null;
  let revealBeam = null;

  function preparePageReveal () {
    if (revealPrepared) return;
    revealPrepared = true;
    revealHero = document.getElementById('hero');
    revealNav = document.getElementById('nav');

    if (revealHero) {
      revealHero.style.opacity = '0';
      revealHero.style.filter = 'blur(22px) brightness(.78) saturate(1.18)';
      revealHero.style.transform = 'translateY(34px) scale(1.035)';
      revealHero.style.transformOrigin = 'center top';
      revealHero.style.transition = 'opacity 1.65s cubic-bezier(.16,1,.3,1), filter 1.65s cubic-bezier(.16,1,.3,1), transform 1.65s cubic-bezier(.16,1,.3,1)';
    }

    if (revealNav) {
      revealNav.style.opacity = '0';
      revealNav.style.filter = 'blur(10px)';
      revealNav.style.transform = 'translateX(-50%) translateY(-28px) scale(.985)';
      revealNav.style.transition = 'opacity 1.25s cubic-bezier(.16,1,.3,1), filter 1.25s cubic-bezier(.16,1,.3,1), transform 1.25s cubic-bezier(.16,1,.3,1)';
    }

    revealBeam = document.createElement('div');
    revealBeam.className = 'ireveal';
    el.appendChild(revealBeam);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (revealHero) {
        revealHero.style.opacity = '1';
        revealHero.style.filter = 'blur(0) brightness(1) saturate(1)';
        revealHero.style.transform = 'translateY(0) scale(1)';
      }
      if (revealNav) {
        revealNav.style.opacity = '1';
        revealNav.style.filter = 'blur(0)';
        revealNav.style.transform = 'translateX(-50%) translateY(0)';
      }
      if (revealBeam) revealBeam.classList.add('is-in');
    }));
  }

  function clearPageReveal () {
    if (revealHero) {
      revealHero.style.transition = '';
      revealHero.style.opacity = '';
      revealHero.style.filter = '';
      revealHero.style.transform = '';
      revealHero.style.transformOrigin = '';
    }
    if (revealNav) {
      revealNav.style.transition = '';
      revealNav.style.opacity = '';
      revealNav.style.filter = '';
      revealNav.style.transform = '';
    }
    if (revealBeam) revealBeam.remove();
  }

  // ── SEQUENCE ───────────────────────────────────────────────

  // T+400: rings fade in over 600ms
  setTimeout(() => { fadeIn(ringProxy, 0, 1, 900); }, 500);

  // T+1200: DJ slams up
  setTimeout(() => { djw.classList.add('is-in'); }, 1450);

  // T+1750: CREATE sweeps from right
  setTimeout(() => { crw.classList.add('is-in'); }, 2300);

  // T+1950: shimmer flash
  setTimeout(() => { shm.classList.add('is-run'); }, 2850);

  // T+2150: LOCK-ON — rings pulse, stage flashes
  setTimeout(() => {
    lockPulse = 1;
    el.classList.add('is-lock');
    setTimeout(() => el.classList.remove('is-lock'), 800);
  }, 3400);

  // T+2350: divider line draws
  setTimeout(() => { ln.classList.add('is-in'); }, 3750);

  // T+2550: sub fades up
  setTimeout(() => { sub.classList.add('is-in'); }, 4300);

  // T+4600: centered loading line appears
  setTimeout(() => { load.classList.add('is-in'); }, 4600);

  // T+3000: progress bar fills
  setTimeout(() => {
    pfill.style.transition = 'width 1.15s cubic-bezier(.25,.46,.45,.94)';
    pfill.style.width = '100%';
  }, 5000);

  // T+4200: stage evaporates
  setTimeout(() => {
    stage.style.transition = 'opacity 1s cubic-bezier(.25,.46,.45,.94), transform 1s cubic-bezier(.25,.46,.45,.94), filter 1s cubic-bezier(.25,.46,.45,.94)';
    stage.style.opacity    = '0';
    stage.style.transform  = 'translate(-50%, -50%) scale(1.035)';
    stage.style.filter     = 'blur(14px)';
    // Fade rings out simultaneously
    fadeIn(ringProxy, ringA, 0, 1000);
    // Fade HUD
    el.querySelectorAll('.ib, .ico, .itks').forEach(e => {
      e.style.transition = 'opacity .8s ease';
      e.style.opacity    = '0';
    });
  }, 6400);

  // T+7100: open the site with a soft cinematic reveal
  setTimeout(() => {
    el.classList.add('is-revealing');
  }, 7100);

  // T+8300: light flash before the page appears
  setTimeout(() => {
    const flash = document.createElement('div');
    flash.className = 'iflash';
    el.appendChild(flash);
    setTimeout(() => flash.remove(), 700);
  }, 8300);

  // T+8900: the first screen starts entering below the intro
  setTimeout(() => { preparePageReveal(); }, 8900);

  // T+9300: final wipe out
  setTimeout(() => { el.classList.add('is-out'); }, 9300);

  // T+11000: remove the overlay and restore the page
  setTimeout(() => {
    alive = false;
    timerAlive = false;
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', handleResize);
    document.documentElement.classList.remove('intro-active');
    document.body.classList.remove('intro-active');
    el.remove();
    setTimeout(clearPageReveal, 800);
  }, 11000);

})();
