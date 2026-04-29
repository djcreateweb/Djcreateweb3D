// ── NAV SCROLLED STATE ─────────────────────────────────────
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 60);
}, { passive: true });

// ── SMOOTH SCROLL PARA ANCLAS ──────────────────────────────
document.querySelectorAll('a[data-scroll]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── REVEAL ON SCROLL ───────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── AÑO ACTUAL EN FOOTER ───────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── FORM CONTACTO ──────────────────────────────────────────
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    feedback.classList.remove('error');
    feedback.textContent = '';

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      feedback.classList.add('error');
      feedback.textContent = 'Rellena todos los campos antes de enviar.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      feedback.classList.add('error');
      feedback.textContent = 'El email no es válido.';
      return;
    }

    // En producción aquí iría el fetch al backend / formspree / etc.
    feedback.textContent = '¡Mensaje enviado! Responderemos en menos de 24h.';
    form.reset();
  });
}
