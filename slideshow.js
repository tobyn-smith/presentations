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
      return '<div class="title-copy">'
        + "<h1>" + esc(s.title) + "</h1>"
        + (s.lede ? '<p class="lede">' + esc(s.lede) + "</p>" : "")
        + (s.frame ? '<p class="frame">' + esc(s.frame) + "</p>" : "")
        + agendaHtml(s)
        + (s.speaker ? '<p class="speaker">' + esc(s.speaker) + "</p>" : "")
        + quoteHtml(s.quote)
        + articleHtml(s)
        + "</div>";
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
    return '<p class="dq-label">Discussion Question:</p>'
      + "<h1>" + esc(s.title) + "</h1>"
      + (s.lead ? '<p class="lead">' + esc(s.lead) + "</p>" : "")
      + quoteHtml(s.quote)
      + articleHtml(s)
      + recapHtml(s)
      + (s.help ? '<p class="help">' + esc(s.help) + "</p>" : "")
      + talkHtml(s);
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
    kicker.textContent = s.kicker || brand;
    counter.textContent = String(i + 1);
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === slides().length - 1;
    stage.className = "stage fade";
    stage.classList.toggle("prompt", s.type === "prompt");
    stage.classList.toggle("has-recap", !!(s.recap && s.recap.length));
    stage.classList.toggle("has-close", s.type === "prompt" && !!s.quote);
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
    stage.innerHTML = htmlFor(s);
    var want = "#" + (i + 1);
    if (push && location.hash !== want) {
      try { history.replaceState(null, "", want); } catch (e) {}
    }
  }

  function go(n) { show(n, true); }

  prevBtn.addEventListener("click", function () { go(i - 1); });
  nextBtn.addEventListener("click", function () { go(i + 1); });
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
    if (e.target.closest("a, .talk, .recap, .quote, .points, .steps, .pair, .chart, .claims, button")) return;
    go(i + 1);
  });
  window.addEventListener("hashchange", function () { show(fromHash(), false); });
  document.addEventListener("deck-content", function () { show(i, false); });
  show(fromHash(), true);
})();
