/*
  INSTAGRAM: los 5 embeds reales se configuran directamente en index.html,
  en el bloque <div id="instaGrid">. Reemplaza cada
  data-instgrm-permalink="URL_DEL_POST_X" por el link real del post o reel
  (se copia con el botón "···" → Copiar enlace dentro de Instagram).
  El script embed.js de Instagram (cargado al final de esa sección en el HTML)
  se encarga de renderizar la miniatura, el video y el link automáticamente.
*/

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