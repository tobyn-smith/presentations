(function () {
  var html = document.documentElement;
  var KEY = "deck-script";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function lines(text, tag) {
    return String(text || "").split(/\n+/).map(function (row) {
      return row.trim();
    }).filter(Boolean).map(function (row) {
      return tag === "p" ? '<p class="say">' + esc(row) + "</p>" : "<li>" + esc(row) + "</li>";
    }).join("");
  }

  function paintScript() {
    var parts = window.SCRIPT || [];
    var jumps = document.getElementById("jumps");
    var root = document.getElementById("script-root");
    if (!root) return;
    if (jumps) {
      jumps.innerHTML = parts.map(function (sec) {
        return '<a href="#' + esc(sec.id) + '">' + esc(sec.title || "Part") + "</a>";
      }).join("");
    }
    root.innerHTML = "<h1>Speaker script</h1>"
      + '<p class="lede">Paragraphs are what you say. Bullets are cues. Do not read the boards. Tap Here on the part you are on.</p>'
      + parts.map(function (sec) {
        var say = lines(sec.say, "p");
        var notes = lines(sec.notes, "li");
        return '<section class="sec" id="' + esc(sec.id) + '">'
          + '<div class="sec-head">'
          + "<h2>" + esc(sec.title || "Part") + "</h2>"
          + '<button type="button" class="here" data-mark="' + esc(sec.id) + '">Here</button>'
          + "</div>"
          + say
          + (notes ? '<ul class="note">' + notes + "</ul>" : "")
          + "</section>";
      }).join("");
  }

  paintScript();
  document.addEventListener("deck-content", function () {
    paintScript();
    if (state.here) mark(state.here, false);
  });

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  var state = load();
  if (state.size) html.setAttribute("data-size", String(state.size));
  if (state.space) html.setAttribute("data-space", state.space);
  if (state.font) html.setAttribute("data-font", state.font);
  if (state.here) mark(state.here, false);

  function size() {
    return parseInt(html.getAttribute("data-size") || "2", 10);
  }

  function paintTools() {
    var space = document.getElementById("space");
    var font = document.getElementById("font");
    var extra = html.getAttribute("data-space") === "extra";
    var face = html.getAttribute("data-font") || "lexend";
    if (space) {
      space.setAttribute("aria-pressed", extra ? "true" : "false");
      space.textContent = extra ? "Less space" : "More space";
    }
    if (font) {
      if (face === "opendyslexic") font.textContent = "Use Arial";
      else if (face === "arial") font.textContent = "Use Lexend";
      else font.textContent = "OpenDyslexic";
    }
  }

  function mark(id, store) {
    var secs = document.querySelectorAll(".sec");
    var now = document.getElementById("now");
    var jumps = document.querySelectorAll(".jump a");
    var found = document.getElementById(id);
    for (var i = 0; i < secs.length; i++) secs[i].classList.remove("is-here");
    if (found) found.classList.add("is-here");
    for (var j = 0; j < jumps.length; j++) {
      var href = jumps[j].getAttribute("href") || "";
      jumps[j].setAttribute("aria-current", href === "#" + id ? "true" : "false");
    }
    if (now) now.textContent = found
      ? "Now: " + (found.querySelector("h2") || {}).textContent
      : "Not marked yet. Tap Here on a part.";
    state.here = id;
    if (store !== false) save(state);
  }

  document.getElementById("smaller").addEventListener("click", function () {
    state.size = Math.max(1, size() - 1);
    html.setAttribute("data-size", String(state.size));
    save(state);
  });
  document.getElementById("bigger").addEventListener("click", function () {
    state.size = Math.min(4, size() + 1);
    html.setAttribute("data-size", String(state.size));
    save(state);
  });
  document.getElementById("space").addEventListener("click", function () {
    state.space = html.getAttribute("data-space") === "extra" ? "roomy" : "extra";
    html.setAttribute("data-space", state.space);
    save(state);
    paintTools();
  });
  document.getElementById("font").addEventListener("click", function () {
    var face = html.getAttribute("data-font") || "lexend";
    state.font = face === "lexend" ? "opendyslexic" : face === "opendyslexic" ? "arial" : "lexend";
    html.setAttribute("data-font", state.font);
    save(state);
    paintTools();
  });

  document.addEventListener("click", function (e) {
    var b = e.target.closest(".here");
    if (!b) return;
    mark(b.getAttribute("data-mark"), true);
  });

  paintTools();
})();
