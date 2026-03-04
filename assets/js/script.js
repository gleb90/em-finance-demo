// #Элементы страницы
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const backToTopBtn = document.querySelector("#backToTop");
const langLinks = document.querySelectorAll(".lang-switch .lang-btn");
const revealTargets = document.querySelectorAll(
  ".section, .mini-card, .about-card, .lead-panel, .contact-card, .map"
);
const langTransitionKey = "emf_lang_transition";
const pageLang = document.documentElement.lang === "kk" ? "kk" : "ru";
const uiText = {
  ru: {
    menuOpen: "Открыть меню",
    menuClose: "Закрыть меню",
  },
  kk: {
    menuOpen: "Мәзірді ашу",
    menuClose: "Мәзірді жабу",
  },
};

// #Слой плавного перехода между RU/KZ
const transitionLayer = document.createElement("div");
transitionLayer.className = "page-transition-layer";
document.body.appendChild(transitionLayer);

if (sessionStorage.getItem(langTransitionKey) === "1") {
  document.body.classList.add("lang-enter");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add("lang-enter-ready");
    });
  });
  window.setTimeout(() => {
    document.body.classList.remove("lang-enter", "lang-enter-ready");
    sessionStorage.removeItem(langTransitionKey);
  }, 340);
}

// #Мобильное меню
if (navToggle && navLinks) {
  navToggle.setAttribute("aria-label", uiText[pageLang].menuOpen);

  const openMenu = () => {
    navLinks.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", uiText[pageLang].menuClose);
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", uiText[pageLang].menuOpen);
    document.body.classList.remove("menu-open");
  };

  navToggle.setAttribute("aria-expanded", "false");
  navToggle.addEventListener("click", () => {
    if (navLinks.classList.contains("open")) {
      closeMenu();
      return;
    }
    openMenu();
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!navLinks.classList.contains("open")) {
      return;
    }
    if (navLinks.contains(event.target) || navToggle.contains(event.target)) {
      return;
    }
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900) {
      closeMenu();
    }
  });
}

// #Плавное переключение языка
if (langLinks.length > 0) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  langLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href) {
        return;
      }
      if (link.getAttribute("aria-current") === "page") {
        event.preventDefault();
        return;
      }
      event.preventDefault();

      if (reduceMotion) {
        window.location.href = href;
        return;
      }

      sessionStorage.setItem(langTransitionKey, "1");
      document.body.classList.add("lang-switching");
      window.setTimeout(() => {
        window.location.href = href;
      }, 220);
    });
  });
}

// #Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// #Кнопка наверх
if (backToTopBtn) {
  const toggleBackToTop = () => {
    if (window.scrollY > 420) {
      backToTopBtn.classList.add("show");
      return;
    }
    backToTopBtn.classList.remove("show");
  };

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  toggleBackToTop();
}

// #Анимации при скролле
if (revealTargets.length > 0) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    revealTargets.forEach((el) => el.classList.add("reveal-item"));

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("in-view"));
  }
}
