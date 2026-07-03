document.addEventListener('DOMContentLoaded', () => {

  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  const waBtn = document.getElementById('waFloatBtn');
  const waOptions = document.getElementById('waOptions');
  const waWrap = document.getElementById('waFloatWrap');
  if (waBtn && waOptions) {
    waBtn.addEventListener('click', () => {
      const isOpen = waOptions.classList.toggle('open');
      waBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => {
      if (!waWrap.contains(e.target)) {
        waOptions.classList.remove('open');
        waBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

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