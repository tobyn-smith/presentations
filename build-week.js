/* Turns PROMPTS + READINGS into SLIDES the existing deck already understands.
   Load after slides.js (and script-content.js on the script page), before apply-content.js. */
(function () {
  var P = window.PROMPTS || [];
  var R = window.READINGS || [];
  if (!P.length || !R.length) return;

  var EMPTY = "[write here]";

  function cite(r) {
    var bits = [r.authors, r.year];
    if (r.pages) bits.push("pp. " + r.pages);
    if (r.source) bits.push(r.source);
    return bits.filter(Boolean).join(" · ");
  }

  function leadLine(r) {
    var line = cite(r);
    if (r.caseTypes && r.caseTypes.length) {
      line += (line ? " · " : "") + r.caseTypes.join(", ");
    }
    return line;
  }

  var out = [{
    id: "title",
    type: "title",
    kicker: "Leading a Reading Discussion",
    title: "This week's readings",
    lede: "Scan the code, pick a name, wait for Go live.",
    agenda: R.map(function (r) {
      return r.short + (r.minutes ? " · about " + r.minutes + " min" : "");
    }),
    speaker: ""
  }];

  R.forEach(function (r) {
    out.push({
      id: r.id + "-grid",
      type: "points",
      layout: "grid",
      kicker: r.short,
      title: r.title,
      lead: leadLine(r),
      points: P.map(function (p) {
        var filled = r.grid && r.grid[p.key];
        return { title: p.label, body: filled || "" };
      })
    });

    P.forEach(function (p) {
      var focused = r.focus && r.focus.indexOf(p.key) > -1;
      var closed = p.input === "choice" || p.input === "scale";
      if (!focused && !closed) return;
      out.push({
        id: r.id + "-" + p.key,
        type: "prompt",
        kicker: r.short,
        title: p.label,
        help: "",
        input: closed ? p.input : (p.input || "text"),
        options: p.options,
        scaleLabels: p.scaleLabels,
        viz: closed ? "bars" : "list",
        placeholder: EMPTY
      });
    });

    (r.asks || []).forEach(function (a, i) {
      if (!String(a || "").trim()) return;
      out.push({
        id: r.id + "-ask-" + i,
        type: "prompt",
        kicker: r.short + " · Question",
        title: a,
        help: "",
        input: "text",
        viz: "list",
        placeholder: EMPTY
      });
    });
  });

  window.SLIDES = out;

  var before = (window.SCRIPT || []).filter(function (sec) {
    return sec && sec.id === "before";
  });
  window.SCRIPT = before.concat(out.map(function (sl) {
    return { id: sl.id, title: sl.kicker || sl.title || "", say: EMPTY, notes: EMPTY };
  }));
})();
