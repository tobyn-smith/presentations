/* Visual and discussion updates for the Geddes seminar. Loaded after the reading data. */
(function () {
  var r = (window.READINGS || []).filter(function (x) { return x.id === "geddes-1990"; })[0];
  if (!r) return;
  function slide(id) { return r.slides.filter(function (x) { return x.id === id; })[0]; }

  var regions = slide("regions");
  regions.chart = {
    id: "geddes-fig1", title: "Figure 1 · The selected cases and East Asia",
    source: "Geddes (1990), Figure 1",
    note: "The five selected NICs all have high growth, but repression barely varies. The East Asian panel has a positive association (r² = .56), yet East Asia itself is an unusually fast-growing region.",
    plots: []
  };
  regions.claims = [
    {n:"01",title:"Left: selected NICs",body:"Five familiar success stories share repressed or coopted labour. With no low-growth cases and little variation in repression, this panel cannot test the causal claim."},
    {n:"02",title:"Right: East Asia",body:"The positive pattern is real within this regional sample, but the region was selected in a way correlated with growth."},
    {n:"03",title:"What we can say",body:"The figure shows why a pattern inside a selected group cannot automatically be generalised."}
  ];

  var fits = slide("fits");
  fits.type = "prompt";
  fits.title = "What changes when the sample widens?";
  fits.help = "Look at both plots before choosing. The question is what the broader cases let us infer.";
  fits.ask = "Which reading is closest to Geddes's conclusion?";
  fits.input = "choice-text";
  fits.requireText = false;
  fits.placeholder = "";
  fits.options = [
    "The apparent relationship weakens in broader samples",
    "The hypothesis is proved false",
    "Moderate repression is proven to cause growth"
  ];
  fits.chart = {
    id: "geddes-fig23", title: "Figures 2 and 3 · Broader samples",
    source: "Geddes (1990), Figures 2 and 3",
    note: "Figure 2: Third World sample, r² = .07. Figure 3: more advanced countries, r² = .01. The plots show no simple linear relationship; Geddes discusses a possible curved relationship and the influence of a few unusually fast-growing NICs.",
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
  f4.claims = [
    {n:"01",title:"Threat and elite cohesion",body:"Prussia and Japan faced serious threats, but dependent landed classes did not split the elite. Russia after the First World War is an exception."},
    {n:"02",title:"Elite split and revolution",body:"Where villages lacked autonomy, peasants could not take advantage of elite conflict. Britain and Prussia are contrasts."}
  ];
  f4.left = null; f4.right = null;

  var f5 = slide("figure5");
  f5.chart = {
    id: "geddes-fig5", title: "Figure 5 · Defeat in war and revolution",
    source: "Geddes (1990), Figure 5 · Spanish American cases",
    note: "Seven instances of defeat without revolution; two revolutions without the specified defeat; one case of both (Bolivia). Counts are instances, not nine unique country labels. Cuba is treated as an intermediate case.",
    plots: []
  };
  f5.claims = [
    {n:"01",title:"Seven defeats, no revolution",body:"The strongest challenge to the claim that external military defeat leads to revolution."},
    {n:"02",title:"Two revolutions without the specified defeat",body:"Mexico (1910) and Nicaragua (1979). These do not disprove Skocpol because the threat measure is deliberately strict."},
    {n:"03",title:"One case fits",body:"Bolivia was defeated in 1935 and had a revolution in 1952. Geddes raises doubt, not a definitive refutation."}
  ];

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
  var order = ["open","ask","nics","regions","quote-sample","fits","skocpol","figure4","figure5","hirschman","chile","close"];
  r.slides = order.map(function (id) { return slide(id); });

  function script(id) { return r.script.filter(function (x) { return x.id === id; })[0]; }
  r.script = order.map(function (id) { return script(id); });
  var q = script("quote-sample");
  q.title = "Interaction 2: choosing the sample: 4:20–5:10";
  q.say = "What would you add to these cases? Geddes is not saying the five countries tell us nothing. The problem is that they cannot test the claim on their own. Choose what you would want to see alongside them.";
  q.notes = "TOBYN · 4:20–5:10\nINTERACTION 2 OF 3. Take a quick vote and one reason. The strongest answer is to include countries with slower growth, so the outcome varies. Then move to the wider plots.";
  var f = script("fits");
  f.title = "Interaction 3: reading the wider graphs: 5:10–6:00";
  f.say = "Now compare Figures 2 and 3. Which reading is closest to Geddes's conclusion? The relationship that looked persuasive in a selected group weakens in the wider samples. That is not the same as proving the hypothesis false.";
  f.notes = "TOBYN · 5:10–6:00\nINTERACTION 3 OF 3. Give the room 20–30 seconds to choose. Expected: the apparent relationship weakens in broader samples. Stress that the simple bivariate tests do not disprove the hypothesis; Geddes notes controls could matter and a curved relationship is possible. Hand over to Raquel.";
  var sk = script("skocpol");
  sk.title = "Skocpol's explanation: 6:00–7:00";
  var ch = script("chile");
  ch.title = "Figure 6 and the endpoint: 11:00–13:15";
  ch.say = "Figure 6 carries the Chile series beyond Hirschman's 1961 endpoint. The two low years are no longer the end of the story. Geddes argues that the later record makes it much harder to claim that groups had learned to contain inflation. She points instead to the stabilisation policies under Alessandri.";
  ch.notes = "TOBYN · 11:00–13:15\nNo interaction on this slide. Point out the 1961 endpoint marker and the later rise. The 1930–61 values come from Table 2; the extended trend is a schematic redraw of Figure 6, not a digitised annual dataset. Avoid saying this proves Hirschman was wrong about every part of his argument.";
  var cl = script("close");
  cl.title = "Conclusion: 13:15–15:00";
  /* Timings move the sample question ahead of the graph-reading activity. */
  script("regions").title = "The wider comparison: 3:30-4:20";
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
