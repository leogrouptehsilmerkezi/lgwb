const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

mainNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.faq-list details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.faq-list details[open]').forEach(other => {
      if (other !== detail) other.removeAttribute('open');
    });
  });
});

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();
/* ==============================
   INSTAGRAM POST CAROUSEL
============================== */

document.querySelectorAll(".post-carousel").forEach((carousel) => {

  const postTrack = carousel.querySelector(".post-track");
  const postCards = carousel.querySelectorAll(".post-card");
  const postPrev = carousel.querySelector(".post-prev");
  const postNext = carousel.querySelector(".post-next");

  // Dot-ları həmin carousel-in yerləşdiyi section-dan götürürük
  const section = carousel.closest(".section");

  const postDots = section
    ? section.querySelectorAll(".post-dot")
    : [];

  let postIndex = 0;


  function getVisiblePosts() {

    if (window.innerWidth <= 600) {
      return 1;
    }

    if (window.innerWidth <= 900) {
      return 2;
    }

    return 3;
  }


  function updatePostCarousel() {

    if (!postTrack || !postCards.length) return;

    const visible = getVisiblePosts();

    const maxIndex = Math.max(
      0,
      postCards.length - visible
    );

    if (postIndex > maxIndex) {
      postIndex = maxIndex;
    }

    const cardWidth = postCards[0].offsetWidth;
    const gap = 20;

    postTrack.style.transform =
      `translateX(-${postIndex * (cardWidth + gap)}px)`;


    postDots.forEach((dot, index) => {

      dot.classList.toggle(
        "active",
        index === postIndex
      );

    });

  }


  // NÖVBƏTİ
  postNext?.addEventListener("click", () => {

    const visible = getVisiblePosts();

    const maxIndex = Math.max(
      0,
      postCards.length - visible
    );

    if (postIndex < maxIndex) {
      postIndex++;
    } else {
      postIndex = 0;
    }

    updatePostCarousel();

  });


  // ƏVVƏLKİ
  postPrev?.addEventListener("click", () => {

    const visible = getVisiblePosts();

    const maxIndex = Math.max(
      0,
      postCards.length - visible
    );

    if (postIndex > 0) {
      postIndex--;
    } else {
      postIndex = maxIndex;
    }

    updatePostCarousel();

  });


  // DOT-LAR
  postDots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

      const visible = getVisiblePosts();

      const maxIndex = Math.max(
        0,
        postCards.length - visible
      );

      postIndex = Math.min(index, maxIndex);

      updatePostCarousel();

    });

  });


  window.addEventListener(
    "resize",
    updatePostCarousel
  );


  updatePostCarousel();

});
/* HERO STATS COUNTER
   Yalnız .hero-stats daxilində işləyir
*/

(function () {

  const stats = document.querySelector('.hero-stats');

  if (!stats) return;

  const numbers = stats.querySelectorAll('strong');

  let started = false;

  function startCounters() {

    if (started) return;

    started = true;

    numbers.forEach(function (element) {

      const original = element.textContent.trim();

      // 100+, 100%, 0 ₼ kimi yazılardan rəqəmi götürürük
      const match = original.match(/\d+/);

      if (!match) return;

      const target = parseInt(match[0], 10);

      // Rəqəmdən sonrakı hissə: +, %, ₼ və s.
      const suffix = original.substring(match[0].length);

      // 0 ₼ olduğu kimi qalsın
      if (target === 0) {
        element.textContent = original;
        return;
      }

      const duration = 1600;
      const start = performance.now();

      function animate(time) {

        const progress = Math.min(
          (time - start) / duration,
          1
        );

        // Smooth animation
        const ease = 1 - Math.pow(1 - progress, 3);

        const value = Math.floor(target * ease);

        element.textContent = value + suffix;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = target + suffix;
        }
      }

      requestAnimationFrame(animate);

    });
  }

  // Yalnız hero-stats göründükdə başlasın
  const observer = new IntersectionObserver(
    function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {
          startCounters();
          observer.disconnect();
        }

      });

    },
    {
      threshold: 0.3
    }
  );

  observer.observe(stats);

})();