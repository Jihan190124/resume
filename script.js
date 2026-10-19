(() => {
  'use strict';
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());
  const nav = document.getElementById('nav');
  if (nav && window.bootstrap) {
    const collapse = bootstrap.Collapse.getOrCreateInstance(nav, { toggle: false });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      if (window.innerWidth < 992 && nav.classList.contains('show')) collapse.hide();
    }));
  }
  const links = [...document.querySelectorAll('.topbar .nav-link')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const topButton = document.getElementById('toTop');
  let scheduled = false;
  const update = () => {
    topButton?.classList.toggle('visible', window.scrollY > 400);
    let current = null;
    sections.forEach(section => { if (section.getBoundingClientRect().top < 150) current = section; });
    if (current) links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current.id}`));
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) { requestAnimationFrame(update); scheduled = true; }
  }, { passive: true });
  topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  update();
})();
