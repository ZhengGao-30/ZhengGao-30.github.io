(function () {
  var root = document.documentElement;
  var btns = document.querySelectorAll("[data-view-btn]");
  var seg = document.querySelectorAll(".seg [data-view-btn]");
  var status = document.getElementById("view-status");

  function setView(v, announce) {
    root.setAttribute("data-view", v);
    seg.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-view-btn") === v)); });
    try { localStorage.setItem("zg-view", v); } catch (e) {}
    if (announce && status) status.textContent = (v === "minimal" ? "Minimal" : "Expanded") + " view";
  }
  btns.forEach(function (b) {
    b.addEventListener("click", function () { setView(b.getAttribute("data-view-btn"), true); });
  });
  setView(root.getAttribute("data-view") || "minimal", false);

  // a link to something hidden in Minimal switches to Expanded
  window.addEventListener("hashchange", function () {
    var el = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
    if (el && el.offsetParent === null && root.getAttribute("data-view") === "minimal") {
      setView("expanded", true); el.scrollIntoView();
    }
  });

  var tbtn = document.querySelector(".theme-btn");
  if (tbtn) tbtn.addEventListener("click", function () {
    var cur = root.getAttribute("data-theme") ||
      (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("zg-theme", next); } catch (e) {}
  });

  var links = {};
  document.querySelectorAll(".site-nav a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".rv").forEach(function (el) { io.observe(el); });

    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var a = links[e.target.id];
        if (!a || !e.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.remove("is-active"); });
        a.classList.add("is-active");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { so.observe(s); });
  } else {
    document.querySelectorAll(".rv").forEach(function (el) { el.classList.add("in"); });
  }

  // project cards: cursor spotlight + gentle tilt (fine pointers only, not with reduced motion)
  var fine = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (fine) document.querySelectorAll("[data-tilt]").forEach(function (card) {
    var glow = card.querySelector(".p-media");
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      if (glow) {
        var g = glow.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - g.left) + "px");
        card.style.setProperty("--my", (e.clientY - g.top) + "px");
      }
      if (!calm) card.style.transform = "perspective(1100px) rotateX(" + ((0.5 - y) * 3.2).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 4.2).toFixed(2) + "deg) translateY(-3px)";
    });
    card.addEventListener("pointerleave", function () { card.style.transform = ""; });
  });
})();
