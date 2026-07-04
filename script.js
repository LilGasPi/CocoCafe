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

  const instaGrid = document.getElementById('instaGrid');
  const instaDots = document.getElementById('instaDots');
  const instaPrev = document.getElementById('instaPrev');
  const instaNext = document.getElementById('instaNext');
  if (instaGrid && instaDots) {
    const items = Array.from(instaGrid.querySelectorAll('.insta-embed'));
    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Ir al video ${i + 1}`);
      dot.addEventListener('click', () => {
        items[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      instaDots.appendChild(dot);
    });
    const dots = Array.from(instaDots.querySelectorAll('.dot'));

    const setActiveByScroll = () => {
      const gridLeft = instaGrid.scrollLeft;
      let closest = 0;
      let minDist = Infinity;
      items.forEach((item, i) => {
        const dist = Math.abs(item.offsetLeft - gridLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === closest));
    };
    instaGrid.addEventListener('scroll', () => {
      window.requestAnimationFrame(setActiveByScroll);
    }, { passive: true });

    const scrollByItem = (dir) => {
      const item = items[0];
      const gap = 14;
      const amount = (item.getBoundingClientRect().width + gap) * dir;
      instaGrid.scrollBy({ left: amount, behavior: 'smooth' });
    };
    if (instaPrev) instaPrev.addEventListener('click', () => scrollByItem(-1));
    if (instaNext) instaNext.addEventListener('click', () => scrollByItem(1));
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