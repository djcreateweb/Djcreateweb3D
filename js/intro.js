/* ════════════════════════════════════════════════════════════
   DJ CREATE 3D - Pantalla de carga v6.0
   Canvas: soft targeting field + particle trails
   Timeline: ~7.8s total
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
  var tagA = el('span', { className: 'itag' }); tagA.textContent = 'DJ.CREATE · v6.0';
  var tagB = el('span', { className: 'itag' }); tagB.textContent = '37°59\'N  1°07\'W · MURCIA';
  var tagT = el('span', { className: 'itag itimer', id: 'itimer' }); tagT.textContent = '00:000';
  ibt.appendChild(tagA); ibt.appendChild(tagB); ibt.appendChild(tagT);

  var ibb = el('div', { className: 'ib ib--b' });
  var tagC = el('span', { className: 'itag' }); tagC.textContent = 'BESPOKE.WEB.EXPERIENCE';
  var tagD = el('span', { className: 'itag' }); tagD.textContent = 'EST.2024';
  ibb.appendChild(tagC); ibb.appendChild(tagD);

  var tkL = el('div', { className: 'itks itks--l' }); makeSpans(9).forEach(function(s){ tkL.appendChild(s); });
  var tkR = el('div', { className: 'itks itks--r' }); makeSpans(9).forEach(function(s){ tkR.appendChild(s); });

  hud.appendChild(ibt); hud.appendChild(ibb); hud.appendChild(tkL); hud.appendChild(tkR);
  root.appendChild(hud);

  // Central stage
  var stage = el('div', { className: 'is', id: 'is' });
  var status = el('p', { className: 'istat' });
  status.textContent = 'Cargando escena inicial';

  var djw  = el('div', { className: 'idj-w', id: 'idjw' });
  var djTx = el('span', { className: 'idj' }); djTx.textContent = 'DJ';
  djw.appendChild(djTx);

  var idiv = el('span', { className: 'idiv' });

  var crw  = el('div', { className: 'icr-w', id: 'icrw' });
  var crTx = el('span', { className: 'icr' });
  'Create'.split('').forEach(function(ch, i) {
    var lt = el('span', { className: 'letter' });
    lt.appendChild(document.createTextNode(ch));
    crTx.appendChild(lt);
  });
  crw.appendChild(crTx);

  var shm  = el('div', { className: 'ishm', id: 'ishm' });
  var iln  = el('div', { className: 'iln',  id: 'iln'  });

  var sub  = el('p', { className: 'isub', id: 'isub' });

  var load     = el('div', { className: 'iload', id: 'iload' });
  var loadTop  = el('div', { className: 'iload-top' });
  var loadSpan = el('span'); loadSpan.textContent = 'Cargando experiencia';
  var pct      = el('span', { className: 'ipct', id: 'ipct' }); pct.textContent = '0%';
  loadTop.appendChild(loadSpan); loadTop.appendChild(pct);
  var prog  = el('div', { className: 'iprog' });
  var pfill = el('div', { className: 'iprog-f', id: 'ipf' });
  prog.appendChild(pfill);
  load.appendChild(loadTop); load.appendChild(prog);

  var wmw = el('div', { className: 'iwm' });
  wmw.appendChild(djw);
  wmw.appendChild(idiv);
  wmw.appendChild(crw);
  stage.appendChild(wmw);
  stage.appendChild(shm);
  stage.appendChild(iln);
  stage.appendChild(sub);
  stage.appendChild(status);
  stage.appendChild(load);
  root.appendChild(stage);

  var aperture = el('div', { className: 'iaperture' });
  var curtainTop = el('div', { className: 'icurtain icurtain--top' });
  var curtainBot = el('div', { className: 'icurtain icurtain--bot' });
  root.appendChild(aperture);
  root.appendChild(curtainTop);
  root.appendChild(curtainBot);

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
  var cubeAlpha = 0;
  var lockPulse = 0;

  // Cube geometry (unit cube centred at origin)
  var CUBE_VERTS = [
    [-1,-1,-1],[ 1,-1,-1],[ 1, 1,-1],[-1, 1,-1],
    [-1,-1, 1],[ 1,-1, 1],[ 1, 1, 1],[-1, 1, 1]
  ];
  var CUBE_EDGES = [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7]
  ];

  // Particles
  var N_PT = 40;
  var pts  = [];

  function initPts() {
    pts.length = 0;
    for (var i = 0; i < N_PT; i++) {
      var a = Math.random() * Math.PI * 2;
      var d = Math.random() * Math.max(W, H) * .65 + 80;
      pts.push({
        sx:    CX + Math.cos(a) * d,
        sy:    CY + Math.sin(a) * d,
        tx:    CX + (Math.random() - .5) * 320,
        ty:    CY + (Math.random() - .5) * 320,
        r:     Math.random() * 1.4 + .4,
        col:   Math.random() > .5 ? '180,100%,65%' : '200,100%,60%',
        spd:   Math.random() * .24 + .18,
        trail: []
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
  function ease(t)        { return t < .5 ? 2*t*t : -1+(4-2*t)*t; }

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

  // Rotating wireframe cube — perspective projection
  function drawCube(t) {
    if (cubeAlpha <= 0) return;
    var size   = Math.min(W, H) * 0.28;
    var angleY = t * 0.3;
    var angleX = 0.35;
    var fov    = 2.8;

    var proj = CUBE_VERTS.map(function(v) {
      // Rotate Y
      var rx  = v[0] * Math.cos(angleY) + v[2] * Math.sin(angleY);
      var ry  = v[1];
      var rz  = -v[0] * Math.sin(angleY) + v[2] * Math.cos(angleY);
      // Rotate X (fixed tilt)
      var ry2 = ry * Math.cos(angleX) - rz * Math.sin(angleX);
      var rz2 = ry * Math.sin(angleX) + rz * Math.cos(angleX);
      // Perspective divide
      var sc  = size / (fov + rz2);
      return [CX + rx * sc, CY + ry2 * sc, rz2];
    });

    ctx.save();
    CUBE_EDGES.forEach(function(e) {
      var a = proj[e[0]];
      var b = proj[e[1]];
      var depth = Math.min(1, Math.max(0.2, (a[2] + b[2]) / 4 + 0.65));
      ctx.strokeStyle = 'rgba(0,245,212,' + (cubeAlpha * 0.18 * depth) + ')';
      ctx.lineWidth   = 0.7;
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
    });
    ctx.restore();
  }

  function frame(ts) {
    if (!alive) return;
    rafId = requestAnimationFrame(frame);
    var dt = Math.min(.05, (ts - lastTs) / 1000);
    lastTs = ts;
    sec   += dt;

    ctx.clearRect(0, 0, W, H);

    // Grid: fade in during first 0.6s
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

    // Wireframe cube (behind rings)
    drawCube(sec);

    // Particles with light trails
    var pAlpha = Math.min(1, sec * .9) * Math.max(0, 1 - Math.max(0, (sec - 3.2) / .9));
    if (pAlpha > 0) {
      pts.forEach(function(p) {
        var pr = ease(Math.min(1, sec / 3.8) * p.spd * 1.8);
        var px = lerp(p.sx, p.tx, pr);
        var py = lerp(p.sy, p.ty, pr);

        // Update trail
        p.trail.push({ x: px, y: py });
        if (p.trail.length > 10) p.trail.shift();

        // Draw trail as connected segments with fading opacity
        if (p.trail.length > 1) {
          for (var ti = 0; ti < p.trail.length - 1; ti++) {
            var tA = pAlpha * ((ti + 1) / p.trail.length) * 0.30;
            ctx.save();
            ctx.globalAlpha = tA;
            ctx.strokeStyle = 'hsl(' + p.col + ')';
            ctx.lineWidth   = p.r * 0.55;
            ctx.beginPath();
            ctx.moveTo(p.trail[ti].x, p.trail[ti].y);
            ctx.lineTo(p.trail[ti + 1].x, p.trail[ti + 1].y);
            ctx.stroke();
            ctx.restore();
          }
        }

        // Main dot
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

      ring(R1 * .68, .6, 'rgba(0,180,255,' + (a * .14) + ')',
        [8, 14], -(sec / 24) * Math.PI * 2);

      arc(R1 * .42, .8, 'rgba(0,245,212,' + (a * .20) + ')',
        Math.PI * .1, Math.PI * 1.65,  sec / 18 * Math.PI * 2);
    }

    if (lockPulse > 0) lockPulse = Math.max(0, lockPulse - dt * 2.2);
  }

  var handleResize = function() { resize(); };
  resize();
  window.addEventListener('resize', handleResize, { passive: true });

  // Timer
  var timerEl    = document.getElementById('itimer');
  var t0         = performance.now();
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

  // Fade helper (animates target.value from→to over duration ms)
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
  var cubeProxy = {
    get value()  { return cubeAlpha; },
    set value(v) { cubeAlpha = v; }
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

    var heroContent = document.getElementById('heroContent');
    var heroEls = heroContent ? Array.prototype.slice.call(heroContent.children) : [];

    // Hero section: aparece debajo de la apertura de lente.
    if (revealHero) {
      revealHero.style.opacity         = '0';
      revealHero.style.filter          = 'blur(24px) brightness(.68) saturate(1.22)';
      revealHero.style.transform       = 'translateY(42px) scale(1.045)';
      revealHero.style.transformOrigin = 'center top';
      revealHero.style.transition      = 'none';
    }

    // Hero content children: translateY stagger (opacity from parent)
    heroEls.forEach(function(child) {
      child.style.transform  = 'translateY(30px)';
      child.style.filter     = 'blur(5px)';
      child.style.transition = 'none';
      if (child.classList.contains('hero-title')) {
        child.style.clipPath       = 'inset(0 100% 0 0)';
        child.style.webkitClipPath = 'inset(0 100% 0 0)';
      }
    });

    if (revealNav) {
      revealNav.style.opacity    = '0';
      revealNav.style.filter     = 'blur(10px)';
      revealNav.style.transform  = 'translateX(-50%) translateY(-28px) scale(.985)';
      revealNav.style.transition = 'none';
    }

    revealBeam = document.createElement('div');
    revealBeam.className = 'ireveal';
    root.appendChild(revealBeam);

    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        // Hero section reveal
        if (revealHero) {
          revealHero.style.transition =
            'opacity 1.85s cubic-bezier(.16,1,.3,1),' +
            'filter 2.1s cubic-bezier(.16,1,.3,1),' +
            'transform 2.1s cubic-bezier(.16,1,.3,1)';
          revealHero.style.opacity   = '1';
          revealHero.style.filter    = 'blur(0) brightness(1) saturate(1)';
          revealHero.style.transform = 'translateY(0) scale(1)';
        }

        // Nav reveal
        if (revealNav) {
          revealNav.style.transition =
            'opacity 1.2s cubic-bezier(.16,1,.3,1) .34s,' +
            'filter 1.2s cubic-bezier(.16,1,.3,1) .34s,' +
            'transform 1.2s cubic-bezier(.16,1,.3,1) .34s';
          revealNav.style.opacity   = '1';
          revealNav.style.filter    = 'blur(0)';
          revealNav.style.transform = 'translateX(-50%) translateY(0)';
        }

        // Stagger hero content children
        heroEls.forEach(function(child, i) {
          var d = (i * 130 + 80) + 'ms';
          var isTitle = child.classList.contains('hero-title');
          child.style.transition =
            'transform 1.35s cubic-bezier(.16,1,.3,1) ' + d + ',' +
            'filter 1.1s cubic-bezier(.16,1,.3,1) ' + d +
            (isTitle
              ? ',clip-path 1.8s cubic-bezier(.16,1,.3,1) ' + d +
                ',-webkit-clip-path 1.8s cubic-bezier(.16,1,.3,1) ' + d
              : '');
          child.style.transform = 'translateY(0)';
          child.style.filter    = 'blur(0)';
          if (isTitle) {
            child.style.clipPath       = 'inset(0 0 0 0)';
            child.style.webkitClipPath = 'inset(0 0 0 0)';
          }
        });

        if (revealBeam) revealBeam.classList.add('is-in');
      });
    });
  }

  function clearPageReveal() {
    if (revealHero) {
      revealHero.style.transition      = '';
      revealHero.style.opacity         = '';
      revealHero.style.filter          = '';
      revealHero.style.transform       = '';
      revealHero.style.transformOrigin = '';
    }
    var heroContent = document.getElementById('heroContent');
    if (heroContent) {
      Array.prototype.slice.call(heroContent.children).forEach(function(child) {
        child.style.transition       = '';
        child.style.transform        = '';
        child.style.filter           = '';
        child.style.clipPath         = '';
        child.style.webkitClipPath   = '';
      });
    }
    if (revealNav) {
      revealNav.style.transition = '';
      revealNav.style.opacity    = '';
      revealNav.style.filter     = '';
      revealNav.style.transform  = '';
    }
    if (revealBeam) revealBeam.remove();
  }

  var introDone = false;
  function finishIntro() {
    if (introDone) return;
    introDone = true;
    alive      = false;
    timerAlive = false;
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', handleResize);
    document.documentElement.classList.remove('intro-active');
    document.body.classList.remove('intro-active');
    if (root.parentNode) root.remove();
    setTimeout(clearPageReveal, 700);
  }

  // -- SEQUENCE (~7.8s total) -----------------------------------

  // T+350: rings + cube fade in
  setTimeout(function() {
    fadeIn(ringProxy, 0, 1, 900);
    fadeIn(cubeProxy, 0, 1, 1100);
  }, 350);

  // T+900: DJ mark appears
  setTimeout(function() { djw.classList.add('is-in'); }, 900);

  // T+1320: Create appears
  setTimeout(function() {
    crw.classList.add('is-in');
    idiv.classList.add('is-in');
  }, 1320);

  // T+1900: shimmer line
  setTimeout(function() { shm.classList.add('is-run'); }, 1900);

  // T+2260: lock-on pulse + wordmark light scan
  setTimeout(function() {
    lockPulse = 1;
    root.classList.add('is-lock');
    wmw.classList.add('is-scan');
    setTimeout(function() { root.classList.remove('is-lock'); }, 700);
    setTimeout(function() { wmw.classList.remove('is-scan'); }, 1400);
  }, 2260);

  // T+2700: subtitle typewriter
  setTimeout(function() {
    sub.classList.add('is-in');
    status.classList.add('is-in');
    var text = 'ESTUDIO DE DISEÑO WEB · MURCIA';
    sub.textContent = '';
    text.split('').forEach(function(ch, i) {
      setTimeout(function() { sub.textContent += ch; }, i * 32);
    });
  }, 2700);

  // T+3260: loading bar appears
  setTimeout(function() { load.classList.add('is-in'); }, 3260);

  // T+3500: progress bar fills + percentage counter
  setTimeout(function() {
    pfill.style.transition = 'width 1.2s cubic-bezier(.25,.46,.45,.94)';
    pfill.style.width      = '100%';
    var pctEl    = document.getElementById('ipct');
    var pctStart = performance.now();
    var pctDur   = 1200;
    (function animPct() {
      var t     = Math.min(1, (performance.now() - pctStart) / pctDur);
      var eased = t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
      if (pctEl) pctEl.textContent = Math.round(eased * 100) + '%';
      if (t < 1) requestAnimationFrame(animPct);
      else if (pctEl) pctEl.textContent = '100%';
    })();
  }, 3500);

  // T+4900: stage collapses into the lens
  setTimeout(function() {
    root.classList.add('is-arming');
    stage.style.transition = 'opacity .85s cubic-bezier(.25,.46,.45,.94), transform .95s cubic-bezier(.16,1,.3,1), filter .95s cubic-bezier(.16,1,.3,1)';
    stage.style.opacity    = '0';
    stage.style.transform  = 'translate(-50%, -50%) scale(.92)';
    stage.style.filter     = 'blur(18px) brightness(1.35)';
    fadeIn(ringProxy, ringA, 0, 1000);
    fadeIn(cubeProxy, cubeAlpha, 0, 800);
    root.querySelectorAll('.ib, .ico, .itks').forEach(function(e) {
      e.style.transition = 'opacity .8s ease';
      e.style.opacity    = '0';
    });
  }, 4900);

  // T+5400: prepare page under the loader
  setTimeout(function() { preparePageReveal(); }, 5400);

  // T+5750: cinematic bloom
  setTimeout(function() { root.classList.add('is-revealing'); }, 5750);

  // T+6100: flash
  setTimeout(function() {
    var flash = document.createElement('div');
    flash.className = 'iflash';
    root.appendChild(flash);
    setTimeout(function() { flash.remove(); }, 700);
  }, 6100);

  // T+6320: aperture opens and the first page takes focus
  setTimeout(function() {
    var shock1 = document.createElement('div');
    shock1.className = 'ishock';
    root.appendChild(shock1);
    var shock2 = document.createElement('div');
    shock2.className = 'ishock ishock--late';
    root.appendChild(shock2);
    root.classList.add('is-opening');
    setTimeout(function() { shock1.remove(); shock2.remove(); }, 1800);
    root.addEventListener('animationend', function onIntroExit(evt) {
      if (evt.target === root && evt.animationName === 'dji-exit') {
        root.removeEventListener('animationend', onIntroExit);
        finishIntro();
      }
    });
    root.classList.add('is-out');
    setTimeout(finishIntro, 1900);
  }, 6320);

})();
