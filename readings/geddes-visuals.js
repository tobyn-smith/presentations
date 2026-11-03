/* Visual and discussion updates for the Geddes seminar. Loaded after the reading data. */
(function () {
  var r = (window.READINGS || []).filter(function (x) { return x.id === "geddes-1990"; })[0];
  if (!r) return;
  function slide(id) { return r.slides.filter(function (x) { return x.id === id; })[0]; }

  var ask = slide("ask");
  ask.chart = {
    id: "geddes-selection", title: "The cases you leave out matter",
    source: "Geddes (1990), conceptual selection-bias illustration",
    note: "The upper plot is the pattern a researcher might assume. The lower plot shows why the missing cases could change the conclusion.",
    plots: []
  };
  ask.title = "A sample can make a cause look stronger";
  ask.claims = [
    {n:"01",title:"Choose on the outcome",body:"Start with countries that grew quickly."},
    {n:"02",title:"Spot a shared feature",body:"Notice what those countries have in common."},
    {n:"03",title:"Ask what is missing",body:"Would the same feature appear where growth was slow?"}
  ];

  var regions = slide("regions");
  regions.kicker = "PART 2 - RAQUEL";
  regions.chart = {
    id: "geddes-fig1", title: "Figure 1 · The selected cases and East Asia",
    source: "Geddes (1990), Figure 1",
    note: "The five selected NICs all have high growth, but repression barely varies. The East Asian panel has a positive association (r² = .56), yet East Asia itself is an unusually fast-growing region.",
    plots: []
  };
  regions.title = "Figure 1: a pattern inside one region";
  regions.claims = [
    {n:"01",title:"Selected NICs",body:"All five sit at repression score 3. There are no low-growth comparisons."},
    {n:"02",title:"East Asia",body:"A positive pattern appears (r² = .56), but the region is unusually fast-growing."},
    {n:"03",title:"The limit",body:"A pattern inside one group does not show that the cause travels."}
  ];

  var fits = slide("fits");
  var fig2 = JSON.parse(JSON.stringify(fits));
  fig2.id = "figure2";
  fig2.type = "claims";
  fig2.kicker = "PART 2 - RAQUEL";
  fig2.title = "Figure 2: the wider Third World sample";
  fig2.chart = {
    id: "geddes-fig2", title: "Figure 2 · Growth and labour repression in the Third World",
    source: "Geddes (1990), Figure 2",
    note: "The fitted line slopes slightly down (r² = .07). Geddes's point is that labour repression is also common in slow-growing countries.",
    plots: []
  };
  fig2.claims = [];
  fits.type = "prompt";
  fits.kicker = "PART 2 - RAQUEL";
  fits.title = "Figure 3: the more advanced countries";
  fits.help = "Read the near-flat line, then choose what Geddes says may still be going on.";
  fits.ask = "What does Geddes leave open?";
  fits.input = "choice-text";
  fits.requireText = false;
  fits.placeholder = "";
  fits.options = [
    "A curved pattern, or a few NICs driving it",
    "The wider sample disproves the claim",
    "A strong straight-line relationship"
  ];
  fits.chart = {
    id: "geddes-fig3", title: "Figure 3 · More advanced Third World countries",
    source: "Geddes (1990), Figure 3",
    note: "The linear fit is almost flat (r² = .01), but the highest growth rates cluster around repression level 3. Geddes discusses a possible curved relationship and the influence of a few unusually fast-growing NICs.",
    plots: []
  };
  fits.claims = [];
  fits.quote = null;

  var f4 = slide("figure4");
  f4.kicker = "PART 2 - RAQUEL";
  f4.type = "claims";
  f4.title = "Where does Skocpol's sequence break?";
  f4.lead = "Figure 4 sets out the cases at two stages in the argument. The comparisons are strategic, not a random sample.";
  f4.chart = {
    id: "geddes-fig4", title: "Figure 4 · Skocpol's case comparisons",
    source: "Geddes (1990), Figure 4 · simplified visual summary",
    note: "The first comparison asks whether external threat is followed by elite cohesion or disintegration. The second asks whether an elite split is followed by revolution where village autonomy is high.",
    plots: []
  };
  f4.claims = [];
  f4.lead = "";
  f4.chart.note = "Original 2×2 case table. Britain during the Civil War and Prussia in 1848 are discussed separately as low-village-autonomy contrasts, not listed in this matrix.";
  f4.left = null; f4.right = null;

  var f5 = slide("figure5");
  f5.kicker = "PART 2 - RAQUEL";
  f5.chart = {
    id: "geddes-fig5", title: "Figure 5 · Defeat in war and revolution",
    source: "Geddes (1990), Figure 5 · Spanish American cases",
    note: "Seven defeat/no-revolution instances, two revolutions without the specified defeat, and one case of both. These are ten country-period instances, not ten unique countries; Bolivia appears more than once. Cuba is an intermediate case.",
    plots: []
  };
  f5.claims = [];

  var hirschmanSlide = slide("hirschman");
  hirschmanSlide.kicker = "PART 2 - RAQUEL";
  var chile = slide("chile");
  chile.kicker = "PART 2 - RAQUEL";
  chile.type = "claims";
  chile.title = "What changes when we keep looking?";
  chile.chart = {
    id: "geddes-fig6", title: "Figure 6 · Inflation in Chile, 1930–1972",
    source: "Geddes (1990), Figure 6; Table 2 supplies the 1930–1961 values",
    note: "The plotted early values come from Table 2. The later endpoint is shown schematically: Geddes extends the series to 1972 and argues that the 1960–61 fall was temporary, not evidence of lasting political learning.",
    plots: []
  };
  chile.claims = [
    {n:"01",title:"Hirschman stops in 1961",body:"Inflation has fallen sharply. Stabilisation looks successful."},
    {n:"02",title:"Geddes keeps looking",body:"By 1972, inflation is above 100%. The low years did not last."}
  ];
  chile.help = "";
  chile.ask = "";
  chile.input = "";
  chile.options = [];

  /* Keep the 13-slide run, with the sample discussion before the graph activity. */
  var order = ["open","ask","nics","quote-sample","regions","figure2","fits","skocpol","figure4","figure5","hirschman","chile","close"];
  r.slides = order.map(function (id) { return id === "figure2" ? fig2 : slide(id); });

  function script(id) { return r.script.filter(function (x) { return x.id === id; })[0]; }
  r.script.push({
    id:"figure2", title:"Figure 2: the wider Third World sample: 5:10-5:50",
    say:"Figure 2 widens the sample to the Third World. The line is slightly negative and the fit is very weak, at .07. Geddes says labour is repressed just as often in slow-growing countries as in fast-growing ones.",
    notes:"TOBYN · 5:10-5:50\nPoint out the weak downward line and r-squared. Do not call this proof that labour repression has no effect; it is a simple bivariate comparison."
  });
  r.script = order.map(function (id) { return script(id); });
  var q = script("quote-sample");
  q.title = "Interaction 2: build a fairer comparison: 3:00-4:00";
  q.say = "You are designing the comparison now. The five success stories are not useless, but they cannot test the claim alone. What would you add first, and why?";
  q.notes = "TOBYN · 3:00-4:00\nINTERACTION 2 OF 3. Give 20 seconds to vote, then take one reason. Strongest answer: countries with slower growth, so the outcome varies. More fast growers add cases but do not solve selection on the outcome. Hand over to Raquel.";
  var f = script("fits");
  f.title = "Interaction 3: read the pattern: 6:00-7:15";
  f.say = "The straight-line fit is almost flat, but the highest growth rates cluster around repression level three. Geddes leaves two possibilities open: a curved relationship, or a few unusually fast-growing NICs driving the pattern. Which reading is closest to her argument?";
  f.notes = "RAQUEL · 6:00-7:15\nINTERACTION 3 OF 3. Give 20 seconds to choose, then ask one person why. Expected: the linear relationship is weak, but a curved pattern may be possible; a few NICs may drive it. Adding cases weakens the appearance of a curve. Do not say the hypothesis is proved or disproved.";
  ["regions","figure2","fits","skocpol","figure4","figure5","hirschman","chile"].forEach(function (id) {
    var item = script(id);
    if (item) item.notes = item.notes.replace(/^TOBYN/g, "RAQUEL");
  });
  var sk = script("skocpol");
  sk.title = "Skocpol's explanation: 7:15-8:15";
  var f4s = script("figure4"); f4s.title = "Figure 4: test the links: 8:15-9:15";
  var f5s = script("figure5"); f5s.title = "Figure 5: a wider check: 9:15-10:30";
  var ch = script("chile");
  ch.title = "Figure 6 and the endpoint: 11:30-13:15";
  ch.say = "Figure 6 carries the Chile series beyond Hirschman's 1961 endpoint. The two low years are no longer the end of the story. Geddes argues that the later record makes it much harder to claim that groups had learned to contain inflation. She points instead to the stabilisation policies under Alessandri.";
  ch.notes = "RAQUEL · 11:30-13:15\nNo interaction on this slide. Point out the 1961 endpoint marker and the later rise. The 1930-61 values come from Table 2; the extended trend is a schematic redraw of Figure 6, not a digitised annual dataset. Avoid saying this proves Hirschman was wrong about every part of his argument.";
  var cl = script("close");
  cl.title = "Conclusion: 13:30-15:00";
  /* Timings move the sample question ahead of the graph-reading activity. */
  script("ask").say = "Imagine I want to explain economic growth, so I start with countries that grew quickly. I find they share a feature and suggest it explains growth. But if I have left out countries where growth was slow, I cannot tell whether that feature really explains the difference. That is the problem Geddes asks us to notice.";
  script("regions").say = "Figure 1 is where the comparison widens. The five selected NICs all grew quickly, but there is very little variation in their labour-repression scores. The East Asian panel looks more convincing, with an r-squared of .56. But Geddes points out that East Asia was already an unusually fast-growing region. The question is whether the relationship holds once we look beyond it.";
  script("fits").say = "The straight-line fit is almost flat, but the highest growth rates cluster around repression level three. Geddes leaves two possibilities open: a curved relationship, or a few unusually fast-growing NICs driving the pattern. Neither explanation is settled by this graph.";
  script("regions").title = "Figure 1: the first comparison: 4:00-5:00";
  script("ask").title = "The research problem: 0:30-1:30";
  script("nics").title = "Interaction 1: five fast growers: 1:30-3:00";
  script("quote-sample").title = "Interaction 2: build a fairer comparison: 3:00-4:00";
  script("figure2").say = "Figure 2 takes us beyond the fast growers. The fitted line is slightly negative and the r-squared is only .07. Repression is also found in slow-growing countries, so the five success stories cannot tell us what caused growth.";
  script("figure2").title = "Figure 2: widen the sample: 5:00-6:00";
  var hs = script("hirschman"); hs.title = "Chile: stop the clock at 1961?: 10:30-12:00";
  script("chile").title = "Figure 6: what changes by 1972?: 12:00-13:30";
  function plainDashes(value) {
    if (typeof value === "string") return value.replace(/[–—]/g, "-");
    if (Array.isArray(value)) return value.map(plainDashes);
    if (value && typeof value === "object") {
      Object.keys(value).forEach(function (key) { value[key] = plainDashes(value[key]); });
    }
    return value;
  }
  r.slides = plainDashes(r.slides);
  r.script = plainDashes(r.script);
})();
