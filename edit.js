(function () {
  var store = "deck-key";
  var DEFAULT_ROOM = "tobyn-smith-presentations";
  var gate = document.getElementById("gate");
  var app = document.getElementById("app");
  var state = { deck: {}, names: [], slides: [], script: [] };
  var saveTimer = null;
  var bound = false;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function need() {
    try {
      var saved = localStorage.getItem(store);
      if (saved) return saved;
    } catch (e) {}
    return (window.DECK && DECK.presenterKey) || "";
  }

  function unlock() {
    gate.hidden = true;
    app.hidden = false;
    boot();
  }

  var want = need();
  if (!want) {
    unlock();
  } else {
    try {
      if (sessionStorage.getItem(store) === want) unlock();
      else gate.hidden = false;
    } catch (e) {
      gate.hidden = false;
    }
  }

  document.getElementById("gate-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var v = document.getElementById("key").value;
    if (v === need()) {
      try { sessionStorage.setItem(store, v); } catch (err) {}
      unlock();
    } else {
      document.getElementById("gate-err").hidden = false;
    }
  });

  function kindOf(s) {
    if (s.type === "title") return "title";
    if (s.type === "prompt") return "question";
    return "points";
  }

  function newId(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 8);
  }

  function blankSlide(kind) {
    if (kind === "title") {
      return { id: newId("title"), type: "title", kicker: "", title: "Session title", lede: "", agenda: ["First part", "Second part"] };
    }
    if (kind === "question") {
      return {
        id: newId("q"),
        type: "prompt",
        kicker: "Question",
        title: "Discussion question",
        help: "",
        input: "text",
        viz: "list",
        placeholder: "Enter your response below."
      };
    }
    return {
      id: newId("board"),
      type: "points",
      kicker: "",
      title: "Talking points",
      lead: "",
      points: [
        { title: "First", body: "" },
        { title: "Second", body: "" }
      ]
    };
  }

  function toEditorSlide(s) {
    var kind = kindOf(s);
    if (kind === "title") {
      return {
        id: s.id || "title",
        kind: "title",
        title: s.title || "",
        lede: s.lede || "",
        agenda: (s.agenda && s.agenda.length) ? s.agenda.slice() : [""]
      };
    }
    if (kind === "question") {
      return { id: s.id || newId("q"), kind: "question", title: s.title || "", help: s.help || "" };
    }
    var rows = s.points || s.claims || [];
    return {
      id: s.id || newId("board"),
      kind: "points",
      origType: s.type,
      title: s.title || "",
      lead: s.lead || "",
      points: rows.length ? rows.map(function (p) {
        return { title: p.title || "", body: p.body || "" };
      }) : [{ title: "", body: "" }]
    };
  }

  function fromEditorSlide(s, i) {
    if (s.kind === "title") {
      return {
        id: s.id || "title",
        type: "title",
        kicker: (state.deck.title || (window.DECK && DECK.title) || "Discussion"),
        title: s.title.trim(),
        lede: s.lede.trim(),
        agenda: s.agenda.map(function (a) { return a.trim(); }).filter(Boolean),
        speaker: ""
      };
    }
    if (s.kind === "question") {
      return {
        id: s.id || newId("q"),
        type: "prompt",
        kicker: (i + 1) + " · Question",
        title: s.title.trim(),
        help: s.help.trim(),
        input: "text",
        viz: "list",
        placeholder: "Enter your response below."
      };
    }
    var rows = s.points.map(function (p) {
      return { title: p.title.trim(), body: p.body.trim() };
    }).filter(function (p) { return p.title || p.body; });
    var type = s.origType === "claims" ? "claims" : "points";
    var out = {
      id: s.id || newId("board"),
      type: type,
      kicker: String(i + 1),
      title: s.title.trim(),
      lead: s.lead.trim()
    };
    if (type === "claims") {
      out.claims = rows.map(function (p, n) {
        return { n: String(n + 1), title: p.title, body: p.body };
      });
    } else {
      out.points = rows;
    }
    return out;
  }

  function loadState() {
    var saved = window.DeckContent && DeckContent.read();
    var deck = saved && saved.deck ? saved.deck : (window.DECK || {});
    var slides = saved && saved.slides ? saved.slides : (window.SLIDES || []);
    var names = saved && saved.names ? saved.names : ((window.Roster && Roster.names) || []);
    var script = saved && saved.script ? saved.script : (window.SCRIPT || []);
    state.deck = {
      title: deck.title || "",
      presenterKey: deck.presenterKey || "",
      joinUrl: deck.joinUrl || "",
      room: deck.room || "session-1",
      session: deck.session || "1"
    };
    state.names = names.slice();
    state.slides = slides.map(toEditorSlide);
    state.script = alignScript(script, state.slides);
  }

  function alignScript(script, slides) {
    var byId = {};
    (script || []).forEach(function (sec) { byId[sec.id] = sec; });
    var out = [];
    var before = byId.before || { id: "before", title: "Before", say: "", notes: "" };
    out.push({ id: "before", title: "Before", say: before.say || "", notes: before.notes || "" });
    slides.forEach(function (s, i) {
      var old = byId[s.id] || {};
      out.push({
        id: s.id,
        title: s.title || ("Board " + (i + 1)),
        say: old.say || "",
        notes: old.notes || ""
      });
    });
    return out;
  }

  function val(id) { return document.getElementById(id); }

  function setStatus(msg) {
    var el = document.getElementById("now");
    if (el) el.textContent = msg;
    var top = document.getElementById("status");
    if (top) top.textContent = msg;
  }

  function cleanRoom(word) {
    return String(word || "").replace(/[^a-zA-Z0-9_-]/g, "");
  }

  function stripRoomParam(url) {
    return String(url || "")
      .replace(/([?&])room=[^&]*/g, "$1")
      .replace(/\?&/, "?")
      .replace(/&&+/g, "&")
      .replace(/[?&]$/, "");
  }

  function studentLink() {
    var base = stripRoomParam(state.deck.joinUrl || "").trim()
      || (window.DeckContent && DeckContent.siteJoin && DeckContent.siteJoin())
      || "";
    var word = cleanRoom(state.deck.room);
    if (window.DeckContent && DeckContent.withRoom) return DeckContent.withRoom(base, word);
    if (!base) return "";
    if (!word) return base;
    return base + (base.indexOf("?") >= 0 ? "&" : "?") + "room=" + encodeURIComponent(word);
  }

  function autoRoomNow() {
    return (window.DeckContent && DeckContent.siteRoom && DeckContent.siteRoom()) || DEFAULT_ROOM;
  }

  function isAutoJoin(url) {
    var base = stripRoomParam(url || "");
    var site = (window.DeckContent && DeckContent.siteJoin && DeckContent.siteJoin()) || "";
    if (!base) return true;
    if (site && base.replace(/\/+$/, "") === stripRoomParam(site).replace(/\/+$/, "")) return true;
    if (window.DeckContent && DeckContent.isDemoJoin && DeckContent.isDemoJoin(base)) return true;
    return false;
  }

  function paintBoards() {
    var host = document.getElementById("board-list");
    host.innerHTML = state.slides.map(function (s, i) {
      var body = "";
      if (s.kind === "title") {
        body = '<label>Heading<input data-f="title" type="text" value="' + esc(s.title) + '"></label>'
          + '<label>Under the heading<input data-f="lede" type="text" value="' + esc(s.lede) + '"></label>'
          + '<p class="hint">Agenda, one line each</p>'
          + '<div class="row-list">' + s.agenda.map(function (line, n) {
            return '<label>Line ' + (n + 1) + '<input data-f="agenda" data-n="' + n + '" type="text" value="' + esc(line) + '"></label>';
          }).join("") + "</div>"
          + '<button type="button" data-act="add-agenda">Add a line</button>';
      } else if (s.kind === "question") {
        body = '<label>The question<textarea data-f="title" rows="3">' + esc(s.title) + "</textarea></label>"
          + '<label>Hint for the room<input data-f="help" type="text" value="' + esc(s.help) + '"></label>';
      } else {
        body = '<label>Heading<input data-f="title" type="text" value="' + esc(s.title) + '"></label>'
          + '<label>Intro line<input data-f="lead" type="text" value="' + esc(s.lead) + '"></label>'
          + '<div class="row-list">' + s.points.map(function (p, n) {
            return '<div class="row-item">'
              + '<label>Point ' + (n + 1) + '<input data-f="pt-title" data-n="' + n + '" type="text" value="' + esc(p.title) + '"></label>'
              + '<label>A sentence or two<textarea data-f="pt-body" data-n="' + n + '" rows="2">' + esc(p.body) + "</textarea></label>"
              + (s.points.length > 1 ? '<button type="button" data-act="del-point" data-n="' + n + '">Remove this point</button>' : "")
              + "</div>";
          }).join("") + "</div>"
          + '<button type="button" data-act="add-point">Add a point</button>';
      }
      var label = s.kind === "title" ? "Title board" : s.kind === "question" ? "Question" : "Talking points";
      return '<article class="board-card" data-i="' + i + '">'
        + '<div class="card-top"><strong>' + (i + 1) + ". " + label + "</strong>"
        + '<div class="card-tools">'
        + (i ? '<button type="button" data-act="up">Move up</button>' : "")
        + (i < state.slides.length - 1 ? '<button type="button" data-act="down">Move down</button>' : "")
        + '<button type="button" data-act="del">Remove</button>'
        + "</div></div>" + body + "</article>";
    }).join("");
  }

  function paintScript() {
    var host = document.getElementById("script-list");
    host.innerHTML = state.script.map(function (sec, i) {
      return '<article class="script-card" data-i="' + i + '">'
        + "<strong>" + esc(sec.title || "Part") + "</strong>"
        + '<label>What you say<textarea data-f="say" rows="4">' + esc(sec.say) + "</textarea></label>"
        + '<label>Cues, one per line<textarea data-f="notes" rows="3">' + esc(sec.notes) + "</textarea></label>"
        + "</article>";
    }).join("");
  }

  function paint() {
    val("title").value = state.deck.title;
    val("presenterKey").value = state.deck.presenterKey;
    val("room").value = (!state.deck.room || state.deck.room === autoRoomNow()) ? "" : state.deck.room;
    val("joinUrl").value = isAutoJoin(state.deck.joinUrl) ? "" : stripRoomParam(state.deck.joinUrl);
    var prev = document.getElementById("join-preview");
    if (prev) prev.textContent = (studentLink() || "").replace(/^https:\/\//, "");
    val("names-box").value = state.names.join("\n");
    paintBoards();
    paintScript();
  }

  function collect() {
    state.deck.title = val("title").value.replace(/\s+/g, " ").trim();
    state.deck.presenterKey = val("presenterKey").value.trim();
    state.deck.room = cleanRoom(val("room").value);
    var typed = val("joinUrl").value.trim();
    if (typed) {
      try {
        var u = new URL(typed, location.href);
        var r = u.searchParams.get("room");
        if (r) state.deck.room = cleanRoom(r) || state.deck.room;
      } catch (e) {}
    }
    var base = stripRoomParam(typed);
    state.deck.joinUrl = isAutoJoin(base) ? "" : base;
    state.names = val("names-box").value.split(/\n+/).map(function (n) {
      return n.replace(/\s+/g, " ").trim();
    }).filter(Boolean);
    val("room").value = (!state.deck.room || state.deck.room === autoRoomNow()) ? "" : state.deck.room;
    val("joinUrl").value = state.deck.joinUrl;
    var prev = document.getElementById("join-preview");
    if (prev) prev.textContent = (studentLink() || "").replace(/^https:\/\//, "");
  }

  function payload() {
    collect();
    var slides = state.slides.map(fromEditorSlide);
    state.script = alignScript(state.script, state.slides);
    return {
      deck: {
        title: state.deck.title,
        presenterKey: state.deck.presenterKey,
        joinUrl: state.deck.joinUrl,
        room: state.deck.room,
        session: state.deck.session
      },
      names: state.names,
      slides: slides,
      script: state.script.map(function (sec) {
        return { id: sec.id, title: sec.title, say: sec.say, notes: sec.notes };
      })
    };
  }

  function saveNow(quiet) {
    var data = payload();
    DeckContent.save(data);
    if (data.deck.presenterKey) {
      try {
        localStorage.setItem(store, data.deck.presenterKey);
        sessionStorage.setItem(store, data.deck.presenterKey);
      } catch (e) {}
    }
    if (!quiet) {
      setStatus("Saved on this computer. Open Present or the slideshow to see it.");
    } else {
      setStatus("Saved on this computer.");
    }
    var btn = document.getElementById("save");
    if (btn) btn.textContent = "Saved";
  }

  function scheduleSave() {
    var btn = document.getElementById("save");
    if (btn) btn.textContent = "Save";
    setStatus("Saving…");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { saveNow(true); }, 700);
  }

  function bind() {
    if (bound) return;
    bound = true;
    app.addEventListener("input", function (e) {
      if (!e.target.closest("input, textarea")) return;
      var card = e.target.closest(".board-card");
      if (card) {
        var s = state.slides[+card.getAttribute("data-i")];
        var f = e.target.getAttribute("data-f");
        var n = +e.target.getAttribute("data-n");
        if (s && f) {
          if (f === "agenda") s.agenda[n] = e.target.value;
          else if (f === "pt-title") s.points[n].title = e.target.value;
          else if (f === "pt-body") s.points[n].body = e.target.value;
          else s[f] = e.target.value;
        }
      }
      var scriptCard = e.target.closest(".script-card");
      if (scriptCard) {
        var sec = state.script[+scriptCard.getAttribute("data-i")];
        var sf = e.target.getAttribute("data-f");
        if (sec && sf) sec[sf] = e.target.value;
      }
      scheduleSave();
    });
    document.getElementById("board-list").addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-act]");
      if (!btn) return;
      var card = btn.closest(".board-card");
      var i = +card.getAttribute("data-i");
      var act = btn.getAttribute("data-act");
      var s = state.slides[i];
      if (act === "up" && i) {
        state.slides.splice(i - 1, 0, state.slides.splice(i, 1)[0]);
      } else if (act === "down" && i < state.slides.length - 1) {
        state.slides.splice(i + 1, 0, state.slides.splice(i, 1)[0]);
      } else if (act === "del") {
        if (state.slides.length === 1) return;
        state.slides.splice(i, 1);
      } else if (act === "add-agenda") {
        s.agenda.push("");
      } else if (act === "add-point") {
        s.points.push({ title: "", body: "" });
      } else if (act === "del-point") {
        s.points.splice(+btn.getAttribute("data-n"), 1);
      }
      state.script = alignScript(state.script, state.slides);
      paintBoards();
      paintScript();
      scheduleSave();
    });
    document.getElementById("add-title").addEventListener("click", function () {
      state.slides.push(toEditorSlide(blankSlide("title")));
      state.script = alignScript(state.script, state.slides);
      paintBoards();
      paintScript();
      scheduleSave();
    });
    document.getElementById("add-points").addEventListener("click", function () {
      state.slides.push(toEditorSlide(blankSlide("points")));
      state.script = alignScript(state.script, state.slides);
      paintBoards();
      paintScript();
      scheduleSave();
    });
    document.getElementById("add-question").addEventListener("click", function () {
      state.slides.push(toEditorSlide(blankSlide("question")));
      state.script = alignScript(state.script, state.slides);
      paintBoards();
      paintScript();
      scheduleSave();
    });
    document.getElementById("save").addEventListener("click", function () {
      clearTimeout(saveTimer);
      saveNow(false);
    });
    document.getElementById("forget").addEventListener("click", function () {
      if (!confirm("Throw away the copy on this computer and go back to the example on the site?")) return;
      DeckContent.clear();
      location.reload();
    });
    document.getElementById("backup").addEventListener("click", function () {
      var data = payload();
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "session.json";
      a.click();
      URL.revokeObjectURL(a.href);
      setStatus("Backup downloaded. Open it on another computer if you switch.");
    });
    document.getElementById("restore").addEventListener("change", function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(reader.result);
          if (!data || typeof data !== "object" || !data.slides) throw new Error("no");
          DeckContent.save(data);
          loadState();
          paint();
          setStatus("Opened that backup on this computer.");
        } catch (err) {
          setStatus("That file is not a session backup.");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });
    document.getElementById("copy-link").addEventListener("click", function () {
      collect();
      var url = studentLink();
      function ok() { setStatus("Copied the student link."); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(ok).catch(function () { window.prompt("Copy this link", url); });
      } else {
        window.prompt("Copy this link", url);
      }
    });
  }

  function boot() {
    loadState();
    paint();
    bind();
    if (window.DeckContent && DeckContent.read()) {
      setStatus("This computer already has a saved copy. Change a box and it will save again.");
    } else {
      setStatus("Type in the boxes. This computer keeps a copy.");
    }
  }
})();
