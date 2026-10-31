/* Blend: simple opening and voice, then her numbers in the middle.
   Pages cited only where the scan shows a printed number. */
(window.READINGS = window.READINGS || []).push({
  id: "geddes-1990",
  short: "Geddes",
  title: "How the Cases You Choose Affect the Answers You Get",
  authors: "Barbara Geddes",
  year: 1990,
  source: "IGS Working Paper 90-13",
  slides: [
    {
      id: "open",
      type: "title",
      kicker: "",
      title: "The cases you pick can change the answer.",
      lede: "",
      agenda: [],
      speaker: "Tobyn and Raquel Beatriz Caldas Laranjeira"
    },
    {
      id: "ask",
      type: "points",
      kicker: "Part 1",
      title: "What she wants to know",
      lead: "",
      points: [
        { title: "", body: "If you only study the outcome you already care about, do you still get a fair test?" }
      ]
    },
    {
      id: "habit",
      type: "points",
      kicker: "Part 1",
      title: "The habit",
      lead: "Want revolution? Read revolutions. Want growth? Read the fast growers.",
      points: [
        { title: "What you see", body: "What those cases share." },
        { title: "What you miss", body: "Whether the others share it too." }
      ]
    },
    {
      id: "nics",
      type: "points",
      kicker: "Part 1",
      title: "Five fast growers",
      lead: "Taiwan, South Korea, Singapore, Brazil, Mexico. Labour was held down in the fast years. Writers said that helped growth. Printed p. 5.",
      points: []
    },
    {
      id: "regions",
      type: "charts",
      kicker: "Part 1",
      title: "Growth by region, 1960 to 1982",
      note: "If you pick East Asia, you have already leaned toward the fast cases. Printed p. 8.",
      charts: [
        {
          id: "table1",
          title: "Average country growth, GNP per capita",
          source: "Her Table 1. World Development Report, 1984 and 1988.",
          max: 6,
          bars: [
            { label: "East Asia", n: 5.2 },
            { label: "Middle East and North Africa", n: 4.7 },
            { label: "Latin America", n: 2.2 },
            { label: "South Asia", n: 1.4 },
            { label: "Africa", n: 1.0 }
          ]
        }
      ]
    },
    {
      id: "scores",
      type: "stats",
      kicker: "Part 1",
      title: "How she scored labour",
      footer: "US human rights reports, 1980 and 1988. Printed pp. 7 to 8. She calls it imperfect.",
      stats: [
        { value: "1", label: "Free unions. Strikes happen. India, Jamaica, Venezuela." },
        { value: "2", label: "Unions exist. Strikes rare. Colombia, Zimbabwe, Malaysia." },
        { value: "3", label: "Tied to the state. South Korea, Brazil, Pakistan." },
        { value: "4", label: "Banned or very violent. Chile 1973 to 1979, Syria, Benin." }
      ]
    },
    {
      id: "fits",
      type: "stats",
      kicker: "Part 1",
      title: "The same claim, three samples",
      footer: "Printed pp. 8 and 10. This simple check cannot kill the claim. It does show the five-country picture does not travel.",
      stats: [
        { value: ".56", label: "East Asia only. Looks like a link." },
        { value: ".07", label: "A wider Third World set. Almost nothing. Slope slightly down." },
        { value: ".01", label: "Countries at least as advanced as South Korea." }
      ]
    },
    {
      id: "ask-five",
      type: "prompt",
      kicker: "Part 1",
      title: "If those five are all you read, what do you conclude?",
      help: "",
      input: "text",
      viz: "list",
      placeholder: "Type your answer"
    },
    {
      id: "part2",
      type: "title",
      kicker: "",
      title: "Same habit. Harder stories.",
      lede: "",
      agenda: [],
      speaker: "Raquel Beatriz Caldas Laranjeira"
    },
    {
      id: "skocpol",
      type: "points",
      kicker: "Part 2",
      title: "Skocpol",
      lead: "France, Russia, China, because they had revolutions. Then a few misses.",
      points: [
        { title: "The chain", body: "A war or invasion, a split in the elite, villages that can move on their own, then revolution." },
        { title: "Her check", body: "Nine Spanish-American countries that already have that village and class setup. Threat here means a lost war plus invasion or lost land." }
      ]
    },
    {
      id: "figure5",
      type: "stats",
      kicker: "Part 2",
      title: "What that check found",
      footer: "Printed p. 20. Not a kill. The set is not random, and threat is crude.",
      stats: [
        { value: "7", label: "Hard threats, no revolution." },
        { value: "2", label: "Revolutions with no such threat." },
        { value: "1", label: "Fits. Bolivia, once." }
      ]
    },
    {
      id: "chile",
      type: "charts",
      kicker: "Part 2",
      title: "Where you stop the story",
      note: "Hirschman on Chile ends in 1961, when it looked tamed. Printed pp. 21 to 23.",
      charts: [
        {
          id: "chile-end",
          title: "Yearly inflation, late years from her table",
          source: "Hirschman, p. 160, as she prints it.",
          max: 90,
          unit: "%",
          bars: [
            { label: "1955", n: 84 },
            { label: "1956", n: 38 },
            { label: "1958", n: 33 },
            { label: "1959", n: 33 },
            { label: "1960", n: 5 },
            { label: "1961", n: 10 }
          ]
        }
      ]
    },
    {
      id: "ask-trust",
      type: "prompt",
      kicker: "Part 2",
      title: "Which comparison would you trust, and why?",
      help: "",
      input: "text",
      viz: "list",
      placeholder: "Type your answer"
    },
    {
      id: "close",
      type: "points",
      kicker: "Close",
      title: "What this paper is for",
      lead: "Good for a hunch. Not, on its own, a test.",
      points: [
        { title: "If you pick cases because they already have the outcome", body: "You will often get the wrong answer. Printed p. 24." }
      ]
    }
  ],
  script: [
    {
      id: "open",
      title: "Part 1 · Tobyn",
      say: "One line, then we sit with it. The cases you pick can change the answer. That is the paper. I will take this half. Raquel has Part 2. I come back for the close.",
      notes: "Leave the title up.\nGo live when names show.\nTo swap who leads, change this title and the Part 2 and Close titles in Edit."
    },
    {
      id: "ask",
      title: "What she wants",
      say: "Geddes is not asking why Korea grew, or why France had a revolution. She is asking whether a habit, only studying the outcome you like, still gives you a fair test.",
      notes: "Goal: explanation of a method, not a new theory of growth.\nWorking paper 90-13, 1990."
    },
    {
      id: "habit",
      title: "The habit",
      say: "You want revolution, so you read revolutions. You then see what those cases share. You cannot see whether the others share it too.",
      notes: "Unit: the country.\nConcepts: selecting on the thing you want to explain.\nThe lone 1 on the opening page is a footnote, not a page number."
    },
    {
      id: "nics",
      title: "Five growers",
      say: "Taiwan, South Korea, Singapore, Brazil, Mexico. In the fast years, labour was held down. Several well-known people said that helped growth.",
      notes: "Printed p. 5.\nActors: governments and workers. It matters, because the claim is about how states treat labour."
    },
    {
      id: "regions",
      title: "Regions",
      say: "Her table. East Asia at 5.2. Africa at 1.0. If you pick East Asia, you have already leaned toward the fast cases.",
      notes: "Printed p. 8.\nDo not invent a country rate. The five are not given separate growth numbers on the scan."
    },
    {
      id: "scores",
      title: "Labour scores",
      say: "She scores labour from 1 to 4, from the US human rights reports. South Korea and Brazil sit at 3. She calls the score imperfect.",
      notes: "Printed pp. 7 to 8.\nMeasures: valid enough for her point, not a perfect labour index."
    },
    {
      id: "fits",
      title: "Three samples",
      say: "East Asia alone, r squared of .56. A wider set, .07, slope slightly down. The more advanced cut, .01. Among the five there was no real link. Slow countries hold labour down too.",
      notes: "Printed p. 10.\nStrategy: quantitative, cross-section, not a time series.\nShe says this cannot kill the claim on its own."
    },
    {
      id: "ask-five",
      title: "If you only read five",
      say: "If those five are all you have read, what do you conclude? A sentence is enough.",
      notes: "One live board for part 1.\nThen say what they wrote."
    },
    {
      id: "part2",
      title: "Part 2 · Raquel Beatriz Caldas Laranjeira",
      say: "Same habit. Two harder stories. Then Tobyn will close.",
      notes: "About ten minutes left.\nKeep this board short.\nTo swap who leads, change this title in Edit."
    },
    {
      id: "skocpol",
      title: "Skocpol",
      say: "She picks France, Russia and China because they had revolutions. The story is a chain. Geddes holds the village and class setup still, then asks whether war still leads to revolution.",
      notes: "Printed pp. 12 to 13.\nTheory is clear as a chain. Not every link is tested."
    },
    {
      id: "figure5",
      title: "Seven, two, one",
      say: "Seven hard threats, no revolution. Two revolutions with no such threat. One fit, Bolivia. She says this is not a kill.",
      notes: "Printed p. 20.\nCases: not random. Comparison is wider than three revolutions, still not a full universe."
    },
    {
      id: "chile",
      title: "Chile",
      say: "Hirschman stops in 1961. 1955 was 84 percent. 1960 and 1961 look tamed. If you stop the story on a quiet year, that year can run the conclusion.",
      notes: "Printed pp. 21 to 23.\nTime series, not a cross section."
    },
    {
      id: "ask-trust",
      title: "Which comparison",
      say: "Which comparison would you trust, and why? The five growers, her bigger set, Skocpol's three, or the nine Spanish-American cases.",
      notes: "Second and last live board.\nLeave time for the close."
    },
    {
      id: "close",
      title: "Close · Tobyn",
      say: "Case studies are good for how a thing happened, and for a hunch. They cannot, on their own, test the theory they just wrote. If you pick cases because they already have the outcome, you will often get the wrong answer.",
      notes: "Printed pp. 24 to 25.\nDoes the strategy adequately test the theories she re-runs? She says no, not from cases picked on the outcome.\nTo swap who closes, change this title in Edit.\nStop."
    }
  ]
});
