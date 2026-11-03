(function () {
  function slides() { return window.SLIDES || []; }
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
  var kickNotice = "";
  var pendingSubmissions = {};

  function cfg() { return window.DECK || {}; }
  function brand() { return cfg().title || "Discussion"; }
  function joinHref() {
    if (cfg().joinUrl) return String(cfg().joinUrl);
    var path = location.pathname.replace(/[^/]+$/, "");
    if (path.slice(-1) !== "/") path += "/";
    return location.origin + path;
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
    n = Math.max(0, Math.min(slides().length - 1, n));
    if (isPres) DeckSync.setSlide(n);
    else if (DeckSync.isPresenting()) render(n);
  }

  function waitScreen() {
    if (DeckSync.seated()) {
      if (onBoard()) return;
      if (document.body.classList.contains("is-hold")) {
        paintHoldPeers();
        return;
      }
      holdRoom();
      paintMe();
      paintHandBtn();
      return;
    }
    document.body.classList.add("is-waiting");
    document.body.classList.remove("is-hold", "is-checkin", "is-checkin-name", "is-checkin-face");
    document.title = brand();
    kicker.textContent = brand();
    counter.textContent = "";
    stage.classList.remove("prompt", "stats", "title", "hold", "compare", "charts", "story", "points");
    stage.classList.add("waiting");
    lastIndex = -1;
    checkIn();
    paintMe();
    paintHandBtn();
  }

  function holdPeersInner() {
    var n = DeckSync.getSeats().length;
    return n <= 1 ? "Just you for now" : n + " here";
  }

  function paintHoldPeers() {
    var host = document.getElementById("hold-peers");
    if (!host) return;
    host.innerHTML = holdPeersInner();
  }

  function holdRoom() {
    document.body.classList.remove("is-checkin", "is-checkin-name", "is-checkin-face");
    document.body.classList.add("is-hold");
    stage.classList.remove("title");
    stage.classList.add("hold");
    stage.innerHTML = '<div class="hold-card">'
      + '<p class="wait-kicker">You\'re in</p>'
      + '<p class="lede">The room has not started.</p>'
      + '<div class="hold-peers hold-count" id="hold-peers">' + holdPeersInner() + "</div>"
      + '<button type="button" class="not-you" id="not-you">Leave</button>'
      + "</div>";
    var back = document.getElementById("not-you");
    if (back) back.addEventListener("click", function () {
      DeckSync.standUp();
      checkIn();
    });
  }

  function checkIn() {
    document.body.classList.add("is-checkin");
    document.body.classList.remove("is-hold", "is-checkin-name", "is-checkin-face");
    stage.classList.remove("title", "hold");
    stage.innerHTML = (kickNotice ? '<p class="kick-banner">' + esc(kickNotice) + "</p>" : "")
      + '<div class="in-card">'
      + '<p class="wait-kicker">' + esc(brand()) + "</p>"
      + '<button type="button" class="in-btn" id="seat">I\'m in</button>'
      + "</div>";
    bindCheckIn();
  }

  function bindCheckIn() {
    var seat = document.getElementById("seat");
    if (seat) seat.addEventListener("click", function () {
      if (!DeckSync.sit()) return;
      if (DeckSync.isPresenting()) render(DeckSync.getSlide());
      else holdRoom();
    });
  }

  function onBoard() {
    return !!(stage && stage.innerHTML
      && !document.body.classList.contains("is-waiting")
      && !document.body.classList.contains("is-hold")
      && !document.body.classList.contains("is-checkin"));
  }

  function render(i, force) {
    var s = slides()[i];
    if (!s) return;
    var changed = i !== lastIndex;
    var keepBoard = !force && !changed && onBoard();
    lastIndex = i;
    document.body.classList.remove("is-waiting", "is-checkin", "is-checkin-name", "is-checkin-face", "is-hold");
    stage.classList.remove("hold");
    stage.setAttribute("data-chart", s.chart && s.chart.id ? String(s.chart.id) : "");
    stage.setAttribute("data-slide-id", s.id || "");
    document.title = (isPres ? "Presenter · " : "") + (s.title || brand());
    if (kicker) {
      kicker.textContent = "";
      kicker.hidden = true;
    }
    paintBanner(s);
    if (counter) {
      var n = String(i + 1);
      counter.textContent = isPres ? n : (n + " / " + slides().length);
    }
    if (resetBtn) resetBtn.hidden = s.type !== "prompt";
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i === slides().length - 1;
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
    stage.classList.toggle("has-split", !!(s.claims || s.chart || s.stats || s.names));
    stage.classList.toggle("has-drag", s.input === "rank" || s.input === "place");
    if (changed) {
      stage.classList.remove("fade");
      void stage.offsetWidth;
      stage.classList.add("fade");
      var onFade = function () {
        stage.classList.remove("fade");
        stage.removeEventListener("animationend", onFade);
      };
      stage.addEventListener("animationend", onFade);
      setTimeout(onFade, 360);
    }
    if (keepBoard) {
      if (isPres && s.type === "prompt") {
        paintResponses(s, i, DeckSync.getResponses(String(i)));
        showViz(s);
      }
      paintMe();
      paintHandBtn();
      return;
    }
    stage.innerHTML = htmlFor(s, i);
    bind(s, i);
    if (isPres && s.type === "prompt") {
      paintResponses(s, i, DeckSync.getResponses(String(i)));
      showViz(s);
    }
    paintMe();
    paintHandBtn();
    fitStage();
  }

  function seatedHtml() {
    if (!isPres) return "";
    var list = DeckSync.getSeats();
    return '<div class="seated" id="seated">'
      + '<p class="seated-count">' + list.length + (list.length === 1 ? " here" : " here") + "</p>"
      + "</div>";
  }

  function whoHtml() {
    return "";
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

  function kickerHtml(s) {
    if (!s || !s.kicker) return "";
    return '<p class="slide-kicker">' + esc(s.kicker) + "</p>";
  }

  function paintBanner(s) {
    var el = document.getElementById("uga-kicker");
    if (el) el.textContent = (s && s.kicker) || "";
    var bar = document.getElementById("from-class");
    if (!bar) return;
    var fc = s && s.fromClass;
    if (!fc || !fc.body) {
      bar.hidden = true;
      bar.innerHTML = "";
      return;
    }
    bar.hidden = false;
    bar.innerHTML = (fc.week != null ? '<span class="from-class-week">Week ' + esc(fc.week) + "</span>" : "")
      + '<span class="from-class-body">' + esc(fc.body) + "</span>";
  }

  function titleRuleHtml() {
    return '<span class="title-rule" aria-hidden="true"></span>';
  }

  function scaleMark(n) {
    var on = Number(n) || 0;
    var bits = "";
    var i;
    for (i = 1; i <= 4; i++) {
      bits += "<span" + (i <= on ? ' class="is-on"' : "") + ">" + i + "</span>";
    }
    return '<div class="score-steps" aria-hidden="true">' + bits + "</div>";
  }

  function fitMark(val) {
    var n = Math.abs(parseFloat(val));
    if (!isFinite(n)) n = 0;
    var pct = Math.max(8, Math.min(100, n <= 1 ? n * 100 : n));
    return '<div class="fit-meter" aria-hidden="true"><i style="width:' + pct + '%"></i></div>';
  }

  function figSplitHtml() {
    return '<div class="fig-pane" aria-hidden="true">'
      + '<div class="fig-split">'
      + '<div class="fig-col wide"><span class="fig-track"><i style="height:78%"></i></span><em>7</em></div>'
      + '<div class="fig-col mid"><span class="fig-track"><i style="height:28%"></i></span><em>2</em></div>'
      + '<div class="fig-col is-on"><span class="fig-track"><i style="height:16%"></i></span><em>1</em></div>'
      + "</div></div>";
  }

  function fitSplitHtml() {
    return '<div class="fig-pane fit-pane" aria-hidden="true">'
      + '<div class="fig-split">'
      + '<div class="fig-col wide"><span class="fig-track"><i style="height:78%"></i></span><em>.56</em></div>'
      + '<div class="fig-col"><span class="fig-track"><i style="height:14%"></i></span><em>.07</em></div>'
      + '<div class="fig-col"><span class="fig-track"><i style="height:10%"></i></span><em>.01</em></div>'
      + "</div></div>";
  }

  function revoltTilesHtml() {
    return '<div class="revolt-tiles" aria-hidden="true">'
      + '<div class="revolt-tile">'
      + '<svg viewBox="0 0 54 36"><rect width="18" height="36" fill="#16324f"/><rect x="18" width="18" height="36" fill="#fffdf7"/><rect x="36" width="18" height="36" fill="#ba0c2f"/></svg>'
      + "<b>France</b></div>"
      + '<div class="revolt-tile">'
      + '<svg viewBox="0 0 54 36"><rect width="54" height="12" fill="#fffdf7"/><rect y="12" width="54" height="12" fill="#16324f"/><rect y="24" width="54" height="12" fill="#ba0c2f"/></svg>'
      + "<b>Russia</b></div>"
      + '<div class="revolt-tile">'
      + '<svg viewBox="0 0 54 36"><rect width="54" height="36" fill="#ba0c2f"/><polygon points="27,6 30,16 41,16 32,22 35,32 27,26 19,32 22,22 13,16 24,16" fill="#f3d89a"/></svg>'
      + "<b>China</b></div>"
      + "</div>";
  }

  function yearChartHtml() {
    return '<div class="year-chart" aria-hidden="true">'
      + '<div class="year-col"><b style="height:84%"></b><strong>84</strong><span>1955</span></div>'
      + '<div class="year-col"><b style="height:8%"></b><strong>5</strong><span>1960</span></div>'
      + '<div class="year-col is-on"><b style="height:12%"></b><strong>10</strong><span>1961</span></div>'
      + "</div>";
  }

  function artHtml(s) {
    if (!s) return "";
    if (s.id === "ask") {
      return '<div class="art-panel art-ask" aria-hidden="true">'
        + '<svg viewBox="0 0 220 220">'
        + '<rect x="28" y="18" width="130" height="170" rx="14" fill="#fffdf7"/>'
        + '<rect x="48" y="42" width="90" height="10" rx="5" fill="#d5ddd0"/>'
        + '<rect x="48" y="64" width="72" height="10" rx="5" fill="#d5ddd0"/>'
        + '<rect x="48" y="86" width="82" height="10" rx="5" fill="#d5ddd0"/>'
        + '<circle cx="168" cy="168" r="34" fill="#ba0c2f"/>'
        + '<text x="168" y="182" text-anchor="middle" fill="#fffdf7" font-size="42" font-family="Oswald, sans-serif">?</text>'
        + "</svg></div>";
    }
    if (s.id === "habit") {
      return '<div class="art-panel art-habit" aria-hidden="true">'
        + '<svg viewBox="0 0 220 220">'
        + '<circle cx="28" cy="36" r="12" fill="#f3ead4"/><circle cx="62" cy="36" r="12" fill="#f3ead4"/>'
        + '<circle cx="96" cy="36" r="12" fill="#f3ead4"/><circle cx="130" cy="36" r="12" fill="#f3ead4"/>'
        + '<circle cx="164" cy="36" r="12" fill="#f3ead4"/><circle cx="198" cy="36" r="12" fill="#f3ead4"/>'
        + '<rect x="46" y="78" width="128" height="64" rx="14" fill="none" stroke="#ba0c2f" stroke-width="5"/>'
        + '<circle cx="82" cy="110" r="16" fill="#f3d89a"/><circle cx="138" cy="110" r="16" fill="#f3d89a"/>'
        + '<circle cx="48" cy="192" r="10" fill="#8b93a0"/><circle cx="86" cy="192" r="10" fill="#8b93a0"/>'
        + '<circle cx="124" cy="192" r="10" fill="#8b93a0"/><circle cx="162" cy="192" r="10" fill="#8b93a0"/>'
        + "</svg></div>";
    }
    if (s.id === "close") {
      return '<div class="art-panel art-close" aria-hidden="true">'
        + '<svg viewBox="0 0 220 220">'
        + '<rect x="12" y="10" width="196" height="60" rx="16" fill="#fffdf7"/>'
        + '<rect x="12" y="80" width="196" height="60" rx="16" fill="#f3ead4"/>'
        + '<rect x="12" y="150" width="196" height="60" rx="16" fill="#d5ddd0"/>'
        + '<circle cx="52" cy="40" r="18" fill="#16324f"/>'
        + '<circle cx="52" cy="110" r="18" fill="#16324f"/>'
        + '<circle cx="52" cy="180" r="18" fill="#16324f"/>'
        + '<path d="M44 40l6 6 12-13" fill="none" stroke="#f3d89a" stroke-width="4"/>'
        + '<path d="M44 110l6 6 12-13" fill="none" stroke="#f3d89a" stroke-width="4"/>'
        + '<path d="M44 180l6 6 12-13" fill="none" stroke="#f3d89a" stroke-width="4"/>'
        + '<text x="82" y="48" fill="#16324f" font-size="22" font-family="Oswald, sans-serif">Build</text>'
        + '<text x="82" y="118" fill="#16324f" font-size="22" font-family="Oswald, sans-serif">Test</text>'
        + '<text x="82" y="188" fill="#16324f" font-size="22" font-family="Oswald, sans-serif">Time</text>'
        + "</svg></div>";
    }
    if (s.id === "chile") return yearChartHtml();
    return "";
  }

  function windowHtml(kind, title, inner) {
    if (!inner) return "";
    return '<div class="ss-win ss-' + kind + '">'
      + '<div class="ss-win-body">'
      + (title ? '<p class="ss-win-label">' + esc(title) + "</p>" : "")
      + inner + "</div></div>";
  }

  function fitStage() {
    /* Never shrink an entire slide to force overflowing content into view.
       That made text and graphs unreadably small and still clipped on short
       laptop screens. The shared layout stylesheet sizes each board and lets
       the stage scroll internally when a slide genuinely needs more height. */
    if (!stage) return;
    stage.style.transform = "";
    stage.style.transformOrigin = "";
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
        + '<span class="chart-n">' + esc(fmtN(n)) + (chart.unit ? esc(chart.unit) : "") + "</span>"
        + "</div>";
    }).join("");
    var accessible = [chart.title, chart.source, chart.note].filter(Boolean).join(". ");
    var fig = '<figure class="chart" data-chart="' + esc(chart.id || "") + '" role="group" aria-label="' + esc(accessible) + '">'
      + (chart.source || chart.note ? "<figcaption>"
        + (chart.source ? '<p class="chart-source">' + esc(chart.source) + "</p>" : "")
        + (chart.note ? '<p class="chart-note">' + esc(chart.note) + "</p>" : "")
        + "</figcaption>" : "")
      + (chart.plots ? '<div class="plot-panels">' + chart.plots.map(function (p) { return '<section class="plot-panel"><h3>' + esc(p.title) + '</h3><div class="plot-area" role="img" aria-label="' + esc(p.title) + '"><span class="plot-y">Growth</span><span class="plot-x">Labour repression</span>' + p.points.map(function (pt) { return '<i style="left:' + Number(pt[0]) + '%;bottom:' + Number(pt[1]) + '%"></i>'; }).join("") + '</div><p>r² = ' + esc(p.r2) + '</p></section>'; }).join("") + '</div>' : "")
      + (!chart.plots ? '<div class="chart-bars" role="img" aria-label="' + esc(chart.title) + '">' + rows + "</div>" : "")
      + "</figure>";
    if (/^geddes-/.test(chart.id || "")) {
      var figureId = String(chart.id);
      var safeFigureId = /^geddes-(selection|fig[1-6])$/.test(figureId) ? figureId : "";
      return '<div class="figure-embed" data-figure="' + esc(safeFigureId) + '">'
        + fig
        + (safeFigureId ? '<button type="button" class="figure-expand" data-expand-figure="' + esc(safeFigureId) + '" aria-label="Expand ' + esc(chart.title || "figure") + '">Expand figure <span aria-hidden="true">↗</span></button>' : "")
        + '</div>';
    }
    return windowHtml("paper", chart.title || "Table", fig);
  }

  function claimBarsHtml(list) {
    if (!list || !list.length) return "";
    return '<ul class="claim-bars">' + list.map(function (pt) {
      return "<li>"
        + (pt.n ? '<p class="card-n"><span>' + esc(pt.n) + "</span></p>" : "")
        + "<h2>" + esc(pt.title) + "</h2>"
        + (pt.body ? "<p>" + esc(pt.body) + "</p>" : "")
        + (pt.note ? '<p class="fn">' + esc(pt.note) + "</p>" : "")
        + "</li>";
    }).join("") + "</ul>";
  }

  function caseNamesHtml(list, id) {
    if (!list || !list.length) return "";
    if (id === "skocpol") return windowHtml("paper", "Cases", revoltTilesHtml());
    return windowHtml("paper", "Cases", '<ul class="name-stack' + (id === "nics" ? " is-growers" : "") + '">' + list.map(function (n) {
      return "<li>" + esc(n) + "</li>";
    }).join("") + "</ul>");
  }

  function statsStackHtml(list, id) {
    if (!list || !list.length) return "";
    var extra = "";
    if (id === "figure5") extra = figSplitHtml();
    if (id === "fits") extra = fitSplitHtml();
    return windowHtml("paper", "Scores", extra + '<div class="stats-stack">' + list.map(function (st) {
      var mark = id === "scores" ? scaleMark(st.value) : "";
      var val = id === "scores" ? "" : '<div class="value">' + esc(st.value) + "</div>";
      return '<div class="stat' + (id === "scores" ? " is-scale" : "") + '">' + mark + val
        + '<p class="label">' + esc(st.label) + "</p>"
        + (st.source ? '<p class="source">' + esc(st.source) + "</p>" : "")
        + "</div>";
    }).join("") + "</div>");
  }

  function vizHtml(s) {
    if (s.chart) return chartHtml(s.chart);
    if (s.charts && s.charts[0]) return chartHtml(s.charts[0]);
    if (s.stats) return statsStackHtml(s.stats, s.id);
    if (s.names) return caseNamesHtml(s.names, s.id);
    return "";
  }

  function rankHtml(s, withSend) {
    var opts = s.options || [];
    return '<div class="drag-rank" id="drag-rank">'
      + '<ol class="rank-list">'
      + opts.map(function (o, idx) {
        return '<li data-opt="' + esc(o) + '" tabindex="-1"><span class="rank-n">' + (idx + 1) + '</span><span class="rank-lab">' + esc(o) + '</span><span class="rank-controls"><button type="button" data-move="up" aria-label="Move ' + esc(o) + ' up"' + (idx === 0 ? " disabled" : "") + '>↑</button><button type="button" data-move="down" aria-label="Move ' + esc(o) + ' down"' + (idx === opts.length - 1 ? " disabled" : "") + '>↓</button></span></li>';
      }).join("")
      + "</ol>"
      + (withSend ? '<button type="button" class="send" id="drag-send">Send</button>' : "")
      + "</div>";
  }

  function placeHtml(s, withSend) {
    var tokens = s.tokens || [];
    var slots = s.slots || [];
    return '<div class="drag-place" id="drag-place">'
      + '<div class="token-tray" data-home="1">'
      + tokens.map(function (t, idx) {
        var selectId = "place-token-" + idx;
        return '<div class="token-choice" data-token-choice="' + esc(t) + '"><button type="button" class="token" data-token="' + esc(t) + '">' + esc(t) + '</button><label class="sr" for="' + selectId + '">Place ' + esc(t) + '</label><select class="token-place" id="' + selectId + '" data-token-place="' + esc(t) + '"><option value="">Choose a group</option>' + slots.map(function (slot) { return '<option value="' + esc(slot.id) + '">' + esc(slot.label) + '</option>'; }).join("") + '</select></div>';
      }).join("")
      + "</div>"
      + '<div class="slot-row">'
      + slots.map(function (slot) {
        return '<div class="slot" data-slot="' + esc(slot.id) + '"><p class="slot-lab">' + esc(slot.label) + '</p><div class="slot-well"><p class="slot-empty">Nothing here yet</p></div></div>';
      }).join("")
      + "</div>"
      + (withSend ? '<button type="button" class="send" id="drag-send">Send</button>' : "")
      + "</div>";
  }

  function dragHtml(s, withSend) {
    if (s.input === "rank") return rankHtml(s, withSend);
    if (s.input === "place") return placeHtml(s, withSend);
    return "";
  }

  function splitHtml(s) {
    var viz = vizHtml(s);
    var bars = claimBarsHtml(s.claims);
    var art = !viz ? artHtml(s) : "";
    if (!viz && !bars && !art) return "";
    return '<div class="split' + (viz ? " has-viz" : "") + (art ? " has-art" : "") + '">'
      + (viz ? '<div class="split-viz">' + viz + "</div>" : "")
      + (bars ? '<div class="split-side">' + bars + "</div>" : "")
      + (art ? '<div class="split-art">' + art + "</div>" : "")
      + "</div>";
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
      var shown = href.replace(/^https:\/\//, "").replace(/\/$/, "");
      var seats = seatedHtml();
      var join = isPres ? '<div class="title-join-block">'
        + '<p class="title-join"><a href="' + esc(href) + '">' + esc(shown) + '</a></p>'
        + (seats || "")
        + "</div>" : "";
      return '<div class="title-card">'
        + '<div class="title-copy">'
        + '<img class="uga-logo title-logo" src="uga-logo.png" alt="University of Georgia" width="1024" height="158">'
        + kickerHtml(s)
        + "<h1>" + esc(s.title) + "</h1>"
        + titleRuleHtml()
        + (s.byline ? '<p class="title-byline">' + esc(s.byline) + "</p>" : "")
        + (s.presented ? '<p class="title-presented">' + esc(s.presented) + "</p>" : "")
        + "</div>"
        + join
        + "</div>";
    }
    if (s.type === "story") {
      var steps = (s.steps || []).map(function (st) {
        return '<li><span class="step-n">' + esc(st.n) + "</span>"
          + "<div><h2>" + esc(st.title) + "</h2><p>" + esc(st.body) + "</p></div></li>";
      }).join("");
      return kickerHtml(s) + "<h1>" + esc(s.title) + "</h1>"
        + (steps ? '<ol class="steps">' + steps + "</ol>" : "")
        + quoteHtml(s.quote);
    }
    if (s.type === "points") {
      var n = (s.points || []).length;
      var compact = s.layout === "grid" || n >= 10;
      var cols = compact ? "compact" : (n === 4 ? 4 : n === 2 ? 2 : 3);
      var items = (s.points || []).map(function (pt) {
        var filled = String(pt.body || "").trim();
        var body = filled || (isPres ? "[write here]" : "");
        return "<li><h2>" + esc(pt.title) + "</h2>"
          + (body ? "<p" + (filled ? "" : " class=\"empty\"") + ">" + esc(body) + "</p>" : "")
          + "</li>";
      }).join("");
      return kickerHtml(s) + "<h1>" + esc(s.title) + "</h1>"
        + (s.lead ? '<p class="lead">' + esc(s.lead) + "</p>" : "")
        + (items ? '<ul class="points cols-' + cols + '">' + items + "</ul>" : "")
        + (s.note ? '<p class="note">' + esc(s.note) + "</p>" : "")
        + quoteHtml(s.quote);
    }
    if (s.type === "claims") {
      return kickerHtml(s) + "<h1>" + esc(s.title) + "</h1>"
        + (s.lead ? '<p class="lead">' + esc(s.lead) + "</p>" : "")
        + splitHtml(s)
        + (s.note ? '<p class="note">' + esc(s.note) + "</p>" : "")
        + quoteHtml(s.quote);
    }
    if (s.type === "compare") {
      return kickerHtml(s) + "<h1>" + esc(s.title) + "</h1>"
        + (s.lead ? '<p class="lead">' + esc(s.lead) + "</p>" : "")
        + '<div class="pair-row">' + pairHtml(s.left, "left") + pairHtml(s.right, "right") + "</div>"
        + (s.callout ? '<p class="callout">' + esc(s.callout) + "</p>" : "")
        + quoteHtml(s.quote);
    }
    if (s.type === "charts") {
      var figs = (s.charts || []).map(chartHtml).join("");
      return kickerHtml(s) + "<h1>" + esc(s.title) + "</h1>"
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
      return kickerHtml(s) + "<h1>" + esc(s.title) + "</h1>"
        + '<div class="stats-grid">' + cards + "</div>"
        + (s.footer ? '<p class="footer-line">' + esc(s.footer) + "</p>" : "");
    }
    if (s.type === "content") {
      var body = (s.body || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
      return kickerHtml(s) + "<h1>" + esc(s.title) + "</h1>"
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
    var q = kickerHtml(s) + "<h1>" + esc(s.title) + "</h1>"
      + (s.lead ? '<p class="lead">' + esc(s.lead) + "</p>" : "")
      + splitHtml(s)
      + quoteHtml(s.quote)
      + articleHtml(s)
      + recap
      + (DeckSync.isDone(String(i)) ? "" : youHtml(s))
      + (s.help ? '<p class="help">' + esc(s.help) + "</p>" : "");
    var askLine = s.ask ? '<p class="ask-q">' + esc(s.ask) + "</p>" : "";
    var optPreview = (s.options && s.options.length && s.input !== "rank" && s.input !== "place")
      ? '<ul class="talk opt-preview presenter-choice-preview">' + s.options.map(function (o) {
        return "<li>" + esc(o) + "</li>";
      }).join("") + "</ul>"
      : "";
    if (isPres && (s.input === "place" || s.input === "rank")) {
      return '<div class="ask">' + kickerHtml(s) + "<h1>" + esc(s.title) + "</h1>" + "</div>"
        + '<div class="split has-viz">'
        + '<div class="split-viz">' + vizHtml(s) + "</div>"
        + '<div class="split-side">'
        + windowHtml("term", "Room responses", '<div id="viz"></div>')
        + "</div></div>";
    }
    if (isPres) {
      return '<div class="ask">' + q + '</div><div class="ask-panel">'
        + windowHtml("term", "Room responses", askLine + optPreview + '<div id="viz"></div>')
        + "</div>";
    }
    var inner = '<div class="ask">' + q + "</div>";
    var panel = function (html) {
      return inner + '<div class="ask-panel">' + askLine + html + "</div>";
    };
    if (DeckSync.isDone(String(i))) {
      var savedAnswer = mine(s.recall || s.id) || {};
      var receipt = '<div class="submission-receipt"><p class="receipt-kicker">Response received</p>';
      if (savedAnswer.choice) receipt += '<p><strong>Your choice</strong>' + esc(savedAnswer.choice) + "</p>";
      if (savedAnswer.text) receipt += '<p><strong>Your reason</strong>' + esc(savedAnswer.text) + "</p>";
      receipt += '<p class="thanks">Your answer has been sent to the presenter. You can wait here until the next slide.</p></div>';
      return panel(receipt);
    }
    if (s.input === "text") {
      return panel(
        '<form class="answer" id="form">'
        + '<label class="sr" for="ans">Your answer</label>'
        + '<textarea id="ans" required maxlength="800" placeholder="Your answer"></textarea>'
        + '<button class="send" type="submit">Send</button></form>'
      );
    }
    if (s.input === "choice" || s.input === "scale") {
      var labs = s.scaleLabels || [];
      return panel(
        '<div class="choices ' + (s.input === "scale" ? "scale" : "") + '" id="choices">'
        + (s.options || []).map(function (o) {
          return '<button type="button" data-choice="' + esc(o) + '">' + esc(o) + "</button>";
        }).join("")
        + "</div>"
        + (labs.length ? '<div class="scale-labels"><span>' + esc(labs[0]) + "</span><span>" + esc(labs[1] || "") + "</span></div>" : "")
      );
    }
    if (s.input === "choice-text") {
      return panel(
        '<div class="choices" id="choices" tabindex="-1">'
        + (s.options || []).map(function (o) {
          return '<button type="button" data-choice="' + esc(o) + '">' + esc(o) + "</button>";
        }).join("")
        + "</div>"
        + '<form class="answer" id="form">'
        + '<textarea id="ans" maxlength="800"' + (s.requireText ? " required" : "") + ' placeholder="' + esc((s.placeholder && s.placeholder !== "[write here]") ? s.placeholder : "Say why if you want") + '"></textarea>'
        + '<button class="send" type="submit">Send</button></form>'
      );
    }
    if (s.input === "rank" || s.input === "place") {
      return panel(dragHtml(s, true));
    }
    return panel("");
  }

  function numberRanks(list) {
    var items = list.querySelectorAll("[data-opt]");
    for (var n = 0; n < items.length; n++) {
      var mark = items[n].querySelector(".rank-n");
      if (mark) mark.textContent = String(n + 1);
    }
  }

  function paintRankControls(list) {
    var items = list.querySelectorAll("[data-opt]");
    Array.prototype.forEach.call(items, function (li, idx) {
      var up = li.querySelector('[data-move="up"]');
      var down = li.querySelector('[data-move="down"]');
      if (up) up.disabled = idx === 0;
      if (down) down.disabled = idx === items.length - 1;
    });
  }

  function bindRank(s, i, canSend) {
    if (!canSend || isPres) return;
    var list = document.querySelector("#drag-rank .rank-list");
    if (!list) return;
    var held = null;
    function move(e) {
      if (!held) return;
      var over = document.elementFromPoint(e.clientX, e.clientY);
      var li = over && over.closest("[data-opt]");
      if (!li || li === held || !list.contains(li)) return;
      var rect = li.getBoundingClientRect();
      list.insertBefore(held, e.clientY < rect.top + rect.height / 2 ? li : li.nextSibling);
      numberRanks(list);
    }
    function endDrag() {
      if (!held) return;
      held.classList.remove("is-dragging");
      held = null;
      numberRanks(list);
      paintRankControls(list);
    }
    list.addEventListener("click", function (e) {
      var move = e.target.closest("button[data-move]");
      if (!move) return;
      var li = move.closest("[data-opt]");
      if (!li) return;
      var direction = move.getAttribute("data-move");
      if (direction === "up" && li.previousElementSibling) list.insertBefore(li, li.previousElementSibling);
      if (direction === "down" && li.nextElementSibling) list.insertBefore(li.nextElementSibling, li);
      numberRanks(list);
      paintRankControls(list);
    });
    list.addEventListener("pointerdown", function (e) {
      if (e.target.closest("button")) return;
      var li = e.target.closest("[data-opt]");
      if (!li) return;
      held = li;
      li.classList.add("is-dragging");
      try { li.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });
    list.addEventListener("pointermove", move);
    list.addEventListener("pointerup", endDrag);
    list.addEventListener("pointercancel", endDrag);
    var send = document.getElementById("drag-send");
    if (send && canSend) {
      send.addEventListener("click", function () {
        var order = [].map.call(list.querySelectorAll("[data-opt]"), function (li) {
          return li.getAttribute("data-opt");
        });
        if (!order.length) return;
        submit(s, i, { choice: order[0], text: order.join(" > ") });
      });
    }
  }

  function bindPlace(s, i, canSend) {
    if (!canSend || isPres) return;
    var board = document.getElementById("drag-place");
    if (!board) return;
    var held = null;
    var grabX = 0;
    var grabY = 0;
    var lastX = 0;
    var lastY = 0;
    function wellAt(x, y) {
      var el = document.elementFromPoint(x, y);
      if (!el || !board.contains(el)) return null;
      var well = el.closest(".slot-well, .token-tray");
      if (well) return well;
      var slot = el.closest(".slot");
      return slot ? slot.querySelector(".slot-well") : null;
    }
    function lift(tok, x, y) {
      var pair = tok.closest(".token-choice") || tok;
      var rect = pair.getBoundingClientRect();
      grabX = x - rect.left;
      grabY = y - rect.top;
      pair.classList.add("is-dragging");
      pair.style.position = "fixed";
      pair.style.left = rect.left + "px";
      pair.style.top = rect.top + "px";
      pair.style.width = rect.width + "px";
      pair.style.zIndex = "20";
      pair.style.pointerEvents = "none";
      return pair;
    }
    function follow(x, y) {
      if (!held) return;
      lastX = x;
      lastY = y;
      held.style.left = (x - grabX) + "px";
      held.style.top = (y - grabY) + "px";
    }
    function drop(x, y) {
      if (!held) return;
      var well = wellAt(x, y) || wellAt(lastX, lastY);
      held.classList.remove("is-dragging");
      held.style.position = "";
      held.style.left = "";
      held.style.top = "";
      held.style.width = "";
      held.style.zIndex = "";
      held.style.pointerEvents = "";
      if (well) well.appendChild(held);
      var select = held.querySelector("[data-token-place]");
      if (select) select.value = well && well.closest(".slot") ? well.closest(".slot").getAttribute("data-slot") : "";
      held = null;
    }
    board.addEventListener("pointerdown", function (e) {
      var tok = e.target.closest(".token");
      if (!tok) return;
      held = lift(tok, e.clientX, e.clientY);
      try { tok.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });
    function onMove(e) {
      if (!held) return;
      follow(e.clientX, e.clientY);
    }
    board.addEventListener("pointermove", onMove);
    board.addEventListener("pointerup", function (e) {
      drop(e.clientX, e.clientY);
    });
    board.addEventListener("pointercancel", function () {
      if (!held) return;
      drop(-1, -1);
    });
    board.addEventListener("change", function (e) {
      var select = e.target.closest("select[data-token-place]");
      if (!select) return;
      var pair = select.closest(".token-choice");
      if (!pair) return;
      var target = select.value
        ? board.querySelector('.slot[data-slot="' + select.value + '"] .slot-well')
        : board.querySelector(".token-tray");
      if (target) target.appendChild(pair);
    });
    var send = document.getElementById("drag-send");
    if (send && canSend) {
      send.addEventListener("click", function () {
        var slots = s.slots || [];
        var rows = [];
        var keySlot = "";
        slots.forEach(function (slot) {
          var well = board.querySelector('.slot[data-slot="' + slot.id + '"] .slot-well');
          if (!well) return;
          [].forEach.call(well.querySelectorAll(".token"), function (tok) {
            var name = tok.getAttribute("data-token") || "";
            rows.push(name + " → " + slot.label);
            if (name === s.placeKey) keySlot = slot.label;
          });
        });
        if (rows.length < (s.tokens || []).length) return;
        submit(s, i, { choice: keySlot || rows[0], text: rows.join("; "), kind: "place", bin: "place" });
      });
    }
  }

  function ensureFigureViewer() {
    if (document.getElementById("figure-viewer")) return;
    var viewer = document.createElement("div");
    viewer.id = "figure-viewer";
    viewer.className = "figure-viewer";
    viewer.hidden = true;
    viewer.setAttribute("role", "dialog");
    viewer.setAttribute("aria-modal", "true");
    viewer.setAttribute("aria-label", "Expanded figure");
    viewer.innerHTML = '<div class="figure-viewer-backdrop" data-close-figure></div>'
      + '<div class="figure-viewer-panel"><button type="button" class="figure-viewer-close" data-close-figure aria-label="Close expanded figure">Close <span aria-hidden="true">×</span></button>'
      + '<img class="figure-viewer-image" alt=""><p class="figure-viewer-caption"></p></div>';
    document.body.appendChild(viewer);
    var close = function () {
      viewer.hidden = true;
      document.body.classList.remove("figure-viewer-open");
      var trigger = viewer._trigger;
      if (trigger && trigger.focus) trigger.focus();
    };
    viewer.addEventListener("click", function (event) {
      if (event.target.closest("[data-close-figure]")) close();
    });
    document.addEventListener("keydown", function (event) {
      if (viewer.hidden) return;
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key === "Tab") {
        event.preventDefault();
        viewer.querySelector(".figure-viewer-close").focus();
      }
    });
    stage.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-expand-figure]");
      var embed = event.target.closest(".figure-embed");
      var id = trigger ? trigger.getAttribute("data-expand-figure") : embed && embed.getAttribute("data-figure");
      if (!/^geddes-(selection|fig[1-6])$/.test(id || "")) return;
      var img = viewer.querySelector(".figure-viewer-image");
      img.src = "figures/" + id + ".svg";
      var figure = embed && embed.querySelector("figure.chart");
      img.alt = (trigger && trigger.getAttribute("aria-label")) || (figure && figure.getAttribute("aria-label")) || "Expanded figure";
      viewer.querySelector(".figure-viewer-caption").textContent = img.alt;
      viewer._trigger = trigger || (embed && embed.querySelector(".figure-expand"));
      viewer.hidden = false;
      document.body.classList.add("figure-viewer-open");
      viewer.querySelector(".figure-viewer-close").focus();
    });
  }

  function bind(s, i) {
    bindRank(s, i, !isPres);
    bindPlace(s, i, !isPres);
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
    var parts = [];
    if (m.choice) parts.push("<strong>Choice:</strong> " + esc(m.choice));
    if (m.text) parts.push("<strong>Reason:</strong> " + esc(m.text));
    if (!parts.length) return "";
    return '<p class="you"><strong>Your response</strong><br>' + parts.join("<br>") + "</p>";
  }

  function submit(s, i, payload) {
    if (isPres || !DeckSync.seated() || !DeckSync.isPresenting()) return Promise.resolve(false);
    var id = String(i);
    if (DeckSync.isDone(id) || pendingSubmissions[id]) return Promise.resolve(false);
    pendingSubmissions[id] = true;
    var panel = stage.querySelector(".ask-panel");
    var send = panel && panel.querySelector(".send");
    var originalLabel = send ? send.textContent : "";
    var error = panel && panel.querySelector(".submit-error");
    if (error) error.remove();
    if (send) {
      send.disabled = true;
      send.textContent = "Sending…";
    }
    function failed() {
      pendingSubmissions[id] = false;
      if (send) {
        send.disabled = false;
        send.textContent = originalLabel || "Try again";
      }
      if (panel && !panel.querySelector(".submit-error")) {
        var notice = document.createElement("p");
        notice.className = "submit-error";
        notice.setAttribute("role", "alert");
        notice.textContent = "That did not reach the room. Check the connection and try again.";
        panel.appendChild(notice);
      }
      return false;
    }
    return Promise.resolve(DeckSync.submit(id, payload)).then(function (ok) {
      pendingSubmissions[id] = false;
      if (!ok) return failed();
      remember(s.id, payload);
      DeckSync.markDone(id);
      if (DeckSync.getSlide() === i && lastIndex === i) render(i, true);
      return true;
    }).catch(failed);
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
    var hasSummary = s.viz === "bars" || s.viz === "bars-list";
    var hasDetails = s.viz === "list" || s.viz === "words" || s.viz === "bars-list" || s.viz === "bars";
    var firstPaint = !painted[s.id];
    painted[s.id] = true;
    if (hasSummary) {
      var opts = s.options || [];
      var counts = {};
      opts.forEach(function (o) { counts[o] = 0; });
      list.forEach(function (r) { if (r.choice && counts[r.choice] != null) counts[r.choice]++; });
      html += '<section class="room-summary-block"><p class="room-summary-heading">Class tally</p>';
      html += '<p class="tally">' + list.length + (list.length === 1 ? " response" : " responses") + "</p>";
      html += '<div class="bars">';
      opts.forEach(function (o) {
        var n = counts[o] || 0;
        var pct = list.length ? (n / list.length * 100) : 0;
        html += '<div class="bar"><div class="bar-top"><span class="lab">' + esc(o) + "</span>"
          + '<span class="n">' + n + "</span></div>"
          + '<div class="track"><div class="fill" style="width:' + pct + '%"></div></div></div>';
      });
      html += "</div></section>";
    }
    if (hasDetails) {
      html += '<section class="room-detail-block"><p class="room-responses-heading">Individual responses</p>';
      if (list.length) {
        html += '<p class="tally">' + list.length + (list.length === 1 ? " response" : " responses") + "</p>";
        html += '<ol class="responses' + (list.length > 4 ? " many" : "") + '">';
        list.forEach(function (r, index) {
          var id = s.id + ":" + r.sid;
          var fresh = !firstPaint && !seen[id];
          seen[id] = true;
          html += '<li class="card' + (fresh ? " fresh" : "") + '">';
          html += '<span class="response-index">Response ' + (index + 1) + "</span>";
          if (r.text) html += '<p class="said">' + esc(r.text) + "</p>";
          if (r.choice) html += '<p class="meta">Selected: ' + esc(r.choice) + "</p>";
          html += "</li>";
        });
        html += "</ol>";
      } else {
        html += '<p class="room-empty-state">Waiting for the first response. Submissions will appear here.</p>';
      }
      html += "</section>";
    } else if (!list.length && !hasSummary) {
      html = '<p class="room-empty-state">Waiting for the first response. Submissions will appear here.</p>';
    }
    if (s.viz === "words" && list.length) {
      var freq = wordFreq(list);
      if (freq.length) html += '<section class="room-word-summary"><p class="room-summary-heading">Common words</p><div class="words">' + freq.map(function (x) { return "<span><b>" + esc(x.w) + "</b> " + x.n + "</span>"; }).join("") + "</div></section>";
    }
    viz.classList.toggle("has-room-summary", hasSummary);
    viz.classList.toggle("has-room-details", hasDetails && list.length > 0);
    viz.setAttribute("data-response-count", String(list.length));
    viz.classList.toggle("five-responses", list.length >= 5);
    viz.innerHTML = html;
    showViz(s);
  }
  function showViz(s) {
    var viz = document.getElementById("viz");
    if (!viz) return;
    var count = Number(viz.getAttribute("data-response-count")) || 0;
    var show = !!(s && s.viz);
    viz.classList.toggle("is-hidden", !show);
    var win = viz.closest(".ss-win");
    if (win) win.classList.toggle("has-answers", count > 0);
  }

  function paintMe() {
    if (!meBox) return;
    meBox.hidden = true;
    meBox.innerHTML = "";
  }

  function paintHandBtn() {
    if (!handBtn) return;
    var current = slides()[DeckSync.getSlide()];
    var show = !isPres && DeckSync.seated() && !document.body.classList.contains("is-waiting") && current && current.type === "prompt";
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
    handsBox.innerHTML = '<span class="hands-count">' + list.length + (list.length === 1 ? " hand" : " hands") + "</span>";
  }

  function paintSeated() {
    var host = document.getElementById("seated");
    if (!host || !isPres) return;
    var list = DeckSync.getSeats();
    var count = host.querySelector(".seated-count");
    if (count) count.textContent = list.length + (list.length === 1 ? " here" : " here");
    else host.innerHTML = '<p class="seated-count">' + list.length + (list.length === 1 ? " here" : " here") + "</p>";
  }

  ensureFigureViewer();
  DeckSync.onSlide(function (n) {
    if (isPres) {
      render(n);
      var panel = document.getElementById("failsafe");
      if (panel && !panel.hidden) paintFailsafeStatus();
      return;
    }
    if (!DeckSync.isPresenting() || !DeckSync.seated()) return;
    render(n);
  });
  function failsafeLog(text) {
    var log = document.getElementById("failsafe-log");
    if (!log) return;
    log.hidden = !text;
    log.textContent = text || "";
  }

  function paintFailsafeStatus() {
    var host = document.getElementById("failsafe-status");
    if (!host || !DeckSync.snapshot) return;
    var snap = DeckSync.snapshot();
    var current = slides()[snap.slide] || {};
    var activity = current.type === "prompt" ? (current.title || "Class activity") : "Teaching slide";
    var received = current.type === "prompt" && DeckSync.getResponses
      ? DeckSync.getResponses(String(snap.slide)).length
      : 0;
    var connection = snap.localOnly ? "Local preview only" : (snap.status.detail || snap.status.mode || "Checking…");
    if (snap.status.mode === "backup") connection += " · temporary backup; confirm Firebase recovery before ending the session";
    var rows = [
      ["Connection", connection],
      ["Room", snap.presenting ? "Live" : "On hold"],
      ["Audience", snap.localOnly ? "Disabled in local preview" : (snap.status.phones ? "Available" : "Not confirmed")],
      ["Checked in", String(snap.seats.length)],
      ["Current slide", String((snap.slide || 0) + 1) + " of " + slides().length],
      ["Activity", activity],
      ["Responses", current.type === "prompt" ? String(received) + " received" : "Not collecting"],
      ["Last issue", snap.error || "None"]
    ];
    host.innerHTML = rows.map(function (row) {
      return "<div><dt>" + esc(row[0]) + "</dt><dd>" + esc(row[1]) + "</dd></div>";
    }).join("");
  }

  var failsafeOpener = null;
  function setFailsafeOpen(on) {
    var panel = document.getElementById("failsafe");
    if (!panel) return;
    if (on && !panel.hidden) return;
    if (on) failsafeOpener = document.activeElement;
    panel.hidden = !on;
    document.body.classList.toggle("is-failsafes", !!on);
    if (on) {
      paintFailsafeStatus();
      failsafeLog("");
      var close = document.getElementById("failsafe-close");
      if (close) close.focus();
    } else if (failsafeOpener && failsafeOpener.focus) {
      failsafeOpener.focus();
      failsafeOpener = null;
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
        note.textContent = on ? "This computer only" : "";
        note.className = "live-status";
      } else {
        note.textContent = st.detail || (st.live ? "Live sync: backup, Firebase locked" : "Connecting…");
        note.className = st.mode === "backup" ? "live-status warn" : "live-status";
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
      var board = document.getElementById("app") || document.documentElement;
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

  document.querySelectorAll(".brand-mark").forEach(function (el) {
    el.textContent = brand();
  });

  if (!isPres) {
    DeckSync.onPresenting(function (on) {
      if (on && DeckSync.seated()) {
        var n = DeckSync.getSlide();
        if (lastIndex === n && onBoard()) return;
        render(n);
        return;
      }
      if (DeckSync.seated()) {
        if (document.body.classList.contains("is-hold")) {
          paintHoldPeers();
          return;
        }
        holdRoom();
        return;
      }
      if (!document.body.classList.contains("is-checkin")) checkIn();
    });
    DeckSync.resumeSeat();
    if (DeckSync.isPresenting() && DeckSync.seated()) render(DeckSync.getSlide());
    DeckSync.onKick(function () {
      kickNotice = "You were removed. Tap I'm in to come back.";
      waitScreen();
    });
    setInterval(function () {
      if (DeckSync.seated()) {
        if (DeckSync.isPresenting()) {
          var n = DeckSync.getSlide();
          if (document.body.classList.contains("is-hold") || document.body.classList.contains("is-waiting") || document.body.classList.contains("is-checkin") || lastIndex !== n) {
            render(n);
          }
          return;
        }
        if (document.body.classList.contains("is-hold")) {
          paintHoldPeers();
          return;
        }
        holdRoom();
        return;
      }
      if (!document.body.classList.contains("is-checkin")) checkIn();
    }, 700);
    if (handBtn) handBtn.addEventListener("click", function () {
      DeckSync.raise(!DeckSync.handUp());
      paintHandBtn();
    });
    DeckSync.onHands(paintHandBtn);
    DeckSync.onSeats(function () {
      if (document.body.classList.contains("is-hold")) paintHoldPeers();
    });
  } else {
    DeckSync.onPresenting(paintLive);
    DeckSync.onStatus(paintLive);
    var joinChip = document.getElementById("join-chip");
    if (joinChip) {
      var href = joinHref();
      joinChip.textContent = "Join";
      joinChip.title = href.replace(/^https:\/\//, "");
    }

    if (liveBtn) liveBtn.addEventListener("click", function () {
      if (liveBtn.disabled) return;
      if (DeckSync.isPresenting()) {
        DeckSync.standDown();
        paintLive();
        return;
      }
      liveBtn.disabled = true;
      liveBtn.textContent = "Starting…";
      Promise.resolve(DeckSync.pushLive ? DeckSync.pushLive() : DeckSync.present())
        .then(function (result) {
          paintLive();
          if (result && result.error && !result.ok) failsafeLog("Live could not be confirmed. " + result.error);
        })
        .catch(function (err) {
          failsafeLog("Could not start live: " + (err && err.message ? err.message : "connection error"));
          DeckSync.standDown();
          paintLive();
        })
        .then(function () { liveBtn.disabled = false; paintLive(); });
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
    var fsSlide = document.getElementById("fs-slide");
    if (fsSlide) fsSlide.addEventListener("click", function () {
      DeckSync.republish();
      paintFailsafeStatus();
      failsafeLog("Sent slide " + (DeckSync.getSlide() + 1) + " again.");
    });
    var fsProbe = document.getElementById("fs-probe");
    if (fsProbe) fsProbe.addEventListener("click", function () {
      failsafeLog("Testing the audience connection…");
      DeckSync.probe().then(function (res) {
        paintFailsafeStatus();
        var fb = res.firebase || {};
        var nt = res.ntfy || {};
        var lines = [
          "Firebase HTTP " + (fb.status != null ? fb.status : "?"),
          "Firebase write: " + (fb.write ? "ok" : "failed"),
          "Firebase read: " + (fb.read ? "ok" : "failed"),
          fb.error ? "Firebase error: " + fb.error : "",
          "ntfy: " + (nt.skipped ? "skipped (this computer only)" : (nt.ok ? "ok HTTP " + nt.status : "blocked HTTP " + (nt.status || 0))),
          res.snap && res.snap.status && res.snap.status.detail ? res.snap.status.detail : "",
          res.snap && res.snap.localOnly ? "?local=1 is on, so remove it for class." : ""
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
        failsafeLog(ok ? "Reloaded seats, answers, and Go live from Firebase." : "Pull failed. Test audience connection.");
      });
    });
    var fsSeats = document.getElementById("fs-seats");
    if (fsSeats) fsSeats.addEventListener("click", function () {
      if (!confirm("Reset all audience check-ins? This also removes students who are currently connected.")) return;
      failsafeLog("Resetting audience check-ins…");
      DeckSync.clearSeats().then(function (ok) {
        paintFailsafeStatus();
        failsafeLog(ok ? "All check-ins were reset. Students can join again." : "Could not reset check-ins. Test audience connection.");
      });
    });
    var fsCopy = document.getElementById("fs-copy");
    if (fsCopy) fsCopy.addEventListener("click", function () {
      var text = JSON.stringify(DeckSync.snapshot(), null, 2);
      function done(ok) { failsafeLog(ok ? "Status copied." : text); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }).catch(function () { done(false); });
      } else done(false);
    });
  }
  if (isPres) {
    var nav = performance.getEntriesByType ? performance.getEntriesByType("navigation")[0] : null;
    var wasReload = !!(nav && nav.type === "reload");
    var shouldResume = false;
    try { shouldResume = sessionStorage.getItem("deck-resume-live") === "1"; } catch (e) {}
    if (wasReload && shouldResume) {
      var resumed = false;
      DeckSync.onStatus(function (status) {
        if (resumed) return;
        if (status.mode === "firebase" || status.mode === "backup") {
          resumed = true;
          try { sessionStorage.removeItem("deck-resume-live"); } catch (e) {}
          DeckSync.present();
        } else if (status.mode === "local") {
          try { sessionStorage.removeItem("deck-resume-live"); } catch (e) {}
        }
      });
    }
  }
  DeckSync.onResponses(function (id, list) {
    var i = DeckSync.getSlide();
    if (String(i) !== String(id)) return;
    var s = slides()[i];
    if (!s || s.type !== "prompt") return;
    if (isPres) {
      paintResponses(s, i, list);
      showViz(s);
      paintFailsafeStatus();
      fitStage();
      return;
    }
    if (!DeckSync.isDone(String(i)) && stage.querySelector(".thanks")) render(i);
  });
  if (isPres) {
    document.addEventListener("keydown", function (e) {
      if (!unlocked()) return;
      if (document.body.classList.contains("is-failsafes")) {
        if (e.key === "Escape") { e.preventDefault(); setFailsafeOpen(false); return; }
        if (e.key === "Tab") {
          var dialog = document.querySelector("#failsafe [role='dialog']");
          var focusable = dialog ? [].slice.call(dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(function (el) { return !el.hidden; }) : [];
          if (focusable.length) {
            var first = focusable[0], last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
          }
        }
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
        go(slides().length - 1);
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
  window.addEventListener("resize", fitStage);
  document.addEventListener("deck-content", function () {
    if (!unlocked()) return;
    var n = DeckSync.getSlide();
    n = Math.max(0, Math.min(slides().length - 1, n));
    if (isPres || DeckSync.isPresenting()) render(n);
  });
})();
