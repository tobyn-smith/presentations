/* Backup slideshow. Same boards, no join, no answers. */
(function () {
  function slides() { return window.SLIDES || []; }
  var stage = document.getElementById("stage");
  var kicker = document.getElementById("kicker");
  var counter = document.getElementById("counter");
  var prevBtn = document.getElementById("prev");
  var nextBtn = document.getElementById("next");
  var i = 0;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function quoteHtml(q) {
    if (!q) return "";
    return '<figure class="quote"><p>“' + esc(q.text) + '”</p><cite>' + esc(q.cite) + "</cite></figure>";
  }

  function articleHtml(s) {
    if (!s.articleUrl) return "";
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
        + '<text x="82" y="48" fill="#16324f" font-size="22" font-family="Oswald, sans-serif">Labour</text>'
        + '<text x="82" y="118" fill="#16324f" font-size="22" font-family="Oswald, sans-serif">Skocpol</text>'
        + '<text x="82" y="188" fill="#16324f" font-size="22" font-family="Oswald, sans-serif">Chile</text>'
        + "</svg></div>";
    }
    if (s.id === "chile") return yearChartHtml();
    return "";
  }

  function windowHtml(kind, title, inner) {
    if (!inner) return "";
    return '<div class="ss-win ss-' + kind + '">'
      + '<div class="ss-win-bar">'
      + '<span class="ss-win-dots" aria-hidden="true"><i></i><i></i><i></i></span>'
      + (title ? '<span class="ss-win-title">' + esc(title) + "</span>" : "")
      + "</div>"
      + '<div class="ss-win-body">' + inner + "</div></div>";
  }

  function fitStage() {
    if (!stage) return;
    stage.style.transform = "";
    var room = stage.clientHeight;
    var need = stage.scrollHeight;
    if (room > 0 && need > room + 2) {
      var scale = Math.max(0.68, room / need);
      stage.style.transformOrigin = "top center";
      stage.style.transform = "scale(" + scale + ")";
    }
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
    var fig = '<figure class="chart" data-chart="' + esc(chart.id || "") + '">'
      + (chart.source || chart.note ? "<figcaption>"
        + (chart.source ? '<p class="chart-source">' + esc(chart.source) + "</p>" : "")
        + (chart.note ? '<p class="chart-note">' + esc(chart.note) + "</p>" : "")
        + "</figcaption>" : "")
      + '<div class="chart-bars" role="img" aria-label="' + esc(chart.title) + '">' + rows + "</div>"
      + "</figure>";
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

  function recapHtml(s) {
    if (!s.recap || !s.recap.length) return "";
    return '<ul class="recap">' + s.recap.map(function (pt) {
      if (typeof pt === "string") return "<li>" + esc(pt) + "</li>";
      var title = pt.title ? "<strong>" + esc(pt.title) + "</strong>" : "";
      var body = pt.body ? "<span>" + esc(pt.body) + "</span>" : "";
      return "<li>" + title + body + "</li>";
    }).join("") + "</ul>";
  }

  function agendaHtml(s) {
    if (!s.agenda || !s.agenda.length) return "";
    return '<ol class="agenda">' + s.agenda.map(function (row, idx) {
      return "<li><span class=\"n\">" + (idx + 1) + "</span><span>" + esc(row) + "</span></li>";
    }).join("") + "</ol>";
  }

  function talkHtml(s) {
    var opts = s.options || s.starters || [];
    if (!opts.length) return "";
    var labs = s.scaleLabels || [];
    var items = opts.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("");
    return '<ul class="talk' + (s.input === "scale" ? " talk-scale" : "") + '" aria-label="Discussion choices">'
      + items + "</ul>"
      + (labs.length ? '<div class="scale-labels"><span>' + esc(labs[0]) + "</span><span>" + esc(labs[1] || "") + "</span></div>" : "");
  }

  function htmlFor(s) {
    if (s.type === "title") {
      var href = (window.DECK && DECK.joinUrl) || "";
      var shown = String(href).replace(/^https:\/\//, "");
      return '<div class="title-copy">'
        + '<img class="uga-logo title-logo" src="uga-logo.png" alt="University of Georgia" width="1024" height="158">'
        + kickerHtml(s)
        + "<h1>" + esc(s.title) + "</h1>"
        + titleRuleHtml()
        + (s.byline ? '<p class="title-byline">' + esc(s.byline) + "</p>" : "")
        + (s.presented ? '<p class="title-presented">' + esc(s.presented) + "</p>" : "")
        + "</div>"
        + (shown ? '<div class="title-side">'
          + '<div class="title-bento title-bento-navy">'
          + windowHtml("term", "Join", '<p class="title-join">' + esc(shown) + "</p>")
          + "</div>"
          + '<div class="title-bento title-bento-cream"><p class="title-join">' + esc(shown) + "</p></div>"
          + "</div>" : "");
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
        var body = filled || "[write here]";
        return "<li><h2>" + esc(pt.title) + "</h2><p" + (filled ? "" : " class=\"empty\"") + ">" + esc(body) + "</p></li>";
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
    if (s.input === "place" || s.input === "rank") {
      return kickerHtml(s) + "<h1>" + esc(s.title) + "</h1>"
        + '<div class="split has-viz has-drag-main">'
        + '<div class="split-viz">' + vizHtml(s) + "</div>"
        + '<div class="split-side">'
        + windowHtml("term", "The trays", dragTalk(s))
        + "</div></div>";
    }
    return kickerHtml(s) + "<h1>" + esc(s.title) + "</h1>"
      + '<div class="slide-stack">'
      + (s.lead ? '<p class="lead">' + esc(s.lead) + "</p>" : "")
      + splitHtml(s)
      + quoteHtml(s.quote)
      + articleHtml(s)
      + recapHtml(s)
      + (s.help ? '<p class="help">' + esc(s.help) + "</p>" : "")
      + (s.ask ? '<div class="ask-panel">' + windowHtml("term", "Room", '<p class="ask-q">' + esc(s.ask) + "</p>" + dragTalk(s)) + "</div>" : windowHtml("term", "Talk", talkHtml(s)))
      + "</div>";
  }

  function dragTalk(s) {
    if (s.input === "rank") {
      return '<div class="drag-rank" id="drag-rank"><ol class="rank-list">'
        + (s.options || []).map(function (o, idx) {
          return '<li data-opt="' + esc(o) + '"><span class="rank-n">' + (idx + 1) + '</span><span class="rank-lab">' + esc(o) + "</span></li>";
        }).join("")
        + "</ol></div>";
    }
    if (s.input === "place") {
      return '<div class="drag-place" id="drag-place">'
        + '<div class="token-tray" data-home="1">'
        + (s.tokens || []).map(function (t) {
          return '<span class="token" data-token="' + esc(t) + '" tabindex="0">' + esc(t) + "</span>";
        }).join("")
        + "</div>"
        + '<div class="slot-row">'
        + (s.slots || []).map(function (slot) {
          return '<div class="slot" data-slot="' + esc(slot.id) + '"><p class="slot-lab">' + esc(slot.label) + '</p><div class="slot-well"><p class="slot-empty">Nothing here yet</p></div></div>';
        }).join("")
        + "</div></div>";
    }
    return talkHtml(s);
  }

  function numberRanks(list) {
    var items = list.querySelectorAll("[data-opt]");
    for (var n = 0; n < items.length; n++) {
      var mark = items[n].querySelector(".rank-n");
      if (mark) mark.textContent = String(n + 1);
    }
  }

  function bindRank() {
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
    }
    list.addEventListener("pointerdown", function (e) {
      var li = e.target.closest("[data-opt]");
      if (!li) return;
      held = li;
      li.classList.add("is-dragging");
      try { li.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
      e.stopPropagation();
    });
    list.addEventListener("pointermove", move);
    list.addEventListener("pointerup", endDrag);
    list.addEventListener("pointercancel", endDrag);
  }

  function bindPlace() {
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
      var rect = tok.getBoundingClientRect();
      grabX = x - rect.left;
      grabY = y - rect.top;
      tok.classList.add("is-dragging");
      tok.style.position = "fixed";
      tok.style.left = rect.left + "px";
      tok.style.top = rect.top + "px";
      tok.style.width = rect.width + "px";
      tok.style.zIndex = "20";
      tok.style.pointerEvents = "none";
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
      held = null;
    }
    board.addEventListener("pointerdown", function (e) {
      var tok = e.target.closest(".token");
      if (!tok) return;
      held = tok;
      lift(tok, e.clientX, e.clientY);
      try { tok.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
      e.stopPropagation();
    });
    board.addEventListener("pointermove", function (e) {
      if (!held) return;
      follow(e.clientX, e.clientY);
    });
    board.addEventListener("pointerup", function (e) {
      drop(e.clientX, e.clientY);
    });
    board.addEventListener("pointercancel", function () {
      if (!held) return;
      drop(-1, -1);
    });
  }

  var brand = (window.DECK && DECK.title) || "Discussion";
  document.querySelectorAll(".brand-mark").forEach(function (el) {
    el.textContent = brand;
  });

  function fromHash() {
    var n = parseInt(String(location.hash || "").replace(/^#/, ""), 10);
    if (!isFinite(n) || n < 1) return 0;
    return Math.min(slides().length - 1, n - 1);
  }

  function show(n, push) {
    if (!slides().length) return;
    n = Math.max(0, Math.min(slides().length - 1, n));
    var changed = n !== i;
    i = n;
    var s = slides()[i];
    document.title = "Slideshow · " + (s.title || brand);
    if (kicker) {
      kicker.textContent = "";
      kicker.hidden = true;
    }
    paintBanner(s);
    if (counter) counter.textContent = String(i + 1);
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i === slides().length - 1;
    stage.className = "stage";
    stage.classList.toggle("prompt", s.type === "prompt");
    stage.classList.toggle("has-recap", !!(s.recap && s.recap.length));
    stage.classList.toggle("has-close", s.type === "prompt" && !!s.quote);
    stage.classList.toggle("title", s.type === "title");
    stage.classList.toggle("compare", s.type === "compare");
    stage.classList.toggle("charts", s.type === "charts");
    stage.classList.toggle("stats", s.type === "stats");
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
    if (changed || !stage.innerHTML) {
      stage.innerHTML = htmlFor(s);
      bindRank();
      bindPlace();
    }
    fitStage();
    var want = "#" + (i + 1);
    if (push && location.hash !== want) {
      try { history.replaceState(null, "", want); } catch (e) {}
    }
  }

  function go(n) { show(n, true); }

  if (prevBtn) prevBtn.addEventListener("click", function () { go(i - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { go(i + 1); });
  document.addEventListener("keydown", function (e) {
    if (e.target && /input|textarea/i.test(e.target.tagName)) return;
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      go(i + 1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      go(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(slides().length - 1);
    }
  });
  stage.addEventListener("click", function (e) {
    if (stage.classList.contains("has-drag")) return;
    if (e.target.closest("a, .talk, .recap, .quote, .points, .steps, .pair, .chart, .claims, button")) return;
    go(i + 1);
  });
  window.addEventListener("hashchange", function () { show(fromHash(), false); });
  document.addEventListener("deck-content", function () { show(i, false); });
  window.addEventListener("resize", fitStage);
  show(fromHash(), true);
})();
