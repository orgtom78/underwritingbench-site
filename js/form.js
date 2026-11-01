(function () {
  var root = document.getElementById("join-form");
  if (!root) return;
  var frame = root.querySelector(".hs-form-frame");
  var fallback = document.getElementById("form-fallback");
  var started = false;
  var shown = false;

  function showFallback() {
    if (shown) return;
    shown = true;
    if (frame) frame.hidden = true;
    if (fallback) fallback.hidden = false;
  }

  function showForm() {
    shown = true;
    if (frame) frame.hidden = false;
    if (fallback) fallback.hidden = true;
  }

  function watch() {
    var timer = window.setTimeout(showFallback, 8000);
    if (!frame || !("MutationObserver" in window)) return;
    var obs = new MutationObserver(function () {
      if (!frame.querySelector("iframe")) return;
      window.clearTimeout(timer);
      showForm();
      obs.disconnect();
    });
    obs.observe(frame, { childList: true, subtree: true });
  }

  function load() {
    if (started) return;
    started = true;
    var script = document.createElement("script");
    script.src = "https://js-eu1.hsforms.net/forms/embed/149355855.js";
    script.defer = true;
    script.onerror = showFallback;
    document.body.appendChild(script);
    watch();
  }

  if (!("IntersectionObserver" in window)) {
    load();
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      load();
      io.disconnect();
    });
  }, { rootMargin: "400px 0px" });
  io.observe(root);
})();
