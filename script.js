document.addEventListener('DOMContentLoaded', () => {

  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth' }); }
    });
  });

  const menuHolder = document.querySelector('.menu-frame-holder');
  const menuIframe = document.getElementById('menuIframe');
  if (menuIframe && menuHolder) {
    const menuTimeout = setTimeout(() => { menuHolder.classList.add('blocked'); }, 3500);
    menuIframe.addEventListener('load', () => { clearTimeout(menuTimeout); });
    menuIframe.addEventListener('error', () => { menuHolder.classList.add('blocked'); });
  }

});