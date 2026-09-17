(function () {
  var slides = window.SLIDES || [];
  var role = document.body.getAttribute("data-role");
  var isPres = role === "presenter";
  var stage = document.getElementById("stage");
  var kicker = document.getElementById("kicker");
  var counter = document.getElementById("counter");
  var prevBtn = document.getElementById("prev");
  var nextBtn = document.getElementById("next");
  var resetBtn = document.getElementById("reset");
  var wipeBtn = document.getElementById("wipe");
  var liveBtn = document.getElementById("live");
  var handBtn = document.getElementById("hand");
  var meBox = document.getElementById("me");
  var handsBox = document.getElementById("hands");
  var seen = {};
  var painted = {};
  var lastIndex = -1;
  var draft = { name: "", face: null, q: "", step: "name" };
  var kickNotice = "";

  function cfg() { return window.DECK || {}; }
  function brand() { return cfg().title || "Discussion"; }
  function joinHref() {
    if (cfg().joinUrl) return String(cfg().joinUrl);
    var path = location.pathname.replace(/[^/]+$/, "");
    if (path.slice(-1) !== "/") path += "/";
    return location.origin + path;
  }
  function qrSrc(url) {
    return "https://api.qrserver.com/v1/create-qr-code/?size=460x460&ecc=M&margin=8&data="
      + encodeURIComponent(url);
  }

  var STOP = "a an the and or but if to of in on for with as at by from is it this that was were be been being are was we you they i me my our your their not no so than then there here what when which who how why can could would should may might will just about into over after before also more most some any only own other than too very".split(" ");

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function unlocked() {
    var app = document.getElementById("app");
    return !app || !app.hidden;
  }

  function go(n) {
    if (!unlocked()) return;
    n = Math.max(0, Math.min(slides.length - 1, n));
    if (isPres) DeckSync.setSlide(n);
    else if (DeckSync.isPresenting()) render(n);
  }

  function waitScreen() {
    document.body.classList.add("is-waiting");
    document.body.classList.remove("is-hold", "is-checkin", "is-checkin-name", "is-checkin-face");
    document.title = brand();
    kicker.textContent = brand();
    counter.textContent = "";
    stage.classList.remove("prompt", "stats", "title", "hold", "compare", "charts", "story", "points");
    stage.classList.add("waiting");
    lastIndex = -1;
    if (DeckSync.seated()) holdRoom();
    else checkIn();
    paintMe();
    paintHandBtn();
  }

  function holdPeersInner() {
    var list = DeckSync.getSeats();
    var mine = DeckSync.sessionId();
    var n = list.length;
    var count = n <= 1 ? "Just you for now" : n + " here";
    var faces = list.map(function (row) {
      return "<li" + (row.sid === mine ? ' class="is-me"' : "") + ' title="' + esc(row.name) + '">'
        + Roster.faceHtml(row.face, row.name) + "</li>";
    }).join("");
    return '<p class="hold-count">' + count + "</p>"
      + (faces ? '<ul class="hold-faces">' + faces + "</ul>" : "");
  }

  function paintHoldPeers() {
    var host = document.getElementById("hold-peers");
    if (!host) return;
    host.innerHTML = holdPeersInner();
  }

  function holdRoom() {
    var who = DeckSync.me() || {};
    var first = Roster.firstName(who.name);
    document.body.classList.remove("is-checkin", "is-checkin-name", "is-checkin-face");
    document.body.classList.add("is-hold");
    stage.classList.remove("title");
    stage.classList.add("hold");
    stage.innerHTML = '<div class="hold-card">'
      + '<div class="hold-glow" aria-hidden="true"></div>'
      + '<div class="hold-avatar">'
      + '<span class="hold-ring" aria-hidden="true"></span>'
      + Roster.faceHtml(who.face, who.name)
      + "</div>"
      + '<p class="wait-kicker">You\'re in</p>'
      + "<h1>" + esc(first || "Hold") + "</h1>"
      + '<p class="lede">Waiting for the room to start...</p>'
      + '<div class="hold-peers" id="hold-peers">' + holdPeersInner() + "</div>"
      + '<button type="button" class="not-you" id="not-you">Not you?</button>'
      + "</div>";
    var back = document.getElementById("not-you");
    if (back) back.addEventListener("click", function () {
      DeckSync.standUp();
      draft = { name: "", face: null, q: "", step: "name" };
      checkIn();
    });
  }

  function filteredNames() {
    var q = draft.q;
    return Roster.names.filter(function (n) {
      return !q || n.toLowerCase().indexOf(q) >= 0;
    });
  }

  function nameButtonHtml(n, taken) {
    var parts = String(n).split(/\s+/);
    var first = parts[0] || n;
    var rest = parts.slice(1).join(" ");
    var held = !!taken[n];
    var on = draft.name === n;
    return '<button type="button" class="name-pick' + (on ? " on" : "") + (held ? " taken" : "") + '" data-name="' + esc(n) + '"'
      + (held ? " disabled" : "") + ">"
      + '<span class="name-first">' + esc(first) + "</span>"
      + (rest ? '<span class="name-rest">' + esc(rest) + "</span>" : "")
      + (held ? '<span class="name-taken">Taken</span>' : "")
      + "</button>";
  }

  function namesHtml() {
    if (!Roster.names.length) {
      return "";
    }
    var taken = DeckSync.takenNames();
    var names = filteredNames();
    if (!names.length) return '<p class="names-empty">No one matches.</p>';
    return names.map(function (n) { return nameButtonHtml(n, taken); }).join("");
  }

  function fillNames() {
    var box = document.getElementById("names");
    if (!box) return;
    box.innerHTML = namesHtml();
  }

  function pickName(name) {
    if (!name || DeckSync.takenNames()[name]) return;
    draft.name = name;
    if (!draft.face) draft.face = Roster.faceForName(draft.name);
    draft.step = "face";
    checkIn();
  }

  function checkIn() {
    document.body.classList.add("is-checkin");
    document.body.classList.remove("is-hold");
    document.body.classList.toggle("is-checkin-name", draft.step !== "face");
    document.body.classList.toggle("is-checkin-face", draft.step === "face");
    stage.classList.remove("title", "hold");
    if (draft.step === "face" && draft.name) {
      var preview = draft.face || Roster.faceForName(draft.name);
      draft.face = preview;
      stage.innerHTML = '<button type="button" class="check-back" id="check-back">' + esc(draft.name) + "</button>"
        + "<h1>Pick a picture</h1>"
        + '<div class="check-you">'
        + '<div class="check-preview" id="preview">' + Roster.faceHtml(preview, draft.name) + "</div>"
        + "<div><p class=\"who-name\">" + esc(Roster.firstName(draft.name)) + "</p>"
        + '<p class="who-hint">Change it, or tap I\'m here.</p></div>'
        + "</div>"
        + '<div class="faces" id="faces">'
        + Roster.faces.map(function (f) {
          var on = String(preview.id) === f.id;
          return '<button type="button" class="face-pick' + (on ? " on" : "") + '" data-face="' + f.id + '" aria-pressed="' + (on ? "true" : "false") + '">'
            + Roster.faceHtml({ id: f.id }) + "</button>";
        }).join("")
        + "</div>"
        + '<button type="button" class="seat-btn" id="seat">I\'m here</button>';
    } else {
      draft.step = "name";
      var emptyList = !Roster.names.length;
      stage.innerHTML = (kickNotice ? '<p class="kick-banner">' + esc(kickNotice) + "</p>" : "")
        + '<p class="wait-kicker">' + esc(brand()) + "</p>"
        + "<h1>Who are you?</h1>"
        + '<label class="sr" for="find">' + (emptyList ? "Your name" : "Find your name") + "</label>"
        + '<input class="find" id="find" type="' + (emptyList ? "text" : "search") + '" enterkeyhint="' + (emptyList ? "done" : "search") + '" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="' + (emptyList ? "Type your name" : "Find your name") + '" value="' + esc(emptyList ? (draft.name || "") : draft.q) + '">'
        + '<div class="names" id="names">' + namesHtml() + "</div>"
        + (emptyList ? '<button type="button" class="seat-btn" id="use-typed">Continue</button>' : "");
    }
    bindCheckIn();
    var picked = stage.querySelector(".name-pick.on") || stage.querySelector(".face-pick.on");
    if (picked && picked.scrollIntoView) picked.scrollIntoView({ block: "nearest" });
  }

  function bindCheckIn() {
    var find = document.getElementById("find");
    if (find) {
      find.addEventListener("input", function () {
        if (!Roster.names.length) {
          draft.name = find.value.replace(/\s+/g, " ").trim();
          return;
        }
        draft.q = find.value.trim().toLowerCase();
        fillNames();
      });
      find.addEventListener("keydown", function (e) {
        if (e.key !== "Enter") return;
        if (!Roster.names.length) {
          pickName(find.value.replace(/\s+/g, " ").trim());
          return;
        }
        var taken = DeckSync.takenNames();
        var open = filteredNames().filter(function (n) { return !taken[n]; });
        if (open.length === 1) pickName(open[0]);
      });
    }
    var typed = document.getElementById("use-typed");
    if (typed) typed.addEventListener("click", function () {
      var field = document.getElementById("find");
      pickName(field ? field.value.replace(/\s+/g, " ").trim() : "");
    });
    var names = document.getElementById("names");
    if (names) names.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-name]");
      if (!b || b.disabled) return;
      pickName(b.getAttribute("data-name"));
    });
    var back = document.getElementById("check-back");
    if (back) back.addEventListener("click", function () {
      draft.step = "name";
      checkIn();
    });
    var faces = document.getElementById("faces");
    if (faces) faces.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-face]");
      if (!b) return;
      draft.face = { id: b.getAttribute("data-face") };
      Array.prototype.forEach.call(faces.querySelectorAll(".face-pick"), function (el) {
        var on = el === b;
        el.classList.toggle("on", on);
        el.setAttribute("aria-pressed", on ? "true" : "false");
      });
      var preview = document.getElementById("preview");
      if (preview) preview.innerHTML = Roster.faceHtml(draft.face, draft.name);
    });
    var seat = document.getElementById("seat");
    if (seat) seat.addEventListener("click", function () {
      if (!draft.name || !draft.face) return;
      if (DeckSync.takenNames()[draft.name]) { draft.step = "name"; checkIn(); return; }
      DeckSync.sit(draft.name, draft.face);
      if (DeckSync.isPresenting()) render(DeckSync.getSlide());
      else holdRoom();
    });
  }

  function render(i) {
    var s = slides[i];
    if (!s) return;
    var changed = i !== lastIndex;
    lastIndex = i;
    document.body.classList.remove("is-waiting", "is-checkin", "is-checkin-name", "is-checkin-face", "is-hold");
    stage.classList.remove("hold");
    document.title = (isPres ? "Presenter · " : "") + (s.title || brand());
    kicker.textContent = s.kicker || brand();
    if (counter) counter.textContent = isPres ? String(i + 1) : ((i + 1) + " / " + slides.length);
    if (resetBtn) resetBtn.hidden = s.type !== "prompt";
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i === slides.length - 1;
    stage.classList.toggle("prompt", s.type === "prompt");
    stage.classList.toggle("has-notes", s.type === "prompt" && (s.viz === "bars-list" || s.viz === "list" || s.viz === "words"));
    stage.classList.toggle("has-recap", !!(s.recap && s.recap.length));
    stage.classList.toggle("has-close", s.type === "prompt" && !!s.quote);
    stage.classList.toggle("stats", s.type === "stats");
    stage.classList.toggle("title", s.type === "title");
    stage.classList.toggle("compare", s.type === "compare");
    stage.classList.toggle("charts", s.type === "charts");
    stage.classList.toggle("story", s.type === "story");
    stage.classList.toggle("points", s.type === "points");
    stage.classList.toggle("claims", s.type === "claims");
    if (changed) {
      stage.classList.remove("fade");
      void stage.offsetWidth;
      stage.classList.add("fade");
    }
    stage.innerHTML = htmlFor(s, i);
    bind(s, i);
    if (isPres && s.type === "prompt") paintResponses(s, i, DeckSync.getResponses(String(i)));
    paintMe();
    paintHandBtn();
  }

  function seatedSig(list) {
    return list.map(function (r) {
      return r.sid + ":" + r.name + ":" + ((r.face && r.face.id) || "");
    }).join("|");
  }

  function seatedRows(list) {
    return list.map(function (row) {
      return '<li data-sid="' + esc(row.sid) + '" title="' + esc(row.name) + '">'
        + Roster.faceHtml(row.face, row.name)
        + "<span>" + esc(row.name) + "</span>"
        + '<button type="button" class="kick-btn" data-kick="' + esc(row.sid) + '" aria-label="Remove ' + esc(row.name) + '">Remove</button>'
        + "</li>";
    }).join("");
  }

  function seatedHtml() {
    if (!isPres) return "";
    var list = DeckSync.getSeats();
    var sig = seatedSig(list);
    return '<div class="seated" id="seated">'
      + '<p class="seated-count">' + list.length + (list.length === 1 ? " here" : " here") + "</p>"
      + '<ul class="seated-list" data-sig="' + esc(sig) + '">' + seatedRows(list) + "</ul></div>";
  }

  function whoHtml(r) {
    var name = r.name || "";
    var face = r.face || {};
    if (!name) {
      var seats = DeckSync.getSeats();
      for (var i = 0; i < seats.length; i++) {
        if (seats[i].sid === r.sid) {
          name = seats[i].name || name;
          face = seats[i].face || face;
          break;
        }
      }
    }
    if (!name) return "";
    return '<p class="who">' + Roster.faceHtml(face, name) + "<span>" + esc(name) + "</span></p>";
  }

  function quoteHtml(q) {
    if (!q) return "";
    return '<figure class="quote"><p>“' + esc(q.text) + '”</p><cite>' + esc(q.cite) + "</cite></figure>";
  }

  function articleHtml(s) {
    if (!s.articleUrl) return "";
    if (isPres && s.type === "prompt") return "";
    var label = s.articleLabel || "Open the article";
    return '<p class="source-link"><a href="' + esc(s.articleUrl) + '" target="_blank" rel="noopener">' + esc(label) + "</a></p>";
  }

  function fmtN(n) {
    n = Number(n);
    if (!isFinite(n)) return "";
    return Math.abs(n) >= 1000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : String(n);
  }

  function chartHtml(chart) {
    var bars = chart.bars || [];
    var max = Number(chart.max);
    if (!isFinite(max) || max <= 0) {
      max = 1;
      bars.forEach(function (b) { if (Number(b.n) > max) max = Number(b.n); });
    }
    var rows = bars.map(function (b) {
      var n = Number(b.n) || 0;
      var pct = Math.max(0, Math.min(100, (n / max) * 100));
      return '<div class="chart-row">'
        + '<span class="chart-lab">' + esc(b.label) + "</span>"
        + '<div class="chart-track"><div class="chart-fill" style="width:' + pct + '%"></div></div>'
        + '<span class="chart-n">' + esc(fmtN(n)) + (chart.unit === "% of agents examined" ? "%" : "") + "</span>"
        + "</div>";
    }).join("");
    return '<figure class="chart" data-chart="' + esc(chart.id || "") + '">'
      + "<figcaption>"
      + '<p class="chart-title">' + esc(chart.title) + "</p>"
      + (chart.source ? '<p class="chart-source">' + esc(chart.source) + "</p>" : "")
      + (chart.note ? '<p class="chart-note">' + esc(chart.note) + "</p>" : "")
      + "</figcaption>"
      + '<div class="chart-bars" role="img" aria-label="' + esc(chart.title) + '">' + rows + "</div>"
      + "</figure>";
  }

  function pairHtml(side, which) {
    if (!side) return "";
    var q = side.quote
      ? '<blockquote class="pair-quote"><p>“' + esc(side.quote) + '”</p></blockquote>'
      : "";
    return '<div class="pair ' + which + '">'
      + (side.label ? '<p class="pair-label">' + esc(side.label) + "</p>" : "")
      + (side.title ? "<h2>" + esc(side.title) + "</h2>" : "")
      + (side.body ? "<p>" + esc(side.body) + "</p>" : "")
      + q
      + "</div>";
  }

  function claimsHtml(list) {
    if (!list || !list.length) return "";
    return '<ol class="claims">' + list.map(function (pt) {
      return "<li>"
        + '<span class="n">' + esc(pt.n || "") + "</span>"
        + "<div>"
        + (pt.title ? "<h2>" + esc(pt.title) + "</h2>" : "")
        + (pt.body ? "<p>" + esc(pt.body) + "</p>" : "")
        + (pt.note ? '<p class="fn">' + esc(pt.note) + "</p>" : "")
        + "</div></li>";
    }).join("") + "</ol>";
  }

  function agendaHtml(s) {
    if (!s.agenda || !s.agenda.length) return "";
    return '<ol class="agenda">' + s.agenda.map(function (row, idx) {
      return "<li><span class=\"n\">" + (idx + 1) + "</span><span>" + esc(row) + "</span></li>";
    }).join("") + "</ol>";
  }

  function htmlFor(s, i) {
    if (s.type === "title") {
      var href = joinHref();
      var shown = href.replace(/^https:\/\//, "");
      var join = isPres
        ? '<div class="join">'
          + '<img class="join-qr" src="' + qrSrc(href) + '" width="460" height="460" alt="QR code for ' + esc(shown) + '">'
          + '<p class="join-url">' + esc(shown) + "</p>"
          + "</div>"
        : "";
      var seated = isPres ? seatedHtml() : "";
      return '<div class="title-copy">'
        + "<h1>" + esc(s.title) + "</h1>"
        + (s.lede ? '<p class="lede">' + esc(s.lede) + "</p>" : "")
        + (s.frame ? '<p class="frame">' + esc(s.frame) + "</p>" : "")
        + agendaHtml(s)
        + (s.speaker ? '<p class="speaker">' + esc(s.speaker) + "</p>" : "")
        + quoteHtml(s.quote)
        + articleHtml(s)
        + "</div>"
        + (isPres ? '<div class="title-side">' + join + seated + "</div>" : "");
    }
    if (s.type === "story") {
      var steps = (s.steps || []).map(function (st) {
        return '<li><span class="step-n">' + esc(st.n) + "</span>"
          + "<div><h2>" + esc(st.title) + "</h2><p>" + esc(st.body) + "</p></div></li>";
      }).join("");
      return "<h1>" + esc(s.title) + "</h1>"
        + (steps ? '<ol class="steps">' + steps + "</ol>" : "")
        + quoteHtml(s.quote);
    }
    if (s.type === "points") {
      var n = (s.points || []).length;
      var cols = n === 4 ? 4 : n === 2 ? 2 : 3;
      var items = (s.points || []).map(function (pt) {
        return "<li><h2>" + esc(pt.title) + "</h2><p>" + esc(pt.body) + "</p></li>";
      }).join("");
      return "<h1>" + esc(s.title) + "</h1>"
        + (s.lead ? '<p class="lead">' + esc(s.lead) + "</p>" : "")
        + (items ? '<ul class="points cols-' + cols + '">' + items + "</ul>" : "")
        + quoteHtml(s.quote);
    }
    if (s.type === "claims") {
      return "<h1>" + esc(s.title) + "</h1>"
        + (s.lead ? '<p class="lead">' + esc(s.lead) + "</p>" : "")
        + claimsHtml(s.claims)
        + (s.chart ? chartHtml(s.chart) : "")
        + (s.note ? '<p class="note">' + esc(s.note) + "</p>" : "")
        + quoteHtml(s.quote);
    }
    if (s.type === "compare") {
      return "<h1>" + esc(s.title) + "</h1>"
        + (s.lead ? '<p class="lead">' + esc(s.lead) + "</p>" : "")
        + '<div class="pair-row">' + pairHtml(s.left, "left") + pairHtml(s.right, "right") + "</div>"
        + (s.callout ? '<p class="callout">' + esc(s.callout) + "</p>" : "")
        + quoteHtml(s.quote);
    }
    if (s.type === "charts") {
      var figs = (s.charts || []).map(chartHtml).join("");
      return "<h1>" + esc(s.title) + "</h1>"
        + (s.note ? '<p class="note">' + esc(s.note) + "</p>" : "")
        + '<div class="chart-grid">' + figs + "</div>";
    }
    if (s.type === "stats") {
      var cards = (s.stats || []).map(function (st) {
        return '<div class="stat"><div class="value">' + esc(st.value) + "</div>"
          + '<p class="label">' + esc(st.label) + "</p>"
          + (st.source ? '<p class="source">' + esc(st.source) + "</p>" : "")
          + "</div>";
      }).join("");
      return "<h1>" + esc(s.title) + "</h1>"
        + '<div class="stats-grid">' + cards + "</div>"
        + (s.footer ? '<p class="footer-line">' + esc(s.footer) + "</p>" : "");
    }
    if (s.type === "content") {
      var body = (s.body || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
      return "<h1>" + esc(s.title) + "</h1>"
        + (body ? '<div class="body">' + body + "</div>" : "")
        + (s.callout ? '<p class="callout">' + esc(s.callout) + "</p>" : "")
        + quoteHtml(s.quote);
    }
    var recap = "";
    if (s.recap && s.recap.length) {
      recap = '<ul class="recap">' + s.recap.map(function (pt) {
        if (typeof pt === "string") return "<li>" + esc(pt) + "</li>";
        var title = pt.title ? "<strong>" + esc(pt.title) + "</strong>" : "";
        var body = pt.body ? "<span>" + esc(pt.body) + "</span>" : "";
        return "<li>" + title + body + "</li>";
      }).join("") + "</ul>";
    }
    var q = '<p class="dq-label">Discussion Question:</p>'
      + "<h1>" + esc(s.title) + "</h1>"
      + (s.lead ? '<p class="lead">' + esc(s.lead) + "</p>" : "")
      + quoteHtml(s.quote)
      + articleHtml(s)
      + recap
      + youHtml(s)
      + (s.help ? '<p class="help">' + esc(s.help) + "</p>" : "");
    if (isPres) {
      return '<div class="ask">' + q + '</div><div id="viz"></div>';
    }
    var inner = q;
    if (DeckSync.isDone(String(i))) {
      return inner + '<p class="thanks">Sent. Wait for the next slide.</p>';
    }
    if (s.input === "text") {
      return inner
        + '<form class="answer" id="form">'
        + '<label class="sr" for="ans">' + esc(s.placeholder || "Type your answer") + "</label>"
        + '<textarea id="ans" required maxlength="800" placeholder="' + esc(s.placeholder || "Type your answer") + '"></textarea>'
        + '<button class="send" type="submit">Send</button></form>';
    }
    if (s.input === "choice" || s.input === "scale") {
      var labs = s.scaleLabels || [];
      return inner
        + '<div class="choices ' + (s.input === "scale" ? "scale" : "") + '" id="choices">'
        + (s.options || []).map(function (o) {
          return '<button type="button" data-choice="' + esc(o) + '">' + esc(o) + "</button>";
        }).join("")
        + "</div>"
        + (labs.length ? '<div class="scale-labels"><span>' + esc(labs[0]) + "</span><span>" + esc(labs[1] || "") + "</span></div>" : "");
    }
    if (s.input === "choice-text") {
      return inner
        + '<div class="choices" id="choices" tabindex="-1">'
        + (s.options || []).map(function (o) {
          return '<button type="button" data-choice="' + esc(o) + '">' + esc(o) + "</button>";
        }).join("")
        + "</div>"
        + '<form class="answer" id="form">'
        + '<textarea id="ans" maxlength="800"' + (s.requireText ? " required" : "") + ' placeholder="' + esc(s.placeholder || "Optional: say why") + '"></textarea>'
        + '<button class="send" type="submit">Send</button></form>';
    }
    return inner;
  }

  function bind(s, i) {
    if (isPres) return;
    var form = document.getElementById("form");
    var choice = "";
    var box = document.getElementById("choices");
    if (box) {
      box.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-choice]");
        if (!b) return;
        choice = b.getAttribute("data-choice");
        box.classList.remove("need");
        Array.prototype.forEach.call(box.querySelectorAll("button"), function (x) {
          x.setAttribute("aria-pressed", x === b ? "true" : "false");
        });
        if (s.input === "choice" || s.input === "scale") submit(s, i, { choice: choice });
      });
    }
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var text = ((document.getElementById("ans") || {}).value || "").trim();
        if (s.input === "choice-text") {
          if (!choice) {
            if (box) {
              box.classList.add("need");
              box.focus();
            }
            return;
          }
          if (s.requireText && !text) return;
          submit(s, i, { choice: choice, text: text });
          return;
        }
        if (!text) return;
        submit(s, i, { text: text });
      });
    }
  }

  function remember(id, payload) {
    if (!id) return;
    try {
      sessionStorage.setItem("deck-mine-" + id, JSON.stringify({
        choice: payload.choice || "",
        text: payload.text || ""
      }));
    } catch (e) {}
  }

  function mine(id) {
    try { return JSON.parse(sessionStorage.getItem("deck-mine-" + id) || "null"); }
    catch (e) { return null; }
  }

  function youHtml(s) {
    if (isPres || !s.recall) return "";
    var m = mine(s.recall);
    if (!m) return "";
    if (m.choice && m.text) {
      return '<p class="you">You called the load-bearing claim <strong>' + esc(m.choice) + "</strong>. “" + esc(m.text) + "”</p>";
    }
    if (m.choice) return '<p class="you">You called the load-bearing claim <strong>' + esc(m.choice) + "</strong>.</p>";
    if (m.text) return '<p class="you">You wrote: “' + esc(m.text) + "”</p>";
    return "";
  }

  function submit(s, i, payload) {
    remember(s.id, payload);
    DeckSync.submit(String(i), payload);
    DeckSync.markDone(String(i));
    render(i);
  }

  function wordFreq(list) {
    var map = {};
    list.forEach(function (r) {
      String(r.text || "").toLowerCase().replace(/[^a-z0-9\s'-]/g, " ").split(/\s+/).forEach(function (w) {
        if (w.length < 3 || STOP.indexOf(w) >= 0) return;
        map[w] = (map[w] || 0) + 1;
      });
    });
    return Object.keys(map).map(function (w) { return { w: w, n: map[w] }; })
      .sort(function (a, b) { return b.n - a.n || a.w.localeCompare(b.w); })
      .slice(0, 12);
  }

  function paintResponses(s, i, list) {
    var viz = document.getElementById("viz");
    if (!viz) return;
    list = list || [];
    var html = "";
    if (s.viz === "bars" || s.viz === "bars-list") {
      var opts = s.options || [];
      var counts = {};
      opts.forEach(function (o) { counts[o] = 0; });
      list.forEach(function (r) { if (r.choice && counts[r.choice] != null) counts[r.choice]++; });
      var total = list.length;
      var max = Math.max(1, total);
      html += '<p class="tally">' + (total ? total + (total === 1 ? " answer" : " answers") : "Waiting for votes") + "</p>";
      html += '<div class="bars">';
      opts.forEach(function (o) {
        var n = counts[o] || 0;
        var pct = total ? Math.round(n / total * 100) : 0;
        var lead = n && n === Math.max.apply(null, opts.map(function (x) { return counts[x]; }));
        html += '<div class="bar' + (lead && total ? " lead" : "") + '"><div class="bar-top"><span class="lab">' + esc(o) + '</span><span class="pct">' + pct + "%</span></div>"
          + '<div class="track"><div class="fill" style="width:' + (n / max * 100) + '%"></div></div>'
          + '<span class="n">' + n + "</span></div>";
      });
      html += "</div>";
    }
    if (s.viz === "words") {
      var freq = wordFreq(list);
      if (freq.length) {
        html += '<div class="words">' + freq.map(function (x) {
          return "<span><b>" + esc(x.w) + "</b> " + x.n + "</span>";
        }).join("") + "</div>";
      }
    }
    if (s.viz === "list" || s.viz === "words" || s.viz === "bars-list") {
      var key = s.id;
      var firstPaint = !painted[key];
      painted[key] = true;
      if (!list.length) {
        if (s.viz !== "bars-list") {
          if (s.starters && s.starters.length) {
            html += '<p class="tally">Waiting for answers</p>';
            html += '<ul class="starters">' + s.starters.map(function (t) {
              return "<li>" + esc(t) + "</li>";
            }).join("") + "</ul>";
          } else {
            html += '<p class="empty">Answers land here.</p>';
          }
        }
      } else {
        if (s.viz !== "bars-list") {
          html += '<p class="tally">' + list.length + (list.length === 1 ? " answer" : " answers") + "</p>";
        }
        html += '<ol class="responses' + (list.length > 4 ? " many" : "") + '">';
        list.forEach(function (r) {
          var id = key + ":" + r.sid;
          var fresh = !firstPaint && !seen[id];
          seen[id] = true;
          html += '<li class="card' + (fresh ? " fresh" : "") + '">';
          html += '<span class="mark" aria-hidden="true">“</span>';
          html += whoHtml(r);
          if (r.text) html += '<p class="said">' + esc(r.text) + "</p>";
          if (r.choice && !r.text) html += '<p class="said">' + esc(r.choice) + "</p>";
          else if (r.choice) html += '<p class="meta">' + esc(r.choice) + "</p>";
          html += "</li>";
        });
        html += "</ol>";
      }
    }
    viz.innerHTML = html;
  }

  function paintMe() {
    if (!meBox) return;
    var who = DeckSync.me();
    if (!who || isPres || document.body.classList.contains("is-waiting")) {
      meBox.hidden = true;
      meBox.innerHTML = "";
      return;
    }
    meBox.hidden = false;
    meBox.innerHTML = Roster.faceHtml(who.face, who.name) + "<span>" + esc(Roster.firstName(who.name)) + "</span>";
  }

  function paintHandBtn() {
    if (!handBtn) return;
    var show = !isPres && DeckSync.seated() && !document.body.classList.contains("is-waiting");
    handBtn.hidden = !show;
    if (!show) return;
    var up = DeckSync.handUp();
    handBtn.setAttribute("aria-pressed", up ? "true" : "false");
    handBtn.classList.toggle("on", up);
    handBtn.textContent = up ? "Lower hand" : "Hand up";
  }

  function paintHands() {
    if (!handsBox) return;
    var list = DeckSync.getHands();
    if (!list.length) {
      handsBox.hidden = true;
      handsBox.innerHTML = "";
      return;
    }
    handsBox.hidden = false;
    handsBox.innerHTML = '<span class="hands-count">' + list.length + (list.length === 1 ? " hand" : " hands") + "</span>"
      + '<ul>' + list.map(function (h) {
        return '<li title="' + esc(h.name) + '">' + Roster.faceHtml(h.face, h.name)
          + "<span>" + esc(Roster.firstName(h.name)) + "</span></li>";
      }).join("") + "</ul>";
  }

  function paintSeated() {
    var host = document.getElementById("seated");
    if (!host || !isPres) return;
    var list = DeckSync.getSeats();
    var sig = seatedSig(list);
    var count = host.querySelector(".seated-count");
    var ul = host.querySelector(".seated-list");
    if (count) count.textContent = list.length + (list.length === 1 ? " here" : " here");
    if (!ul || ul.getAttribute("data-sig") === sig) return;
    ul.setAttribute("data-sig", sig);
    ul.innerHTML = seatedRows(list);
  }

  DeckSync.onSlide(function (n) {
    if (!isPres && !DeckSync.isPresenting()) return;
    render(n);
  });
  function failsafeLog(text) {
    var log = document.getElementById("failsafe-log");
    if (!log) return;
    log.hidden = !text;
    log.textContent = text || "";
  }

  function failsafeAge(ms) {
    if (ms == null) return "never";
    if (ms < 1500) return "just now";
    if (ms < 60000) return Math.round(ms / 1000) + "s ago";
    return Math.round(ms / 60000) + "m ago";
  }

  function paintFailsafeStatus() {
    var host = document.getElementById("failsafe-status");
    if (!host || !DeckSync.snapshot) return;
    var snap = DeckSync.snapshot();
    var rows = [
      ["Room", snap.localOnly ? "Rehearsal · this computer only" : snap.room],
      ["Session", snap.session],
      ["Go live", snap.presenting ? "On · last push " + failsafeAge(snap.hereAgeMs) : "Off · phones on Hold"],
      ["Phones", snap.localOnly ? "Blocked by ?local=1" : (snap.status.phones ? "Firebase path is open" : "Not confirmed yet")],
      ["Transport", snap.status.detail || snap.status.mode],
      ["Checked in", String(snap.seats.length)],
      ["Join", (snap.join || "").replace(/^https:\/\//, "")],
      ["Slide", String((snap.slide || 0) + 1)],
      ["Last error", snap.error || "None"]
    ];
    host.innerHTML = rows.map(function (row) {
      return "<div><dt>" + esc(row[0]) + "</dt><dd>" + esc(row[1]) + "</dd></div>";
    }).join("");
    var people = document.getElementById("failsafe-people");
    if (people) {
      var list = DeckSync.getSeats();
      if (!list.length) people.innerHTML = '<p class="failsafe-empty">Nobody is checked in.</p>';
      else people.innerHTML = list.map(function (row) {
        return '<li><span>' + esc(row.name) + '</span>'
          + '<button type="button" data-kick="' + esc(row.sid) + '">Remove</button></li>';
      }).join("");
    }
  }

  function setFailsafeOpen(on) {
    var panel = document.getElementById("failsafe");
    if (!panel) return;
    panel.hidden = !on;
    document.body.classList.toggle("is-failsafes", !!on);
    if (on) {
      paintFailsafeStatus();
      failsafeLog("");
    }
  }

  function paintLive() {
    if (!liveBtn) return;
    var on = DeckSync.isPresenting();
    var st = DeckSync.getStatus();
    liveBtn.setAttribute("aria-pressed", on ? "true" : "false");
    liveBtn.classList.toggle("on", on);
    liveBtn.textContent = on ? "End live" : "Go live";
    document.body.classList.toggle("is-live", on);
    var note = document.getElementById("live-status");
    if (note) {
      var local = DeckSync.isLocalOnly && DeckSync.isLocalOnly();
      if (local) {
        note.textContent = on ? "This computer only" : "Rehearsal";
        note.className = "live-status warn";
      } else if (on && !st.phones) {
        note.textContent = "Phones may still be on Hold";
        note.className = "live-status warn";
      } else if (on) {
        note.textContent = st.detail || "Phones can join";
        note.className = "live-status";
      } else {
        note.textContent = st.live ? (st.detail || "Ready") : "Connecting…";
        note.className = "live-status";
      }
    }
    var fs = document.getElementById("failsafe");
    if (fs && !fs.hidden) paintFailsafeStatus();
    paintSeated();
  }

  function fsElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function paintFullScreen() {
    var btn = document.getElementById("fs-btn");
    var native = !!fsElement();
    var fallback = document.body.classList.contains("is-fs-fallback");
    if (native) document.body.classList.remove("is-fs-fallback");
    document.body.classList.toggle("is-fs", fallback && !native);
    if (!btn) return;
    var on = native || fallback;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.textContent = on ? "Exit" : "Full screen";
  }

  function enterFullScreen(el) {
    try {
      if (el.requestFullscreen) {
        try {
          return el.requestFullscreen({ navigationUI: "hide" });
        } catch (err) {
          return el.requestFullscreen();
        }
      }
      if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
        return Promise.resolve();
      }
    } catch (e) {
      return Promise.reject(e);
    }
    return Promise.reject(new Error("no fullscreen"));
  }

  function exitFullScreen() {
    if (fsElement() && document.exitFullscreen) return document.exitFullscreen();
    if (fsElement() && document.webkitExitFullscreen) return document.webkitExitFullscreen();
    document.body.classList.remove("is-fs", "is-fs-fallback");
  }

  function bindFullScreen() {
    var btn = document.getElementById("fs-btn");
    if (!btn) return;
    function go() {
      if (fsElement() || document.body.classList.contains("is-fs-fallback") || document.body.classList.contains("is-fs")) {
        Promise.resolve(exitFullScreen()).catch(function () {
          document.body.classList.remove("is-fs", "is-fs-fallback");
        }).then(paintFullScreen);
        paintFullScreen();
        return;
      }
      var board = document.querySelector(".role-pres .board") || document.documentElement;
      Promise.resolve(enterFullScreen(board)).then(paintFullScreen).catch(function () {
        return Promise.resolve(enterFullScreen(document.documentElement)).then(paintFullScreen).catch(function () {
          document.body.classList.add("is-fs", "is-fs-fallback");
          paintFullScreen();
        });
      });
    }
    btn.addEventListener("click", go);
    document.addEventListener("fullscreenchange", paintFullScreen);
    document.addEventListener("webkitfullscreenchange", paintFullScreen);
    paintFullScreen();
  }

  if (!isPres) {
    DeckSync.onPresenting(function (on) {
      if (on && DeckSync.seated()) render(DeckSync.getSlide());
      else if (!on) waitScreen();
    });
    DeckSync.resumeSeat();
    if (DeckSync.isPresenting() && DeckSync.seated()) render(DeckSync.getSlide());
    DeckSync.onKick(function () {
      kickNotice = "You were removed. Find your name again to come back.";
      draft = { name: "", face: null, q: "", step: "name" };
      waitScreen();
    });
    setInterval(function () {
      if (DeckSync.isPresenting() && DeckSync.seated()) {
        var n = DeckSync.getSlide();
        if (document.body.classList.contains("is-hold") || document.body.classList.contains("is-waiting") || document.body.classList.contains("is-checkin") || lastIndex !== n) {
          render(n);
        }
        return;
      }
      if (!DeckSync.isPresenting() && DeckSync.seated() && !document.body.classList.contains("is-hold")) waitScreen();
      else if (!DeckSync.seated() && !document.body.classList.contains("is-checkin")) waitScreen();
    }, 700);
    if (handBtn) handBtn.addEventListener("click", function () {
      DeckSync.raise(!DeckSync.handUp());
      paintHandBtn();
    });
    DeckSync.onHands(paintHandBtn);
    DeckSync.onSeats(function () {
      if (document.body.classList.contains("is-hold")) paintHoldPeers();
      if (document.body.classList.contains("is-checkin-face") && draft.name && DeckSync.takenNames()[draft.name]) {
        draft.step = "name";
        checkIn();
        return;
      }
      if (document.body.classList.contains("is-checkin-name")) fillNames();
    });
  } else {
    DeckSync.onPresenting(paintLive);
    DeckSync.onStatus(paintLive);
    var joinChip = document.getElementById("join-chip");
    if (joinChip) {
      var href = joinHref();
      joinChip.textContent = href.replace(/^https:\/\//, "");
    }

    document.querySelectorAll(".brand-mark").forEach(function (el) {
      el.textContent = brand();
    });
    if (liveBtn) liveBtn.addEventListener("click", function () {
      if (DeckSync.isPresenting()) DeckSync.standDown();
      else if (DeckSync.pushLive) DeckSync.pushLive().then(paintLive);
      else DeckSync.present();
    });
    bindFullScreen();
    DeckSync.onSeats(paintSeated);
    DeckSync.onHands(paintHands);
    var fsOpen = document.getElementById("failsafe-open");
    var fsClose = document.getElementById("failsafe-close");
    var fsPanel = document.getElementById("failsafe");
    if (fsOpen) fsOpen.addEventListener("click", function () { setFailsafeOpen(true); });
    if (fsClose) fsClose.addEventListener("click", function () { setFailsafeOpen(false); });
    if (fsPanel) fsPanel.addEventListener("click", function (e) {
      if (e.target === fsPanel) setFailsafeOpen(false);
    });
    var fsPush = document.getElementById("fs-push");
    if (fsPush) fsPush.addEventListener("click", function () {
      failsafeLog("Pushing Go live…");
      DeckSync.pushLive().then(function (res) {
        paintLive();
        paintFailsafeStatus();
        failsafeLog(res.ok
          ? "Firebase has Go live. Phones should leave Hold within a second."
          : ("Push failed. " + (res.error || "Try Test phone paths.")));
      });
    });
    var fsSlide = document.getElementById("fs-slide");
    if (fsSlide) fsSlide.addEventListener("click", function () {
      DeckSync.republish();
      paintFailsafeStatus();
      failsafeLog("Sent slide " + (DeckSync.getSlide() + 1) + " again.");
    });
    var fsTitle = document.getElementById("fs-title");
    if (fsTitle) fsTitle.addEventListener("click", function () {
      DeckSync.setSlide(0);
      paintFailsafeStatus();
      failsafeLog("Sent everyone to the title slide.");
    });
    var fsProbe = document.getElementById("fs-probe");
    if (fsProbe) fsProbe.addEventListener("click", function () {
      failsafeLog("Testing Firebase and ntfy…");
      DeckSync.probe().then(function (res) {
        paintFailsafeStatus();
        var fb = res.firebase || {};
        var nt = res.ntfy || {};
        var lines = [
          "Firebase write: " + (fb.write ? "ok" : "failed"),
          "Firebase read: " + (fb.read ? "ok" : "failed"),
          "ntfy: " + (nt.skipped ? "skipped (rehearsal)" : (nt.ok ? "ok" : "blocked")),
          fb.error ? "Firebase error: " + fb.error : "",
          res.snap && res.snap.localOnly ? "Rehearsal ?local=1 is on, so remove it for class." : ""
        ].filter(Boolean);
        failsafeLog(lines.join("\n"));
      });
    });
    var fsPull = document.getElementById("fs-pull");
    if (fsPull) fsPull.addEventListener("click", function () {
      failsafeLog("Pulling room…");
      DeckSync.pullRoom().then(function (ok) {
        paintLive();
        paintFailsafeStatus();
        failsafeLog(ok ? "Reloaded seats, answers, and Go live from Firebase." : "Pull failed. Test phone paths.");
      });
    });
    var fsSeats = document.getElementById("fs-seats");
    if (fsSeats) fsSeats.addEventListener("click", function () {
      failsafeLog("Clearing leftover names…");
      DeckSync.clearSeats().then(function (ok) {
        paintFailsafeStatus();
        failsafeLog(ok ? "Seat list cleared. People can check in again." : "Could not clear seats. Test phone paths.");
      });
    });
    var fsEnd = document.getElementById("fs-end");
    if (fsEnd) fsEnd.addEventListener("click", function () {
      DeckSync.standDown();
      paintLive();
      paintFailsafeStatus();
      failsafeLog("Room ended. Phones should return to Hold.");
    });
    var fsCopy = document.getElementById("fs-copy");
    if (fsCopy) fsCopy.addEventListener("click", function () {
      var text = JSON.stringify(DeckSync.snapshot(), null, 2);
      function done(ok) { failsafeLog(ok ? "Status copied." : text); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }).catch(function () { done(false); });
      } else done(false);
    });
    document.body.addEventListener("click", function (e) {
      var b = e.target.closest("[data-kick]");
      if (!b) return;
      e.preventDefault();
      var kickedSid = b.getAttribute("data-kick");
      var row = DeckSync.getSeats().filter(function (r) { return r.sid === kickedSid; })[0];
      var who = row ? row.name : "this person";
      if (!confirm("Remove " + who + "? Their phone goes back to check-in and they have to start over.")) return;
      DeckSync.kick(kickedSid);
      paintSeated();
      paintFailsafeStatus();
      failsafeLog("Removed " + who + ". They have to check in again.");
    });
    var fsUnkick = document.getElementById("fs-unkick");
    if (fsUnkick) fsUnkick.addEventListener("click", function () {
      DeckSync.unkickAll();
      paintFailsafeStatus();
      failsafeLog("Cleared removals. Anyone can check in again.");
    });
  }
  DeckSync.onResponses(function (id, list) {
    var i = DeckSync.getSlide();
    if (String(i) !== String(id)) return;
    var s = slides[i];
    if (!s || s.type !== "prompt") return;
    if (isPres) {
      paintResponses(s, i, list);
      return;
    }
    if (!DeckSync.isDone(String(i)) && stage.querySelector(".thanks")) render(i);
  });
  if (isPres) {
    document.addEventListener("keydown", function (e) {
      if (!unlocked()) return;
      if (document.body.classList.contains("is-failsafes")) {
        if (e.key === "Escape") { e.preventDefault(); setFailsafeOpen(false); }
        return;
      }
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        go(DeckSync.getSlide() + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(DeckSync.getSlide() - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        go(0);
      } else if (e.key === "End") {
        e.preventDefault();
        go(slides.length - 1);
      }
    });
    if (prevBtn) prevBtn.addEventListener("click", function () { go(DeckSync.getSlide() - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(DeckSync.getSlide() + 1); });
    if (resetBtn) resetBtn.addEventListener("click", function () { DeckSync.reset(String(DeckSync.getSlide())); });
    if (wipeBtn) wipeBtn.addEventListener("click", function () {
      if (confirm("Clear every answer from this session?")) DeckSync.wipe();
    });
  }

  function bindReading() {
    if (isPres) return;
    var settings = cfg();
    var article = settings.articleUrl || "";
    var embed = settings.articleEmbed || "";
    var bound = false;
    if (!article && !embed) return;

    function wantDesk() {
      if (/\/desk(\/|$)/.test(location.pathname)) return true;
      return !!(window.matchMedia && matchMedia("(min-width: 960px)").matches);
    }

    function mount() {
      var on = wantDesk();
      document.documentElement.classList.toggle("is-desk", on);
      document.body.classList.toggle("is-desk", on);
      if (!on) return;
      if (document.getElementById("reading")) {
        bindOnce();
        return;
      }
      var aside = document.createElement("aside");
      aside.className = "reading";
      aside.id = "reading";
      aside.innerHTML = '<div class="reading-bar">'
        + "<p>" + esc(settings.articleBar || "Reading") + "</p>"
        + '<div class="reading-actions">'
        + '<button type="button" id="reading-hide">Hide article</button>'
        + '<a id="reading-open" href="' + esc(article || embed) + '" target="_blank" rel="noopener">' + esc(settings.articleLabel || "Open the reading") + "</a>"
        + "</div></div>"
        + '<p class="reading-wait" id="reading-wait">Loading the piece...</p>'
        + '<iframe id="article-frame" title="Reading" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms" referrerpolicy="no-referrer-when-downgrade" src="' + esc(embed || article) + '"></iframe>';
      document.body.appendChild(aside);
      bindOnce();
    }

    function bindOnce() {
      if (bound) return;
      var hide = document.getElementById("reading-hide");
      var wait = document.getElementById("reading-wait");
      var frame = document.getElementById("article-frame");
      var open = document.getElementById("reading-open");
      if (open) open.href = article;
      if (frame && !frame.getAttribute("src")) frame.src = embed;
      if (hide) {
        hide.addEventListener("click", function () {
          var off = document.body.classList.toggle("reading-off");
          document.documentElement.classList.toggle("reading-off", off);
          hide.textContent = off ? "Show article" : "Hide article";
        });
      }
      if (frame && wait) {
        frame.addEventListener("load", function () { wait.hidden = true; });
        setTimeout(function () { if (wait) wait.hidden = true; }, 8000);
      }
      bound = true;
    }

    mount();
    if (window.matchMedia) {
      var mq = matchMedia("(min-width: 960px)");
      if (mq.addEventListener) mq.addEventListener("change", mount);
      else if (mq.addListener) mq.addListener(mount);
    }
  }
  bindReading();
})();
