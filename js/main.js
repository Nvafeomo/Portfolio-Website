(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const closeNav = () => {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-open', open);
    });

    nav.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 768px)').matches) closeNav();
      });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  const prefersReduced =
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    const revealables = document.querySelectorAll(
      '.section-head, .about-layout, .timeline-item, .projects-subtitle, .project-card, .skill-blob, .contact-chips, .contact-form'
    );
    revealables.forEach((el) => el.classList.add('reveal'));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    revealables.forEach((el) => io.observe(el));
  }

  const form = document.querySelector('.contact-form');
  const formAction = form?.getAttribute('action')?.trim() ?? '';

  form?.addEventListener('submit', async (e) => {
    if (!formAction || formAction === '#') return;
    e.preventDefault();
    const fd = new FormData(form);
    try {
      const res = await fetch(formAction, {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        form.reset();
        alert('Message sent.');
      } else {
        alert('Could not send. Try email instead.');
      }
    } catch {
      alert('Network error.');
    }
  });
})();
