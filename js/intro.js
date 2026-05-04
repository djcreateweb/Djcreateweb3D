/* ════════════════════════════════════════════════════════════
   DJ CREATE 3D - Pantalla de carga v4.0 (clean rewrite)
   Canvas: targeting rings + converging particles
   Timeline: ~9.5s total
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // -- BUILD DOM (safe DOM methods, no innerHTML) ----------------
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function(k) {
        if (k === 'className') { node.className = attrs[k]; }
        else if (k === 'id')   { node.id        = attrs[k]; }
        else                   { node.setAttribute(k, attrs[k]); }
      });
    }
    if (children) {
      children.forEach(function(c) {
        if (typeof c === 'string') {
          node.appendChild(document.createTextNode(c));
        } else if (c) {
          node.appendChild(c);
        }
      });
    }
    return node;
  }

  function svgCorner(stroke) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 52 52');
    svg.setAttribute('fill', 'none');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M2 32V2H32');
    path.setAttribute('stroke', stroke);
    path.setAttribute('stroke-width', '1.2');
    path.setAttribute('stroke-linecap', 'round');
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '2');
    circle.setAttribute('cy', '2');
    circle.setAttribute('r', '2.2');
    circle.setAttribute('fill', stroke);
    svg.appendChild(path);
    svg.appendChild(circle);
    return svg;
  }

  function makeSpans(n) {
    var result = [];
    for (var i = 0; i < n; i++) { result.push(el('span')); }
    return result;
  }

  var root = document.createElement('div');
  root.id = 'dj-intro';

  // scan-line
  var scanLine = el('div', { className: 'scan-line' });
  root.appendChild(scanLine);

  // canvas
  var cv = el('canvas', { className: 'ic', id: 'ic' });
  root.appendChild(cv);

  // HUD frame
  var hud = el('div', { className: 'if' });
  var tl = el('div', { className: 'ico ico--tl' }); tl.appendChild(svgCorner('#00F5D4')); hud.appendChild(tl);
  var tr = el('div', { className: 'ico ico--tr' }); tr.appendChild(svgCorner('#00F5D4')); hud.appendChild(tr);
  var bl = el('div', { className: 'ico ico--bl' }); bl.appendChild(svgCorner('#3D9DFF')); hud.appendChild(bl);
  var br = el('div', { className: 'ico ico--br' }); br.appendChild(svgCorner('#3D9DFF')); hud.appendChild(br);

  var ibt = el('div', { className: 'ib ib--t' });
  var tagA = el('span', { className: 'itag' }); tagA.textContent = 'SYS.ACQUIRE · v4.0';
  var tagB = el('span', { className: 'itag' }); tagB.textContent = '37°59\'N  1°07\'W · MURCIA';
  var tagT = el('span', { className: 'itag itimer', id: 'itimer' }); tagT.textContent = '00:000';
  ibt.appendChild(tagA); ibt.appendChild(tagB); ibt.appendChild(tagT);

  var ibb = el('div', { className: 'ib ib--b' });
  var tagC = el('span', { className: 'itag' }); tagC.textContent = 'WEB.DESIGN.3D.STUDIO';
  var tagD = el('span', { className: 'itag' }); tagD.textContent = 'EST.2024';
  ibb.appendChild(tagC); ibb.appendChild(tagD);

  var tkL = el('div', { className: 'itks itks--l' }); makeSpans(9).forEach(function(s){ tkL.appendChild(s); });
  var tkR = el('div', { className: 'itks itks--r' }); makeSpans(9).forEach(function(s){ tkR.appendChild(s); });

  hud.appendChild(ibt); hud.appendChild(ibb); hud.appendChild(tkL); hud.appendChild(tkR);
  root.appendChild(hud);

  // Central stage
  var stage = el('div', { className: 'is', id: 'is' });

  var djw  = el('div', { className: 'idj-w', id: 'idjw' });
  var djTx = el('span', { className: 'idj' }); djTx.textContent = 'DJ';
  djw.appendChild(djTx);

  var crw  = el('div', { className: 'icr-w', id: 'icrw' });
  var crTx = el('span', { className: 'icr' }); crTx.textContent = 'Create';
  crw.appendChild(crTx);

  var shm  = el('div', { className: 'ishm', id: 'ishm' });
  var iln  = el('div', { className: 'iln',  id: 'iln'  });

  var sub  = el('p', { className: 'isub', id: 'isub' });
  sub.textContent = 'Agencia de diseño web 3D  ·  Murcia';

  var load = el('div', { className: 'iload', id: 'iload' });
  var loadSpan = el('span'); loadSpan.textContent = 'Cargando experiencia';
  var prog = el('div', { className: 'iprog' });
  var pfill = el('div', { className: 'iprog-f', id: 'ipf' });
  prog.appendChild(pfill);
  load.appendChild(loadSpan); load.appendChild(prog);

  stage.appendChild(djw); stage.appendChild(crw); stage.appendChild(shm);
  stage.appendChild(iln); stage.appendChild(sub); stage.appendChild(load);
  root.appendChild(stage);

  document.body.prepend(root);
  document.documentElement.classList.add('intro-active');
  document.body.classList.add('intro-active');
  window.scrollTo(0, 0);

  // -- CANVAS --------------------------------------------------
  var ctx = cv.getContext('2d');
  var W, H, CX, CY;
  var alive     = true;
  var rafId     = 0;
  var sec       = 0;
  var lastTs    = 0;
  var ringA     = 0;
  var lockPulse = 0;

  // Particles
  var N_PT = 40;
  var pts  = [];

  function initPts() {
    pts.length = 0;
    for (var i = 0; i < N_PT; i++) {
      var a = Math.random() * Math.PI * 2;
      var d = Math.random() * Math.max(W, H) * .65 + 80;
      pts.push({
        sx:  CX + Math.cos(a) * d,
        sy:  CY + Math.sin(a) * d,
        tx:  CX + (Math.random() - .5) * 320,
        ty:  CY + (Math.random() - .5) * 320,
        r:   Math.random() * 1.4 + .4,
        col: Math.random() > .5 ? '180,100%,65%' : '200,100%,60%',
        spd: Math.random() * .24 + .18
      });
    }
  }

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    CX = W / 2;
    CY = H / 2;
    cv.width        = W * dpr;
    cv.height       = H * dpr;
    cv.style.width  = W + 'px';
    cv.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    initPts();
  }

  function lerp(a, b, t) { return a + (b - a) * Math.min(1, Math.max(0, t)); }
  function ease(t)       { return t < .5 ? 2*t*t : -1+(4-2*t)*t; }

  function ring(r, lw, color, dash, angle) {
    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.lineWidth   = lw;
    ctx.strokeStyle = color;
    ctx.setLineDash(dash || []);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function arc(r, lw, color, startA, endA, angle) {
    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.arc(0, 0, r, startA, endA);
    ctx.lineWidth   = lw;
    ctx.strokeStyle = color;
    ctx.setLineDash([]);
    ctx.stroke();
    ctx.restore();
  }

  function frame(ts) {
    if (!alive) return;
    rafId = requestAnimationFrame(frame);
    var dt = Math.min(.05, (ts - lastTs) / 1000);
    lastTs = ts;
    sec   += dt;

    ctx.clearRect(0, 0, W, H);

    // Grid: animates 0 -> 0.8 in first 0.6s
    var gA = Math.min(.8, sec / .6);
    if (gA > 0) {
      var step = 62;
      ctx.save();
      ctx.strokeStyle = 'rgba(0,180,255,' + (gA * .038) + ')';
      ctx.lineWidth   = .5;
      for (var x = ((CX % step) + step) % step; x < W; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (var y = ((CY % step) + step) % step; y < H; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      ctx.restore();
    }

    // Particles
    var pAlpha = Math.min(1, sec * .9) * Math.max(0, 1 - Math.max(0, (sec - 3.2) / .9));
    if (pAlpha > 0) {
      pts.forEach(function(p) {
        var prog = ease(Math.min(1, sec / 3.8) * p.spd * 1.8);
        var px   = lerp(p.sx, p.tx, prog);
        var py   = lerp(p.sy, p.ty, prog);
        ctx.save();
        ctx.globalAlpha = pAlpha * .55;
        ctx.fillStyle   = 'hsl(' + p.col + ')';
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // Rings
    if (ringA > 0) {
      var a  = ringA;
      var lp = lockPulse;
      var R1 = Math.min(W, H) * .38;

      arc(R1, .9, 'rgba(0,245,212,' + (a * (.28 + lp * .35)) + ')',
        Math.PI * .12, Math.PI * .82,  sec / 32 * Math.PI * 2);
      arc(R1 * .92, .7, 'rgba(61,157,255,' + (a * (.28 + lp * .35)) + ')',
        Math.PI * 1.08, Math.PI * 1.78, -(sec / 38) * Math.PI * 2);

      if (lp > 0) {
        ring(R1 * (1 + lp * .025), .8, 'rgba(0,245,212,' + (lp * .22) + ')', null, 0);
      }

      // Mid ring -- dashed counter-rotation
      ring(R1 * .68, .6, 'rgba(0,180,255,' + (a * .14) + ')',
        [8, 14], -(sec / 24) * Math.PI * 2);

      // Inner arc
      arc(R1 * .42, .8, 'rgba(0,245,212,' + (a * .20) + ')',
        Math.PI * .1, Math.PI * 1.65,  sec / 18 * Math.PI * 2);
    }

    if (lockPulse > 0) lockPulse = Math.max(0, lockPulse - dt * 2.2);
  }

  var handleResize = function() { resize(); };
  resize();
  window.addEventListener('resize', handleResize, { passive: true });

  // Element refs
  var timerEl = document.getElementById('itimer');

  // Timer
  var t0 = performance.now();
  var timerAlive = true;
  (function tickTimer() {
    if (!timerAlive) return;
    var ms = performance.now() - t0;
    var s  = Math.floor(ms / 1000);
    var m  = Math.floor(ms % 1000);
    timerEl.textContent = (s < 10 ? '0' : '') + s + ':' + (m < 100 ? (m < 10 ? '00' : '0') : '') + m;
    requestAnimationFrame(tickTimer);
  })();

  // Start canvas loop
  rafId = requestAnimationFrame(function(ts) { lastTs = ts; requestAnimationFrame(frame); });

  // Fade helper
  function fadeIn(target, from, to, duration) {
    var v    = from;
    var step = (to - from) / (duration / 16);
    var go   = function() {
      v = (to > from) ? Math.min(to, v + step) : Math.max(to, v + step);
      target.value = v;
      if (v !== to) requestAnimationFrame(go);
    };
    requestAnimationFrame(go);
  }

  var ringProxy = {
    get value()  { return ringA; },
    set value(v) { ringA = v; }
  };

  // Page reveal
  var revealPrepared = false;
  var revealHero     = null;
  var revealNav      = null;
  var revealBeam     = null;

  function preparePageReveal() {
    if (revealPrepared) return;
    revealPrepared = true;
    revealHero = document.getElementById('hero');
    revealNav  = document.getElementById('nav');

    if (revealHero) {
      revealHero.style.opacity       = '0';
      revealHero.style.filter        = 'blur(22px) brightness(.78) saturate(1.18)';
      revealHero.style.transform     = 'translateY(34px) scale(1.035)';
      revealHero.style.transformOrigin = 'center top';
      revealHero.style.transition    = 'opacity 1.65s cubic-bezier(.16,1,.3,1), filter 1.65s cubic-bezier(.16,1,.3,1), transform 1.65s cubic-bezier(.16,1,.3,1)';
    }
    if (revealNav) {
      revealNav.style.opacity    = '0';
      revealNav.style.filter     = 'blur(10px)';
      revealNav.style.transform  = 'translateX(-50%) translateY(-28px) scale(.985)';
      revealNav.style.transition = 'opacity 1.25s cubic-bezier(.16,1,.3,1), filter 1.25s cubic-bezier(.16,1,.3,1), transform 1.25s cubic-bezier(.16,1,.3,1)';
    }

    revealBeam = document.createElement('div');
    revealBeam.className = 'ireveal';
    root.appendChild(revealBeam);

    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        if (revealHero) {
          revealHero.style.opacity   = '1';
          revealHero.style.filter    = 'blur(0) brightness(1) saturate(1)';
          revealHero.style.transform = 'translateY(0) scale(1)';
        }
        if (revealNav) {
          revealNav.style.opacity   = '1';
          revealNav.style.filter    = 'blur(0)';
          revealNav.style.transform = 'translateX(-50%) translateY(0)';
        }
        if (revealBeam) revealBeam.classList.add('is-in');
      });
    });
  }

  function clearPageReveal() {
    if (revealHero) {
      revealHero.style.transition    = '';
      revealHero.style.opacity       = '';
      revealHero.style.filter        = '';
      revealHero.style.transform     = '';
      revealHero.style.transformOrigin = '';
    }
    if (revealNav) {
      revealNav.style.transition = '';
      revealNav.style.opacity    = '';
      revealNav.style.filter     = '';
      revealNav.style.transform  = '';
    }
    if (revealBeam) revealBeam.remove();
  }

  // -- SEQUENCE (~9.5s total) -----------------------------------

  // T+500: rings fade in (900ms)
  setTimeout(function() { fadeIn(ringProxy, 0, 1, 900); }, 500);

  // T+1200: DJ slams up
  setTimeout(function() { djw.classList.add('is-in'); }, 1200);

  // T+1900: CREATE sweeps in
  setTimeout(function() { crw.classList.add('is-in'); }, 1900);

  // T+2400: shimmer line
  setTimeout(function() { shm.classList.add('is-run'); }, 2400);

  // T+2750: lock-on pulse
  setTimeout(function() {
    lockPulse = 1;
    root.classList.add('is-lock');
    setTimeout(function() { root.classList.remove('is-lock'); }, 700);
  }, 2750);

  // T+3350: subtitle fades up
  setTimeout(function() { sub.classList.add('is-in'); }, 3350);

  // T+3850: loading bar appears
  setTimeout(function() { load.classList.add('is-in'); }, 3850);

  // T+4150: progress bar fills (1.35s)
  setTimeout(function() {
    pfill.style.transition = 'width 1.35s cubic-bezier(.25,.46,.45,.94)';
    pfill.style.width      = '100%';
  }, 4150);

  // T+5700: stage evaporates + ring + HUD fade
  setTimeout(function() {
    stage.style.transition = 'opacity 1s cubic-bezier(.25,.46,.45,.94), transform 1s cubic-bezier(.25,.46,.45,.94), filter 1s cubic-bezier(.25,.46,.45,.94)';
    stage.style.opacity    = '0';
    stage.style.transform  = 'translate(-50%, -50%) scale(1.035)';
    stage.style.filter     = 'blur(14px)';
    fadeIn(ringProxy, ringA, 0, 1000);
    root.querySelectorAll('.ib, .ico, .itks').forEach(function(e) {
      e.style.transition = 'opacity .8s ease';
      e.style.opacity    = '0';
    });
  }, 5700);

  // T+6400: cinematic bloom
  setTimeout(function() { root.classList.add('is-revealing'); }, 6400);

  // T+7400: flash
  setTimeout(function() {
    var flash = document.createElement('div');
    flash.className = 'iflash';
    root.appendChild(flash);
    setTimeout(function() { flash.remove(); }, 700);
  }, 7400);

  // T+7950: page enters below
  setTimeout(function() { preparePageReveal(); }, 7950);

  // T+8350: final wipe-out
  setTimeout(function() { root.classList.add('is-out'); }, 8350);

  // T+9800: cleanup
  setTimeout(function() {
    alive      = false;
    timerAlive = false;
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', handleResize);
    document.documentElement.classList.remove('intro-active');
    document.body.classList.remove('intro-active');
    root.remove();
    setTimeout(clearPageReveal, 800);
  }, 9800);

})();
