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
})();
