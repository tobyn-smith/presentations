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
  ask.claims = [
    {n:"01",title:"Start with A and B",body:"If we only study the cases with the outcome, it is easy to mistake a shared feature for its cause."},
    {n:"02",title:"The missing cases matter",body:"Cases without the outcome tell us whether the same feature is common there too."},
    {n:"03",title:"Testing needs variation",body:"To test a cause, compare cases across the outcome, not only the successful ones."}
  ];

  var regions = slide("regions");
  regions.chart = {
    id: "geddes-fig1", title: "Figure 1 · The selected cases and East Asia",
    source: "Geddes (1990), Figure 1",
    note: "The five selected NICs all have high growth, but repression barely varies. The East Asian panel has a positive association (r² = .56), yet East Asia itself is an unusually fast-growing region.",
    plots: []
  };
  regions.claims = [
    {n:"01",title:"Left: selected NICs",body:"Five familiar success stories share repressed or coopted labour. With no low-growth cases and little variation in repression, this panel cannot test the causal claim."},
    {n:"02",title:"Right: East Asia",body:"The positive pattern is real within this regional sample, but the region was selected in a way correlated with growth. Table 1 shows average East Asian growth of 5.2%, compared with 2.2% in Latin America and 1.0% in Africa."},
    {n:"03",title:"What we can say",body:"The figure shows why a pattern inside a selected group cannot automatically be generalised."}
  ];

  var fits = slide("fits");
  var fig2 = JSON.parse(JSON.stringify(fits));
  fig2.id = "figure2";
  fig2.type = "claims";
  fig2.kicker = "PART 1 - TOBYN";
  fig2.title = "Figure 2: the wider Third World sample";
  fig2.chart = {
    id: "geddes-fig2", title: "Figure 2 · Growth and labour repression in the Third World",
    source: "Geddes (1990), Figure 2",
    note: "The fitted line slopes slightly down (r² = .07). Geddes's point is that labour repression is also common in slow-growing countries.",
    plots: []
  };
  fig2.claims = [];
  fits.type = "prompt";
  fits.title = "Figure 3: the more advanced countries";
  fits.help = "Compare this pattern with Figure 2, then choose the interpretation closest to Geddes's conclusion.";
  fits.ask = "Which two explanations does Geddes consider for Figure 3?";
  fits.input = "choice-text";
  fits.requireText = false;
  fits.placeholder = "";
  fits.options = [
    "A curved relationship, or a few unusually fast-growing NICs",
    "The hypothesis is disproved by the wider sample",
    "A strong straight-line relationship across all countries"
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
  f4.type = "claims";
  f4.title = "Skocpol's contrasts test different links";
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
  f5.chart = {
    id: "geddes-fig5", title: "Figure 5 · Defeat in war and revolution",
    source: "Geddes (1990), Figure 5 · Spanish American cases",
    note: "Seven defeat/no-revolution instances, two revolutions without the specified defeat, and one case of both. These are ten country-period instances, not ten unique countries; Bolivia appears more than once. Cuba is an intermediate case.",
    plots: []
  };
  f5.claims = [];

  var chile = slide("chile");
  chile.type = "claims";
  chile.title = "Chile: the story continues after 1961";
  chile.chart = {
    id: "geddes-fig6", title: "Figure 6 · Inflation in Chile, 1930–1972",
    source: "Geddes (1990), Figure 6; Table 2 supplies the 1930–1961 values",
    note: "The plotted early values come from Table 2. The later endpoint is shown schematically: Geddes extends the series to 1972 and argues that the 1960–61 fall was temporary, not evidence of lasting political learning.",
    plots: []
  };
  chile.claims = [
    {n:"01",title:"Hirschman's endpoint",body:"His study ends in 1961, after inflation falls under Alessandri's stabilisation policies."},
    {n:"02",title:"Geddes extends the series",body:"The later years change the interpretation. The two low years are not enough to establish that inflation had been brought under lasting control."}
  ];
  chile.help = "";
  chile.ask = "";
  chile.input = "";
  chile.options = [];

  /* Keep the 12-slide run, with the sample discussion before the graph activity. */
  var order = ["open","ask","nics","regions","quote-sample","figure2","fits","skocpol","figure4","figure5","hirschman","chile","close"];
  r.slides = order.map(function (id) { return id === "figure2" ? fig2 : slide(id); });

  function script(id) { return r.script.filter(function (x) { return x.id === id; })[0]; }
  r.script.push({
    id:"figure2", title:"Figure 2: the wider Third World sample: 5:10-5:50",
    say:"Figure 2 widens the sample to the Third World. The line is slightly negative and the fit is very weak, at .07. Geddes says labour is repressed just as often in slow-growing countries as in fast-growing ones.",
    notes:"TOBYN · 5:10-5:50\nPoint out the weak downward line and r-squared. Do not call this proof that labour repression has no effect; it is a simple bivariate comparison."
  });
  r.script = order.map(function (id) { return script(id); });
  var q = script("quote-sample");
  q.title = "Interaction 2: choosing the sample: 4:20-5:10";
  q.say = "What would you add to these cases? Geddes is not saying the five countries tell us nothing. The problem is that they cannot test the claim on their own. Choose what you would want to see alongside them.";
  q.notes = "TOBYN · 4:20–5:10\nINTERACTION 2 OF 3. Take a quick vote and one reason. The strongest answer is to include countries with slower growth, so the outcome varies. Then move to the wider plots.";
  var f = script("fits");
  f.title = "Interaction 3: reading Figure 3: 5:50-7:00";
  f.say = "Figure 3 is a slightly different picture. The straight-line fit is almost zero, but the highest growth rates cluster around repression level three. Geddes gives two possible explanations: perhaps the relationship is curved, or perhaps a few unusually fast-growing NICs are driving the pattern. Which interpretation best fits the two figures?";
  f.notes = "TOBYN · 5:50-7:00\nINTERACTION 3 OF 3. Give the room 20-30 seconds to choose. Expected: the linear relationship is weak, but a curved pattern may be possible. Geddes also considers whether Singapore, Taiwan and South Korea drive the appearance of a curve; adding a few cases weakens it. Do not claim the hypothesis is proved or disproved. Hand over to Raquel.";
  var sk = script("skocpol");
  sk.title = "Skocpol's explanation: 7:00-8:00";
  var f4s = script("figure4"); f4s.title = "Strategic contrasts: 8:00-9:00";
  var f5s = script("figure5"); f5s.title = "The wider check: 9:00-10:00";
  var ch = script("chile");
  ch.title = "Figure 6 and the endpoint: 11:30-13:15";
  ch.say = "Figure 6 carries the Chile series beyond Hirschman's 1961 endpoint. The two low years are no longer the end of the story. Geddes argues that the later record makes it much harder to claim that groups had learned to contain inflation. She points instead to the stabilisation policies under Alessandri.";
  ch.notes = "TOBYN · 11:30-13:15\nNo interaction on this slide. Point out the 1961 endpoint marker and the later rise. The 1930–61 values come from Table 2; the extended trend is a schematic redraw of Figure 6, not a digitised annual dataset. Avoid saying this proves Hirschman was wrong about every part of his argument.";
  var cl = script("close");
  cl.title = "Conclusion: 13:15-15:00";
  /* Timings move the sample question ahead of the graph-reading activity. */
  script("ask").say = "Imagine I want to explain economic growth, so I start with countries that grew quickly. The top graph shows the pattern I might assume across all countries. But the lower graph shows another possibility: once the missing cases are included, the relationship may disappear. That is why Geddes says we need cases where the outcome did not happen as well.";
  script("regions").say = "Figure 1 puts two samples side by side. On the left are five familiar fast-growing countries, where repression barely varies. On the right are seven East Asian countries, where the association looks positive. Table 1 helps explain the problem: East Asia had unusually high average growth, so selecting that region is already linked to the outcome. The figure shows why the relationship may not travel beyond that sample.";
  script("fits").say = "Figure 3 is a slightly different picture. The straight-line fit is almost zero, but the highest growth rates cluster around repression level three. Geddes gives two possible explanations: perhaps the relationship is curved, or perhaps a few unusually fast-growing NICs are driving the pattern. Which interpretation best fits the two figures?";
  script("regions").title = "The wider comparison: 3:30-4:20";
  var hs = script("hirschman"); hs.title = "Chile and the endpoint: 10:00-11:30";
  script("chile").title = "Figure 6 and the endpoint: 11:30-13:15";
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
