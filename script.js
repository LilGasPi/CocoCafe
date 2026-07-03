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

  const instaVideos = document.querySelectorAll('.insta-embed video');
  instaVideos.forEach(video => {
    const btn = video.nextElementSibling;
    btn.addEventListener('click', () => {
      const willUnmute = video.muted;
      instaVideos.forEach(v => {
        v.muted = true;
        v.nextElementSibling.textContent = '🔇';
        v.nextElementSibling.setAttribute('aria-label', 'Activar sonido');
      });
      if (willUnmute) {
        video.muted = false;
        btn.textContent = '🔊';
        btn.setAttribute('aria-label', 'Silenciar');
      }
    });
  });

});