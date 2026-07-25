// -----------------------------------------------------------------------
// Set this to your actual demo video (YouTube/Vimeo embed URL, or leave
// empty to show a placeholder reminding you to add one).
// e.g. "https://www.youtube.com/embed/VIDEO_ID"
// -----------------------------------------------------------------------
var DEMO_VIDEO_URL = "";

document.addEventListener("DOMContentLoaded", function () {
  initScrollReveal();
  initThemeToggle();
  initDemoModal();
});

// -----------------------------------------------------------------------
// 1) Scroll reveal — sections/cards fade + slide in the first time they
//    enter the viewport. Respects prefers-reduced-motion.
// -----------------------------------------------------------------------
function initScrollReveal() {
  var items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach(function (el) { observer.observe(el); });
}

// -----------------------------------------------------------------------
// 2) Day / night theme — automatic by local time, with a manual toggle
//    that overrides it (saved in localStorage).
// -----------------------------------------------------------------------
function initThemeToggle() {
  var toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  var html = document.documentElement;
  var themeColors = { day: "#FCE2EA", night: "#7B68A6" };

  function applyMetaColor(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", themeColors[theme] || themeColors.day);
  }

  // Sync the theme-color meta tag with whatever theme the head script set.
  applyMetaColor(html.getAttribute("data-theme") || "day");

  toggle.addEventListener("click", function () {
    var current = html.getAttribute("data-theme") === "night" ? "night" : "day";
    var next = current === "night" ? "day" : "night";
    html.setAttribute("data-theme", next);
    applyMetaColor(next);
    try { localStorage.setItem("lastnote-theme", next); } catch (e) {}
  });
}

// -----------------------------------------------------------------------
// 3) Watch demo modal
// -----------------------------------------------------------------------
function initDemoModal() {
  var openButtons = document.querySelectorAll("[data-modal-open]");
  if (!openButtons.length) return;

  var lastFocused = null;

  openButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var modal = document.getElementById(btn.getAttribute("data-modal-open"));
      if (modal) openModal(modal);
    });
  });

  document.querySelectorAll(".modal").forEach(function (modal) {
    modal.querySelectorAll("[data-modal-close]").forEach(function (el) {
      el.addEventListener("click", function () { closeModal(modal); });
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var openModalEl = document.querySelector(".modal.is-open");
      if (openModalEl) closeModal(openModalEl);
    }
  });

  function openModal(modal) {
    lastFocused = document.activeElement;

    var videoHost = modal.querySelector(".modal__video");
    if (videoHost) {
      if (DEMO_VIDEO_URL) {
        videoHost.innerHTML =
          '<iframe src="' + DEMO_VIDEO_URL + '" title="LastNote demo" ' +
          'frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" ' +
          'allowfullscreen></iframe>';
      } else {
        videoHost.innerHTML =
          '<div class="modal__placeholder">' +
          '<p><strong>No demo video set yet.</strong></p>' +
          '<p>Add your video URL to <code>DEMO_VIDEO_URL</code> in ' +
          '<code>assets/js/main.js</code>.</p>' +
          "</div>";
      }
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    var closeBtn = modal.querySelector(".modal__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    var videoHost = modal.querySelector(".modal__video");
    if (videoHost) videoHost.innerHTML = ""; // stop playback
    if (lastFocused) lastFocused.focus();
  }
}
