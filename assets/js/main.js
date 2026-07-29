// -----------------------------------------------------------------------
// Set this to your actual demo video (YouTube/Vimeo embed URL, or leave
// empty to show a placeholder reminding you to add one).
// e.g. "https://www.youtube.com/embed/VIDEO_ID"
// -----------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  initScrollReveal();
  initThemeToggle();
  initDemoModal();
  initSmoothAnchors();
  initMobileNav();
});

initForceScrollTop();

// -----------------------------------------------------------------------
// 0) Always land at the top of the page on load/reload, regardless of any
//    #hash in the URL. The browser can resolve/perform its own scroll to
//    a matching section anywhere up through full page load (e.g. once the
//    logo image finishes loading and shifts layout) — tying this to
//    DOMContentLoaded fires too early and can lose that race. Waiting for
//    the full 'load' event, then two animation frames on top, reliably
//    puts our correction after the browser's own scroll-to-fragment step.
// -----------------------------------------------------------------------
function initForceScrollTop() {
  window.addEventListener("load", function () {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        window.scrollTo(0, 0);
      });
    });
  });
}

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

  // Check sessionStorage first (this tab's manual override, if any),
  // otherwise fall back to time-based check (e.g., night after 19:00)
  var savedTheme;
  try { savedTheme = sessionStorage.getItem("lastnote-theme"); } catch (e) {}

  if (!savedTheme) {
    var currentHour = new Date().getHours();
    // Night mode if before 6 AM or after 19:00 (7 PM)
    savedTheme = (currentHour < 6 || currentHour >= 19) ? "night" : "day";
  }

  html.setAttribute("data-theme", savedTheme);
  applyMetaColor(savedTheme);

  toggle.addEventListener("click", function () {
    var current = html.getAttribute("data-theme") === "night" ? "night" : "day";
    var next = current === "night" ? "day" : "night";
    html.setAttribute("data-theme", next);
    applyMetaColor(next);
    try { sessionStorage.setItem("lastnote-theme", next); } catch (e) {}
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
      // Grab the video URL dynamically from the clicked button's data attribute
      var demoVideoUrl = btn.getAttribute("data-video-url");
      if (modal) openModal(modal, demoVideoUrl);
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

  function openModal(modal, videoUrl) {
    lastFocused = document.activeElement;

    var videoHost = modal.querySelector(".modal__video");
    if (videoHost) {
      // Check if the URL exists and isn't just an empty string or placeholder
      if (videoUrl && videoUrl.trim() !== "") {
        videoHost.innerHTML =
          '<iframe src="' + videoUrl + '" title="LastNote demo" ' +
          'frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" ' +
          'allowfullscreen></iframe>';
      } else {
        videoHost.innerHTML =
          '<div class="modal__placeholder">' +
          '<p><strong>No demo video set yet.</strong></p>' +
          '<p>Add your video URL to <code>demo_video_url</code> in ' +
          '<code>_config.yml</code>.</p>' +
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

// -----------------------------------------------------------------------
// 4) Mobile hamburger nav — toggles the dropdown panel, closes on link
//    click, outside click, or Escape.
// -----------------------------------------------------------------------
function initMobileNav() {
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  function closeNav() {
    nav.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function openNav() {
    nav.classList.add("is-open");
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    var isOpen = nav.classList.contains("is-open");
    if (isOpen) closeNav(); else openNav();
  });

  // Close after picking a link (so it doesn't stay open once you navigate)
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  // Close on outside click
  document.addEventListener("click", function (e) {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    closeNav();
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) closeNav();
  });

  // Close automatically if the viewport is resized back to desktop width
  window.addEventListener("resize", function () {
    if (window.innerWidth > 640 && nav.classList.contains("is-open")) closeNav();
  });
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;
      
      var targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth" });
        // Keep URL clean so future reloads won't trigger fragment memories
        window.history.replaceState("", document.title, window.location.pathname + window.location.search);
      }
    });
  });
}