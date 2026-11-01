/* Turns PROMPTS + READINGS into SLIDES. Optional PROJECT_SLIDES append after.
   Load after slides.js and the week files, before apply-content.js. */
(function () {
  var P = window.PROMPTS || [];
  var R = window.READINGS || [];
  var EMPTY = "[write here]";

  function cite(r) {
    var bits = [r.authors, r.year];
    if (r.pages) bits.push("pp. " + r.pages);
    if (r.source) bits.push(r.source);
    return bits.filter(Boolean).join(", ");
  }

  function leadLine(r) {
    var line = cite(r);
    if (r.caseTypes && r.caseTypes.length) {
      line += (line ? " | " : "") + r.caseTypes.join(", ");
    }
    return line;
  }

  function scriptFor(id, fallbackTitle, pack) {
    var row = pack && pack[id];
    if (!row && pack) {
      var key = String(id || "").split("-").pop();
      row = pack[key];
    }
    return {
      id: id,
      title: (row && row.title) || fallbackTitle || "",
      say: row && row.say != null ? row.say : EMPTY,
      notes: row && row.notes != null ? row.notes : EMPTY
    };
  }

  var out = [];
  var script = (window.SCRIPT || []).filter(function (sec) {
    return sec && sec.id === "before";
  });

  function useWritten(r) {
    return r && r.slides && r.slides.length;
  }

  if (R.some(useWritten)) {
    R.forEach(function (r) {
      if (!useWritten(r)) return;
      (r.slides || []).forEach(function (sl) { out.push(sl); });
      (r.script || []).forEach(function (sec) { script.push(sec); });
    });
  } else if (R.length && P.length) {
    out.push({
      id: "title",
      type: "title",
      kicker: "",
      title: "This week's readings",
      lede: "",
      agenda: R.map(function (r) { return r.short; }),
      speaker: ""
    });
    script.push(scriptFor("title", "Title", {
      title: {
        say: "These are the Methods readings. I will wait until names are on the right, then start.",
        notes: "Let people scan.\nGo live when enough names show."
      }
    }));

    R.forEach(function (r) {
      var pack = r.script || {};
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
      script.push(scriptFor("grid", r.short, pack));

      (r.focus || []).forEach(function (key) {
        var p = P.filter(function (x) { return x.key === key; })[0];
        if (!p) return;
        var closed = p.input === "choice" || p.input === "scale";
        out.push({
          id: r.id + "-" + key,
          type: "prompt",
          kicker: r.short,
          title: p.label,
          help: "",
          input: closed ? p.input : "text",
          options: p.options,
          viz: closed ? "bars" : "list",
          placeholder: "Type your answer"
        });
        script.push(scriptFor(key, p.label, pack));
      });
    });
  }

  (window.PROJECT_SLIDES || []).forEach(function (sl) {
    out.push(sl);
  });
  (window.PROJECT_SCRIPT || []).forEach(function (sec) {
    script.push(sec);
  });

  if (out.length) window.SLIDES = out;
  if (script.length) window.SCRIPT = script;
})();
