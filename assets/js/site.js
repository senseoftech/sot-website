/* Sense of Tech — site interactions (vanilla, no dependencies) */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "sot-lang";

  /* ---- Language switcher ------------------------------------------------ */
  function setLang(lang) {
    if (lang !== "fr" && lang !== "en") return;
    root.setAttribute("data-lang", lang);
    root.lang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    // Swap placeholders / values carrying data-fr & data-en attributes.
    document.querySelectorAll("[data-fr][data-en]").forEach(function (el) {
      var val = el.getAttribute("data-" + lang);
      if ("placeholder" in el) el.placeholder = val;
    });
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-set-lang") === lang);
    });
  }

  document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-set-lang"));
    });
  });
  // Sync placeholders with the language chosen before paint.
  setLang(root.getAttribute("data-lang") || "fr");

  /* ---- Sticky header state ---------------------------------------------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ------------------------------------------------------ */
  var toggle = document.querySelector(".nav__toggle");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open);
    });
    header.querySelectorAll(".nav__links a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Scroll reveal ---------------------------------------------------- */
  var revealables = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealables.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Contact form -> mailto (works on a static host, no backend) ------ */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var to = form.getAttribute("data-mailto") || "info@senseof.tech";
      var name = (form.name && form.name.value || "").trim();
      var email = (form.email && form.email.value || "").trim();
      var subject = (form.subject && form.subject.value || "").trim();
      var message = (form.message && form.message.value || "").trim();
      var lang = root.getAttribute("data-lang") || "fr";
      var subjectLine = subject || (lang === "fr" ? "Contact via senseof.tech" : "Contact via senseof.tech");
      var body =
        (name ? name : "") +
        (email ? " <" + email + ">" : "") +
        "\n\n" + message;
      window.location.href =
        "mailto:" + to +
        "?subject=" + encodeURIComponent(subjectLine) +
        "&body=" + encodeURIComponent(body);
    });
  }

  /* ---- Footer year ------------------------------------------------------ */
  var yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
