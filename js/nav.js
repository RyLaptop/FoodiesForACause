// Foodies For A Cause - shared nav + interaction behavior
document.addEventListener('DOMContentLoaded', function () {
  var mobileToggle = document.querySelector('.nav-toggle-mobile');
  var navList = document.querySelector('nav ul');

  if (mobileToggle && navList) {
    mobileToggle.addEventListener('click', function () {
      navList.classList.toggle('open');
    });
  }

  // Dropdown itself is native <details>/<summary> and needs no JS to open/close.
  // This just closes it automatically when you click elsewhere on the page.
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.has-dropdown details[open]').forEach(function (d) {
      if (!d.contains(e.target)) d.removeAttribute('open');
    });
  });

  // Sticky header solidifies once the page scrolls under it.
  var header = document.querySelector('.site-header');
  if (header) {
    var setScrolled = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  // Staggered fade-in for pinned cards / event rows as they enter view.
  var revealTargets = document.querySelectorAll('.card, .officer-card, .event-row');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (revealTargets.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    revealTargets.forEach(function (el) { el.classList.add('reveal-fade'); });

    var groups = new Map();
    revealTargets.forEach(function (el) {
      var parent = el.parentElement;
      var index = groups.has(parent) ? groups.get(parent) : 0;
      el.style.transitionDelay = Math.min(index * 70, 350) + 'ms';
      groups.set(parent, index + 1);
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el) { observer.observe(el); });
  }
});
