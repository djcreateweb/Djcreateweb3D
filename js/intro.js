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

  function letters(text) {
    return text.split('').map(function (char, index) {
      return el('span', {
        className: 'intro-letter',
        style: '--letter-delay:' + (index * 54) + 'ms',
        text: char
      });
    });
  }

  var root = el('div', {
    id: 'dj-intro',
    role: 'presentation',
    'aria-hidden': 'true'
  });

  var scene = el('div', { className: 'intro-bg-scene' }, [
    el('span', { className: 'intro-plane intro-plane--one' }),
    el('span', { className: 'intro-plane intro-plane--two' }),
    el('span', { className: 'intro-plane intro-plane--three' }),
    el('span', { className: 'intro-plane intro-plane--four' })
  ]);

  var panel = el('section', { className: 'intro-panel' }, [
    el('span', { className: 'intro-panel-shine' }),
    el('div', { className: 'intro-wordmark', 'aria-label': 'DJ Create' }, [
      el('span', { className: 'intro-dj', text: 'DJ' }),
      el('span', { className: 'intro-create' }, letters('Create'))
    ]),
    el('p', { className: 'intro-services', text: 'DISEÑO • DESARROLLO • EXPERIENCIA' }),
    el('p', { className: 'intro-location', text: 'Estudio de diseño Web - Murcia' }),
    el('p', { className: 'intro-kicker', text: 'PREPARANDO EXPERIENCIA' }),
    el('div', { className: 'intro-loader' }, [
      el('p', { className: 'intro-load-text', id: 'introLoadText', text: 'CARGANDO... 0%' }),
      el('div', { className: 'intro-progress' }, [
        el('span', { className: 'intro-progress-fill', id: 'introProgressFill' }),
        el('span', { className: 'intro-progress-tip', id: 'introProgressTip' })
      ])
    ])
  ]);

  var curtains = el('div', { className: 'intro-curtains', 'aria-hidden': 'true' }, [
    el('span', { className: 'intro-curtain intro-curtain--left' }),
    el('span', { className: 'intro-curtain intro-curtain--right' })
  ]);

  root.appendChild(scene);
  root.appendChild(panel);
  root.appendChild(curtains);
  document.body.prepend(root);

  document.documentElement.classList.add('intro-active');
  document.body.classList.add('intro-active');
  window.scrollTo(0, 0);

  var progressFill = document.getElementById('introProgressFill');
  var progressTip = document.getElementById('introProgressTip');
  var loadText = document.getElementById('introLoadText');
  var progressRaf = 0;
  var finished = false;

  function startProgress() {
    var start = performance.now();
    var duration = 1000;
    root.classList.add('is-loading');

    function frame(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      var pct = Math.round(eased * 100);

      if (progressFill) progressFill.style.width = pct + '%';
      if (progressTip) progressTip.style.left = pct + '%';
      if (loadText) loadText.textContent = 'CARGANDO... ' + pct + '%';

      if (t < 1) {
        progressRaf = requestAnimationFrame(frame);
      } else if (loadText) {
        loadText.textContent = 'CARGANDO... 100%';
      }
    }

    progressRaf = requestAnimationFrame(frame);
  }

  function finishIntro() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(progressRaf);
    document.documentElement.classList.remove('intro-active');
    document.body.classList.remove('intro-active');
    root.remove();
  }

  setTimeout(function () {
    root.classList.add('is-panel-in');
  }, 1000);

  setTimeout(function () {
    root.classList.add('is-logo-dj');
  }, 1120);

  setTimeout(function () {
    root.classList.add('is-logo-create');
  }, 1360);

  setTimeout(function () {
    root.classList.add('is-copy-in');
  }, 1640);

  setTimeout(startProgress, 2000);

  setTimeout(function () {
    root.classList.add('is-copy-out');
  }, 3000);

  setTimeout(function () {
    root.classList.add('is-panel-out');
  }, 3350);

  setTimeout(function () {
    root.classList.add('is-curtain-open');
  }, 4000);

  setTimeout(finishIntro, 5250);
})();
