(function () {
  'use strict';

  /* ── Punto de cursor ── */
  var dot = document.createElement('div');
  dot.id  = 'c-dot';
  document.body.appendChild(dot);

  /* ── Canvas para la estela ── */
  var canvas = document.createElement('canvas');
  canvas.id  = 'c-canvas';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ── Estado ── */
  var mx = 0, my = 0;
  var pts = [];            // { x, y, t }
  var LIFE = 420;          // ms que dura cada punto de la estela

  /* ── Primer movimiento: mostrar cursor ── */
  document.addEventListener('mousemove', function show() {
    dot.style.opacity = '1';
    document.removeEventListener('mousemove', show);
  });

  /* ── Mover punto + registrar posición ── */
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    pts.push({ x: mx, y: my, t: Date.now() });
    if (pts.length > 300) pts.shift();
  });

  /* ── Loop de dibujo ── */
  function draw() {
    var now = Date.now();
    pts = pts.filter(function (p) { return now - p.t < LIFE; });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (pts.length > 1) {
      for (var i = 1; i < pts.length; i++) {
        var p0 = pts[i - 1];
        var p1 = pts[i];
        var age   = now - p1.t;
        var ratio = 1 - age / LIFE;          // 1 = reciente (cabeza), 0 = viejo (cola)
        var alpha = ratio * ratio;            // caída cuadrática suave

        /* Color: teal en la cabeza → purple en la cola */
        var r = Math.round(ratio * 0   + (1 - ratio) * 124);
        var g = Math.round(ratio * 245 + (1 - ratio) * 58);
        var b = Math.round(ratio * 212 + (1 - ratio) * 237);
        var col = 'rgba(' + r + ',' + g + ',' + b + ',';

        /* Capa brillante — línea fina */
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = col + alpha + ')';
        ctx.lineWidth   = ratio * 2.5 + 0.4;
        ctx.lineCap     = 'round';
        ctx.stroke();

        /* Capa de glow — línea ancha semitransparente */
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = col + (alpha * 0.28) + ')';
        ctx.lineWidth   = ratio * 14 + 2;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();
