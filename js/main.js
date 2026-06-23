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
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);

  const setNavOpen = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-visible', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  };

  const closeNav = () => setNavOpen(false);

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      setNavOpen(!nav.classList.contains('is-open'));
    });

    backdrop.addEventListener('click', closeNav);

    nav.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 768px)').matches) closeNav();
      });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  const sections = [...navLinks]
    .map((link) => {
      const id = link.getAttribute('href').slice(1);
      const section = document.getElementById(id);
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (sections.length) {
    const setActiveNav = () => {
      const scrollY = window.scrollY + (header?.offsetHeight ?? 0) + 48;
      let current = null;

      sections.forEach(({ link, section }) => {
        if (section.offsetTop <= scrollY) current = link;
      });

      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link === current);
      });
    };

    window.addEventListener('scroll', setActiveNav, { passive: true });
    setActiveNav();
  }

  const revealSelector =
    '.section-head, .about-layout, .timeline-item, .projects-subtitle, .project-card, .skill-blob, .contact-chips, .contact-form';

  const revealables = document.querySelectorAll(revealSelector);
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

  const form = document.querySelector('.contact-form');
  const formStatus = document.getElementById('form-status');
  const formAction = form?.getAttribute('action')?.trim() ?? '';

  const setFormStatus = (message, type) => {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.classList.remove('is-success', 'is-error');
    if (type) formStatus.classList.add(type);
  };

  form?.addEventListener('submit', async (e) => {
    if (!formAction || formAction === '#') return;
    e.preventDefault();
    setFormStatus('Sending…', null);

    const fd = new FormData(form);
    try {
      const res = await fetch(formAction, {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        form.reset();
        setFormStatus('Message sent!', 'is-success');
      } else {
        setFormStatus('Could not send. Try email instead.', 'is-error');
      }
    } catch {
      setFormStatus('Network error.', 'is-error');
    }
  });
})();
