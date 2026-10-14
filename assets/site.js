(function () {
  var root = document.documentElement;
  var status = document.getElementById("view-status");
  var main = document.getElementById("top-content");
  var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Playground name: rename here, in the [data-play-name] elements of index.html (heading + nav). */
  var PLAY_NAME = "Playground";
  document.querySelectorAll("[data-play-name]").forEach(function (el) { el.textContent = PLAY_NAME; });

  /* ---------- Minimal / Expanded ---------- */
  var seg = document.querySelectorAll(".seg [data-view-btn]");
  function setView(v, announce) {
    root.setAttribute("data-view", v);
    seg.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-view-btn") === v)); });
    try { localStorage.setItem("zg-view", v); } catch (e) {}
    if (announce && status) status.textContent = (v === "minimal" ? "Minimal" : "Expanded") + " view";
  }
  function goto(id) {
    var el = id && document.getElementById(id);
    if (!el) { window.scrollTo(0, 0); return; }
    el.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
  seg.forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-view-btn");
      if (root.getAttribute("data-view") === v) return;
      setView(v, true);
      window.scrollTo(0, 0);
      if (main) main.focus({ preventScroll: true });
    });
  });
  var hasViews = !!document.getElementById("view-minimal");
  if (hasViews) setView(root.getAttribute("data-view") || "minimal", false);

  document.querySelectorAll("[data-goto]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var id = a.getAttribute("href").slice(1);
      setView("expanded", true);
      requestAnimationFrame(function () { goto(id); });
    });
  });
  window.addEventListener("hashchange", function () {
    var id = location.hash.slice(1);
    var el = id && document.getElementById(id);
    if (el && el.offsetParent === null && root.getAttribute("data-view") === "minimal") {
      setView("expanded", true);
      requestAnimationFrame(function () { goto(id); });
    }
  });
  if (location.hash.length > 1 && root.getAttribute("data-view") === "expanded") {
    var h0 = location.hash.slice(1);
    window.addEventListener("load", function () { goto(h0); });
  }

  /* ---------- theme ---------- */
  var tbtn = document.querySelector(".theme-btn");
  if (tbtn) tbtn.addEventListener("click", function () {
    var cur = root.getAttribute("data-theme") ||
      (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("zg-theme", next); } catch (e) {}
  });

  /* ---------- scroll reveal + active nav (Expanded) ---------- */
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
    document.querySelectorAll(".view-expanded section[id]").forEach(function (s) { so.observe(s); });
  } else {
    document.querySelectorAll(".rv").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- project cards: spotlight + gentle tilt (fine pointers, no reduced motion) ---------- */
  var fine = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
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

  /* ---------- Playground: hide "coming soon" tiles once real items exist; filter chips ---------- */
  (function () {
    var grid = document.querySelector(".play-grid");
    if (!grid) return;
    var real = grid.querySelectorAll(".play-item");
    var kinds = {};
    real.forEach(function (it) { kinds[it.getAttribute("data-kind")] = true; });
    grid.querySelectorAll(".play-soon").forEach(function (t) { if (kinds[t.getAttribute("data-kind")]) t.hidden = true; });
    var bar = document.querySelector(".play-filter");
    if (!bar || !(kinds.game && kinds.video)) return;
    bar.hidden = false;
    bar.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        var f = b.getAttribute("data-filter");
        bar.querySelectorAll("button").forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        real.forEach(function (it) { it.hidden = !(f === "all" || it.getAttribute("data-kind") === f); });
      });
    });
  })();

  /* ---------- Publications archive: search, topic chips, summaries, live count ---------- */
  (function () {
    var bar = document.getElementById("a-controls");
    if (!bar) return;
    bar.hidden = false;
    var items = [].slice.call(document.querySelectorAll(".a-item"));
    var q = document.getElementById("a-q"), sum = document.getElementById("a-sum");
    var count = document.getElementById("a-count"), empty = document.getElementById("a-empty");
    var chips = [].slice.call(bar.querySelectorAll("[data-topic]"));
    var total = items.length, topic = "";
    function apply() {
      var term = q.value.trim().toLowerCase(), n = 0;
      items.forEach(function (it) {
        var ok = (!topic || it.getAttribute("data-topics").split("|").indexOf(topic) > -1) &&
                 (!term || it.getAttribute("data-search").indexOf(term) > -1);
        it.hidden = !ok; if (ok) n++;
      });
      [].forEach.call(document.querySelectorAll("[data-group]"), function (g) { g.hidden = !g.querySelector(".a-item:not([hidden])"); });
      [].forEach.call(document.querySelectorAll("[data-section]"), function (g) { g.hidden = !g.querySelector(".a-item:not([hidden])"); });
      count.textContent = (n === total ? total + " publications" : n + " of " + total + " publications");
      empty.hidden = n !== 0;
    }
    q.addEventListener("input", apply);
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        var t = c.getAttribute("data-topic");
        topic = topic === t ? "" : t;
        chips.forEach(function (o) { o.setAttribute("aria-pressed", String(o.getAttribute("data-topic") === topic)); });
        apply();
      });
    });
    sum.addEventListener("change", function () { root.classList.toggle("show-sum", sum.checked); });
    apply();
  })();
})();
