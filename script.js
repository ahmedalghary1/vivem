const root = document.documentElement;
const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const langButtons = document.querySelectorAll("[data-set-lang]");
const faqButtons = document.querySelectorAll(".faq-question");
const revealItems = document.querySelectorAll(".reveal");
const yearNode = document.getElementById("year");
const langEnNodes = document.querySelectorAll(".lang-en");
const langArNodes = document.querySelectorAll(".lang-ar");

const STRINGS = {
  en: {
    title: "VIVEM | Premium Global Marketing Agency & Strategic Consultancy",
    dir: "ltr"
  },
  ar: {
    title: "VIVEM | وكالة تسويق عالمية واستشارات استراتيجية راقية",
    dir: "rtl"
  }
};

const setLanguage = (lang) => {
  const selected = STRINGS[lang] ? lang : "en";
  const { dir, title } = STRINGS[selected];

  root.lang = selected;
  root.dir = dir;
  root.dataset.lang = selected;
  document.title = title;

  if (navToggle) {
    navToggle.setAttribute("aria-label", selected === "ar" ? "فتح القائمة" : "Toggle navigation");
  }

  if (nav) {
    nav.setAttribute("aria-label", selected === "ar" ? "التنقل الرئيسي" : "Primary");
  }

  langButtons.forEach((button) => {
    const isActive = button.dataset.setLang === selected;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  try {
    localStorage.setItem("vivem-lang", selected);
  } catch (error) {
    // Storage can fail in restricted contexts; the UI still works without persistence.
  }
};

const annotateLanguageNodes = () => {
  langEnNodes.forEach((node) => node.setAttribute("lang", "en"));
  langArNodes.forEach((node) => node.setAttribute("lang", "ar"));
};

const closeMenu = () => {
  header.classList.remove("is-open");
  body.classList.remove("menu-open");
  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
  }
};

const toggleHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-solid", window.scrollY > 16);
};

const initLanguage = () => {
  let preferred = "en";

  try {
    preferred = localStorage.getItem("vivem-lang") || preferred;
  } catch (error) {
    preferred = "en";
  }

  setLanguage(preferred);
};

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    body.classList.toggle("menu-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof Element)) return;

  const langTrigger = target.closest("[data-set-lang]");
  if (langTrigger) {
    setLanguage(langTrigger.dataset.setLang);
  }

  if (target.closest(".site-nav a")) {
    closeMenu();
  }

  if (header && !target.closest(".site-header") && header.classList.contains("is-open")) {
    closeMenu();
  }
});

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;
    const expanded = button.getAttribute("aria-expanded") === "true";

    faqButtons.forEach((otherButton) => {
      const otherAnswer = otherButton.nextElementSibling;
      otherButton.setAttribute("aria-expanded", "false");
      if (otherAnswer instanceof HTMLElement) {
        otherAnswer.hidden = true;
      }
    });

    button.setAttribute("aria-expanded", String(!expanded));
    if (answer instanceof HTMLElement) {
      answer.hidden = expanded;
    }
  });
});

if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

window.addEventListener("scroll", toggleHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    closeMenu();
  }
});

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

annotateLanguageNodes();
initLanguage();
toggleHeaderState();
