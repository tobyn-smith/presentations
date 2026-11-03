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
    {n:"01",title:"Select on the outcome",body:"Choose countries because they grew quickly. Growth is what we want to explain."},
    {n:"02",title:"Spot a shared feature",body:"Notice what those countries have in common."},
    {n:"03",title:"Ask what is missing",body:"Would slower-growing countries share that feature too?"}
  ];

  var regions = slide("regions");
  regions.kicker = "PART 2 - RAQUEL";
  regions.chart = {
    id: "geddes-fig1", title: "Figure 1 · The selected cases and East Asia",
    source: "Geddes (1990), Figure 1",
    note: "The five selected NICs show little variation in repression. East Asia shows a positive association (r² = .56), but it is an unusually fast-growing region.",
    plots: []
  };
  regions.title = "Figure 1: a pattern inside one region";
  regions.claims = [
    {n:"01",title:"Selected NICs",body:"All five are relatively high-growth cases with moderately high repression. There is too little variation to establish a relationship."},
    {n:"02",title:"East Asia",body:"A positive pattern appears (r² = .56), but the region is unusually fast-growing."},
    {n:"03",title:"The limit",body:"A pattern inside one group does not show that the cause travels."}
  ];

  var fits = slide("fits");
  var fig2 = JSON.parse(JSON.stringify(fits));
  fig2.id = "figure2";
  fig2.type = "claims";
  fig2.kicker = "PART 2 - RAQUEL";
  fig2.title = "Figure 2: the wider sample";
  fig2.chart = {
    id: "geddes-fig2", title: "Figure 2 · Growth and labour repression in the Third World",
    source: "Geddes (1990), Figure 2",
    note: "r² = .07. Labour repression also appears in slow-growing countries.",
    plots: []
  };
  fig2.claims = [
    {n:"r²",title:".07",body:"The wider sample makes the straight-line relationship almost disappear."}
  ];
  fits.type = "prompt";
  fits.viz = "list";
  fits.kicker = "PART 2 - RAQUEL";
  fits.title = "Can a straight line miss a curve?";
  fits.help = "Look at the almost-flat line and the cluster near score 3.";
  fits.ask = "Which reading fits Geddes's caution?";
  fits.input = "choice-text";
  fits.requireText = false;
  fits.placeholder = "";
  fits.options = [
    "A curve, or a few NICs drive it",
    "The wider sample disproves it",
    "A strong linear link"
  ];
  fits.chart = {
    id: "geddes-fig3", title: "Figure 3 · More advanced Third World countries",
    source: "Geddes (1990), Figure 3",
    note: "r² = .01. High growth clusters near score 3; a curve or a few NICs may explain it.",
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
  hirschmanSlide.kicker = "PART 3 - TOBYN";
  var chile = slide("chile");
  chile.kicker = "PART 3 - TOBYN";
  chile.type = "claims";
  chile.title = "The endpoint changes the story";
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
  slide("quote-sample").viz = "list";
  var q = script("quote-sample");
  q.title = "Interaction 2: build a fairer comparison: 3:00-4:00";
  q.say = "You are designing the comparison now. The five success stories are not useless, but they cannot test the claim alone. What would you add first, and why?";
  q.notes = "TOBYN · 3:00-4:00\nINTERACTION 2 OF 3. Give 20 seconds to vote, then take one reason. Strongest answer: countries with slower growth, so the outcome varies. More fast growers add cases but do not solve selection on the outcome. Hand over to Raquel.";
  var f = script("fits");
  f.title = "Interaction 3: read the pattern: 6:00-7:15";
  f.say = "The straight-line fit is almost flat, but the highest growth rates cluster around repression level three. Geddes leaves two possibilities open: a curved relationship, or a few unusually fast-growing NICs driving the pattern. Which reading is closest to her argument?";
  f.notes = "RAQUEL · 6:00-7:15\nINTERACTION 3 OF 3. Give 20 seconds to choose, then ask one person why. Expected: the linear relationship is weak, but a curved pattern may be possible; a few NICs may drive it. Adding cases weakens the appearance of a curve. Do not say the hypothesis is proved or disproved.";
  ["regions","figure2","fits","skocpol","figure4","figure5"].forEach(function (id) {
    var item = script(id);
    if (item) item.notes = item.notes.replace(/^TOBYN/g, "RAQUEL");
  });
  script("hirschman").notes = script("hirschman").notes.replace(/^RAQUEL/g, "TOBYN");
  script("chile").notes = script("chile").notes.replace(/^RAQUEL/g, "TOBYN");
  var sk = script("skocpol");
  sk.title = "Skocpol's explanation: 7:15-8:15";
  var f4s = script("figure4"); f4s.title = "Figure 4: test the links: 8:15-9:15";
  var f5s = script("figure5"); f5s.title = "Figure 5: a wider check: 9:15-10:30";
  var ch = script("chile");
  ch.title = "Figure 6: what changes by 1972?: 12:00-13:30";
  ch.say = "Figure 6 carries the Chile series beyond Hirschman's 1961 endpoint. The later rise changes the picture: those low years were not the end of the story. Geddes argues that this makes it harder to claim inflation had been brought under lasting control.";
  ch.notes = "TOBYN · 12:00-13:30\nPoint out the 1961 endpoint marker and the later rise. The early selected values come from Table 2; the extended trend is schematic, not a digitised annual dataset. Do not claim this proves every part of Hirschman's argument wrong.";
  script("regions").notes = script("regions").notes.replace("3:30-4:20", "4:00-5:00");
  script("skocpol").notes = script("skocpol").notes.replace("6:00-7:00", "7:15-8:15");
  script("figure4").notes = script("figure4").notes.replace("7:00-8:00", "8:15-9:15");
  script("figure5").notes = script("figure5").notes.replace("8:00-9:00", "9:15-10:30");
  script("hirschman").notes = script("hirschman").notes.replace("9:00-11:00", "10:30-12:00");
  script("close").notes = script("close").notes.replace("13:15-15:00", "13:30-15:00");
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
  /* Tobyn's spoken notes: keep the wording natural and leave room to explain,
     rather than reading the slide copy back to the class. */
  script("open").say = "We are looking at a fairly simple question today: do the cases we choose affect the answer we end up with? Geddes's point is that they can. And if we are trying to test an explanation, that can become a real problem.";
  script("open").notes = "TOBYN · 0:00-0:30\nStart straight away. The question is case selection and what it does to the conclusions we draw. No long introduction.";
  script("ask").say = "Say I want to explain why some countries grow quickly. I start with countries that did grow quickly, notice they share something, and then say that feature explains their growth. The problem is that I have not looked at the countries that grew slowly. Without them, I cannot tell whether the same feature is present there as well.";
  script("ask").notes = "TOBYN · 0:30-1:30\nUse this as a simple example, not a claim about the actual causes of growth. The issue is that the outcome has already been used to choose the cases. Ask: what comparison is missing?";
  script("nics").say = "These five countries are the cases people often point to: Taiwan, South Korea, Singapore, Brazil and Mexico. They all had relatively fast growth and labour was repressed or brought under state control. Have a go at sorting the statements. We need to separate what these cases show from what they allow us to claim.";
  script("nics").notes = "TOBYN · 1:30-3:00\nINTERACTION 1 OF 3. Give 30 seconds to place the statements. Then ask someone to explain their choice. The key point: the cases show a shared feature among fast growers, but there is no slower-growth comparison. Do not suggest this proves repression caused growth.";
  script("quote-sample").say = "The five cases are still useful. They help us see what the argument is based on. But they cannot do the whole job. If you were adding cases, what would you want to include first? Think about what would let us test the claim, rather than just add more examples of the same outcome.";
  script("quote-sample").notes = "TOBYN · 3:00-4:00\nINTERACTION 2 OF 3. Give 20 seconds to vote and take one reason. The strongest answer is countries with slower growth, so the outcome varies. More fast-growing countries alone would not solve the selection problem. Hand over to Raquel.";
  script("hirschman").say = "The Chile example is slightly different. Here, the issue is where the researcher stops looking. Hirschman's account ends in 1961, just after inflation falls quite sharply. If we stop at that point, it looks as though the stabilisation has worked. Geddes carries the story on to 1972, and the later rise makes that conclusion much harder to sustain.";
  script("hirschman").notes = "TOBYN · 10:30-12:00\nPoint to the 1961 endpoint first, then explain why extending the period matters. The selected early values come from Table 2; the later trend is schematic. Do not say the graph proves every part of Hirschman's argument wrong.";
  script("chile").say = "This is the same issue in the longer series. The fall in inflation was real, but it did not last. Geddes's point is that stopping in 1961 gives us a very different impression from looking through to 1972. So the end date is not just a technical detail. It affects the story we tell.";
  script("chile").notes = "TOBYN · 12:00-13:30\nShow the 1961 marker and the later rise. Be clear that the early values are taken from Table 2 and the extension is schematic. Keep the distinction between a temporary fall and lasting stabilisation.";
  script("close").say = "So, across these examples, the same question keeps coming back: what have we left out? It might be countries where the outcome did not happen, cases that do not fit the explanation, or years that change the picture. Geddes is not saying case studies are useless. She is saying we need to be careful about what they can tell us.";
  script("close").notes = "TOBYN · 13:30-15:00\nFinish with the question: what would you need to add to your own research to make the claim more convincing? Leave a moment for answers. Do not add another activity.";
  /* Final speaker-note pass: follow the visible 13-slide order and keep the
     explanations tied closely to Geddes's wording and figures. */
  script("regions").say = "On the left are the five selected NICs. Geddes says repression is moderately high in all five, but there is no relationship between repression and growth within this small group. There is simply too little information to draw a conclusion. On the right, the wider East Asian comparison looks more convincing, with an r-squared of .56. But East Asia is an unusually fast-growing region, so choosing cases by region can create the same selection problem.";
  script("regions").notes = "RAQUEL · 4:00-5:00\nFigure 1 has two panels. Left: the five most frequently studied NICs. Repression is moderately high in all five, but there is no relationship between repression and growth within this small sample; Geddes says too little information is available. Do not say all five have score 3. Right: East Asia gives an apparent positive relationship (r² = .56), but regional selection is correlated with growth because East Asia grows unusually quickly.";
  script("figure2").say = "Figure 2 widens the sample to include slower-growing countries as well as fast growers. The slope is slightly negative and the r-squared falls to .07. So the relationship that looked convincing in the selected cases largely disappears. That does not prove repression has no effect, but it does show that the original five cases were not enough to support the general claim.";
  script("figure2").notes = "RAQUEL · 5:00-6:00\nPoint out the slightly negative slope and r² = .07. Geddes says the apparent relationship disappears in the wider Third World sample. Avoid saying this proves labour repression has no effect: it is a simple bivariate test, and she later says controls may matter.";
  script("fits").say = "This is Figure 3, looking at the more advanced Third World countries, using South Korea's level of development as the cut-off. The straight-line fit is almost flat: r-squared is .01. But Geddes gives two possible readings. There could be a curved relationship, where moderate repression is associated with growth but extreme repression is not. Or Singapore, Taiwan and South Korea could be driving the apparent curve. She says the curve weakens when a few more countries are added. She does not settle which explanation is right.";
  script("fits").notes = "RAQUEL · 6:00-7:15\nINTERACTION 3 OF 3. The graph is Figure 3: more advanced Third World countries, at least as advanced as South Korea. X-axis: labour repression score (1-4). Y-axis: GNP per capita growth, 1960-1982. The linear fit is almost flat (r² = .01), while the high-growth cases cluster around score 3. Ask students to choose: (1) a curve or a few NICs drive it; (2) the wider sample disproves it; or (3) a strong linear link. Expected answer: option 1, because it reflects Geddes's two possible interpretations. Explain that she does not decide between them. She explicitly says this bivariate test cannot disconfirm the hypothesis; appropriate controls might reveal a relationship. The curve also weakens when a few more cases are added. Give 20 seconds, then ask one student why. Do not say the curve is proven.";
  script("quote-sample").say = "You are designing the comparison now. The five success stories are useful, but they cannot test the claim on their own. Which cases would you add first? The best answer is countries with slower growth, because then we can see whether the same labour policies appear when the outcome is different.";
  script("quote-sample").notes = "TOBYN · 3:00-4:00\nINTERACTION 2 OF 3. The three options are slower-growth countries, more fast-growing countries, or countries with similar labour policies. Expected answer: countries with slower growth. More fast growers repeat the original selection; similar labour policies do not create variation in the outcome. Give 20 seconds, take one reason, then hand over to Raquel.";
  script("skocpol").say = "Skocpol's explanation is a sequence, not just a comparison of three revolutions. External military threats push state officials towards reform. A landed class with its own economic base and a share of political power can resist, splitting the elite. If peasant villages are autonomous and cohesive, peasants can take advantage of that split and rebel. Russia helps show the sequence: after the Crimean War the elite stayed unified, but defeat in the First World War helped bring elite disintegration and the 1917 revolution.";
  script("skocpol").notes = "RAQUEL · 7:15-8:15\nExplain the sequence in order: external threat → state reform → opposition from an independent landed class → elite split → peasant rebellion where villages are autonomous and cohesive. Russia: no revolution after the Crimean War because the upper class lacked the independent base to obstruct reforms; WWI defeat led to elite disintegration and the 1917 revolution.";
  script("figure4").say = "Geddes recognises that Skocpol does something useful here: she includes cases where revolution did not happen. Prussia and Japan faced serious military threats but their dominant classes lacked the independent economic base to block reforms. Britain during the Civil War and Prussia in 1848 had elite fragmentation, but low village autonomy meant peasants could not take advantage of it. These contrasts make Skocpol's argument more persuasive, although Geddes says they do not fully test every link in the sequence.";
  script("figure4").notes = "RAQUEL · 8:15-9:15\nPoint to the two comparisons in Figure 4. First: whether the dominant class has an independent economic base and shares power, and whether the elite remains cohesive under external threat. Second: whether village autonomy is high enough for peasants to act after an elite split. Geddes says these contrasting cases strengthen Skocpol's argument, but they are few and strategically selected; they do not test the external-threat link adequately.";
  script("figure5").say = "Geddes then tests the external-threat part more broadly using Spanish American cases with the structural conditions Skocpol identifies. Figure 5 shows seven instances of defeat without revolution, two revolutions without the specified defeat, and one instance of both. These are country-period instances, not ten different countries. The pattern casts doubt on a simple link between defeat and revolution, but Geddes is clear that it is not a definitive disproof.";
  script("figure5").notes = "RAQUEL · 9:15-10:30\nExplain the measure: defeat in a war accompanied by invasion and/or loss of territory; revolution within 20 years. Seven defeat/no-revolution instances, two revolutions without that specified defeat, one instance of both (Bolivia). Not ten unique countries. Cuba is an intermediate case; bracketed El Salvador, Peru and Guatemala had long peasant insurgencies but not yet revolution. Geddes says the test is imperfect and not a definitive disconfirmation, but it does cast doubt.";
  script("hirschman").say = "The Chile example is slightly different because the selection happens over time. Hirschman's account ends in 1961, after inflation falls sharply under Alessandri's stabilisation policies. But look at the exact numbers: inflation falls to 5 per cent in 1960, then rises to 10 per cent in 1961. Two unusually low years make the policy look more successful if we stop there. Geddes asks what happens if we keep looking.";
  script("hirschman").notes = "TOBYN · 10:30-12:00\nThe slide uses selected values from Table 2, not the complete series. Alessandri was elected in 1958 and began an all-out stabilisation effort in mid-1959. Inflation: 33% in 1959, 5% in 1960, 10% in 1961. Avoid saying it kept falling through 1961. The choice of endpoint matters.";
  script("chile").say = "Figure 6 carries the series through to 1972. Inflation rises above 100 per cent again. Geddes argues that 1960 and 1961 were unusual years, better explained by orthodox stabilisation policies than by a lasting change in how political groups behaved. She excludes the later 1973 to 1976 hyperinflation from this comparison. So stopping at 1961 gives a very different impression from looking at the longer series.";
  script("chile").notes = "TOBYN · 12:00-13:30\nPoint to the vertical marker showing Hirschman's 1961 endpoint and the 1972 end of Geddes's series. Figure 6 uses sources beyond Hirschman's Table 2. Geddes excludes 1973-76 hyperinflation and says 1960-61 look unusual, best explained by orthodox stabilisation policies. Do not say the graph proves every part of Hirschman's argument wrong.";
  script("close").say = "So the same question keeps coming back: what have we left out? It might be countries where the outcome did not happen, cases that do not fit the explanation, or years that change the picture. Geddes is not saying case studies are useless. They are useful for building explanations and understanding processes. But if we want to test a claim, we need to look beyond the cases that first made it convincing.";
  script("close").notes = "TOBYN · 13:30-15:00\nFinish with: what would you need to add to your own research to make the claim more convincing? Leave a moment for answers. The distinction is theory-building versus theory-testing.";
  script("fits").title = "Interaction 3: read Figure 3: 6:00-7:15";
  script("regions").title = "Figure 1: selected NICs and East Asia: 4:00-5:00";
  script("figure2").title = "Figure 2: the wider sample: 5:00-6:00";
  script("skocpol").title = "Skocpol's explanation: 7:15-8:15";
  script("figure4").title = "Figure 4: test the links: 8:15-9:15";
  script("figure5").title = "Figure 5: a wider check: 9:15-10:30";
  script("hirschman").title = "Chile: stop the clock at 1961?: 10:30-12:00";
  script("chile").title = "Figure 6: what changes by 1972?: 12:00-13:30";
  script("close").title = "Conclusion: 13:30-15:00";
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
