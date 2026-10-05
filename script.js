document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuToggle && mobileMenu) {
    const closeMenu = () => { mobileMenu.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); };
    menuToggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('.favorites, .price-section, .coupons, .promotions, .location, .gallery-row');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  } else {
    revealTargets.forEach((target) => target.classList.add('reveal-on-scroll'));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    revealTargets.forEach((target) => revealObserver.observe(target));
  }

  document.querySelectorAll('.gallery-row').forEach((row) => {
    const strip = row.querySelector('.gallery-strip');
    const photos = [...strip.children];
    const dotsWrap = row.querySelector('.gallery-dots');
    const prevBtn = row.querySelector('.gallery-prev');
    const nextBtn = row.querySelector('.gallery-next');

    photos.forEach((_, index) => {
      const dot = document.createElement('span');
      if (index === 0) dot.classList.add('active');
      dotsWrap.append(dot);
    });
    const dots = [...dotsWrap.children];

    let activeIndex = 0;
    const setActive = (index) => {
      activeIndex = index;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === photos.length - 1;
    };
    setActive(0);

    if ('IntersectionObserver' in window) {
      const stripObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) setActive(photos.indexOf(entry.target));
        });
      }, { root: strip, threshold: [0.6] });
      photos.forEach((photo) => stripObserver.observe(photo));
    }

    const scrollToIndex = (index) => {
      const clamped = Math.max(0, Math.min(photos.length - 1, index));
      photos[clamped].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    };
    prevBtn.addEventListener('click', () => scrollToIndex(activeIndex - 1));
    nextBtn.addEventListener('click', () => scrollToIndex(activeIndex + 1));

    strip.setAttribute('tabindex', '0');
    strip.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { scrollToIndex(activeIndex + 1); event.preventDefault(); }
      if (event.key === 'ArrowLeft') { scrollToIndex(activeIndex - 1); event.preventDefault(); }
    });
  });
});
