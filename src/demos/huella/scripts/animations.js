/**
 * Huella — lightweight progressive reveal and motion
 * Uses IntersectionObserver and CSS. No heavy libraries.
 */

(function () {
  // Mark JS as enabled
  document.documentElement.classList.add('js-enabled');

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function initReveals() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-rotate, .reveal-scale');

    if (motionQuery.matches) {
      revealElements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  function initMarqueePause() {
    const marquees = document.querySelectorAll('.marquee');
    marquees.forEach((marquee) => {
      marquee.addEventListener('mouseenter', () => marquee.classList.add('is-paused'));
      marquee.addEventListener('mouseleave', () => marquee.classList.remove('is-paused'));
    });
  }

  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let ticking = false;

    function updateHeader() {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 60) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (ticking || motionQuery.matches) return;
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      },
      { passive: true }
    );

    updateHeader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initReveals();
      initMarqueePause();
      initHeaderScroll();
    });
  } else {
    initReveals();
    initMarqueePause();
    initHeaderScroll();
  }
})();
