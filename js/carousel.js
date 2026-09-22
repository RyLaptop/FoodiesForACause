document.querySelectorAll('[data-carousel]').forEach(function (c) {
  var track = c.querySelector('.carousel-track');
  var slides = c.querySelectorAll('.slide');
  var dots = c.querySelector('.carousel-dots');
  var idx = function () { return Math.round(track.scrollLeft / track.clientWidth); };
  var go = function (i) {
    track.scrollTo({ left: Math.max(0, Math.min(slides.length - 1, i)) * track.clientWidth });
  };
  slides.forEach(function (_, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Photo ' + (i + 1));
    b.addEventListener('click', function () { go(i); });
    dots.appendChild(b);
  });
  var sync = function () {
    dots.querySelectorAll('button').forEach(function (b, i) {
      b.setAttribute('aria-current', i === idx() ? 'true' : 'false');
    });
  };
  track.addEventListener('scroll', sync, { passive: true });
  c.querySelector('.prev').addEventListener('click', function () { go(idx() - 1); });
  c.querySelector('.next').addEventListener('click', function () { go(idx() + 1); });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') go(idx() - 1);
    if (e.key === 'ArrowRight') go(idx() + 1);
  });
  sync();
});
