// Foodies For A Cause - shared nav behavior
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
});
