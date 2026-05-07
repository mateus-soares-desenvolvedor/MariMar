document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    const closeMenu = () => {
      mainNav.classList.remove("active");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      document.body.classList.remove("menu-open");
    };

    const openMenu = () => {
      mainNav.classList.add("active");
      menuToggle.classList.add("active");
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Fechar menu");
      document.body.classList.add("menu-open");
    };

    menuToggle.addEventListener("click", () => {
      if (mainNav.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      const clickedMenu = mainNav.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);
      if (!clickedMenu && !clickedToggle) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });

    window.addEventListener("hashchange", closeMenu);
  }

  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  initMiniCarousel("carousel-cabelos");
  initMiniCarousel("carousel-skincare");
});

function initMiniCarousel(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".mini-carousel-slide"));
  const dots = Array.from(carousel.querySelectorAll(".mini-carousel-dot"));
  const prevButton = carousel.querySelector(".mini-carousel-prev");
  const nextButton = carousel.querySelector(".mini-carousel-next");
  let current = 0;
  let autoplayId = null;

  if (!slides.length) return;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === current);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === current);
    });
  };

  const stopAutoplay = () => {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayId = window.setInterval(() => showSlide(current + 1), 5000);
  };

  prevButton?.addEventListener("click", () => {
    showSlide(current - 1);
    startAutoplay();
  });

  nextButton?.addEventListener("click", () => {
    showSlide(current + 1);
    startAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startAutoplay();
    });
  });

  let startX = 0;

  carousel.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  carousel.addEventListener("touchend", (event) => {
    const endX = event.changedTouches[0].clientX;
    const distance = endX - startX;

    if (Math.abs(distance) > 48) {
      showSlide(distance < 0 ? current + 1 : current - 1);
    }

    startAutoplay();
  }, { passive: true });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  showSlide(0);
  startAutoplay();
}
