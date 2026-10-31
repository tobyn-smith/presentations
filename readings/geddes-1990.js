/* Geddes (1990). One continuous deck. Dense split: figure left, claim bars right.
   Numbers and page cites only where the scan prints them. */
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
      speaker: "",
      claims: [
        { title: "The paper", body: "How the cases you choose affect the answers you get. Selection bias in comparative politics." },
        { title: "The habit", body: "Study only the outcome you already care about." },
        { title: "The cost", body: "The causes you then name may be just as common where the outcome never happened." }
      ]
    },
    {
      id: "ask",
      type: "claims",
      kicker: "",
      title: "What she wants to know",
      claims: [
        { title: "The question", body: "If you pick cases because they already have the outcome, do you still get a fair test?" },
        { title: "Not this", body: "A new theory of growth, or of revolution." },
        { title: "This", body: "A test of a habit in comparative work. Working paper 90-13, 1990." }
      ]
    },
    {
      id: "habit",
      type: "claims",
      kicker: "",
      title: "The habit",
      claims: [
        { title: "What you do", body: "Want revolution? Read revolutions. Want growth? Read the fast growers." },
        { title: "What you see", body: "What those cases share." },
        { title: "What you miss", body: "Whether the others share it too. The unit, all the way through, is the country." }
      ]
    },
    {
      id: "nics",
      type: "prompt",
      kicker: "",
      title: "Five fast growers, one shared trait",
      help: "",
      input: "text",
      viz: "list",
      placeholder: "Type your answer",
      ask: "If those five are all you read, what do you conclude?",
      names: ["Taiwan", "South Korea", "Singapore", "Brazil", "Mexico"],
      claims: [
        { title: "The cases", body: "In the fast years labour was repressed or coopted." },
        { title: "The claim", body: "Writers on the NICs said that helped growth. Johnson, O'Donnell, Cardoso, Koo, Deyo." },
        { title: "The problem", body: "Other countries may repress labour and still not grow. The conclusion does not follow." }
      ]
    },
    {
      id: "regions",
      type: "claims",
      kicker: "",
      title: "Growth by region, 1960 to 1982",
      chart: {
        id: "table1",
        title: "Average country growth rates",
        source: "Her Table 1. World Development Report, 1984 and 1988.",
        max: 6,
        bars: [
          { label: "East Asia", n: 5.2 },
          { label: "Middle East and North Africa", n: 4.7 },
          { label: "Latin America", n: 2.2 },
          { label: "South Asia", n: 1.4 },
          { label: "Africa", n: 1.0 }
        ]
      },
      claims: [
        { title: "The cases", body: "Average country growth, GNP per capita. Table 1." },
        { title: "The claim", body: "East Asia 5.2. Africa 1.0. The fastest region sits far above the rest." },
        { title: "The problem", body: "Geography is tied to growth. Pick East Asia and you have, in effect, picked on growth." }
      ]
    },
    {
      id: "scores",
      type: "claims",
      kicker: "",
      title: "How she scored labour",
      stats: [
        { value: "1", label: "Free unions, own leaders, strikes happen. India, Jamaica, Venezuela." },
        { value: "2", label: "Unions legal. Strikes rare or squeezed. Colombia, Zimbabwe, Malaysia." },
        { value: "3", label: "Tied to the government or party. South Korea, Brazil, Pakistan." },
        { value: "4", label: "Banned, or violence is severe. Chile 1973 to 1979, Syria, Benin." }
      ],
      claims: [
        { title: "The cases", body: "Country Reports on Human Rights Practices, 1980 and 1988." },
        { title: "The claim", body: "South Korea and Brazil sit at 3. She calls the score imperfect." },
        { title: "The problem", body: "Adequate for a methodological point. Not a perfect labour index." }
      ]
    },
    {
      id: "fits",
      type: "claims",
      kicker: "",
      title: "The same claim, three samples",
      stats: [
        { value: ".56", label: "East Asia only. Looks like a link. Figure 1, printed p. 8." },
        { value: ".07", label: "A wider Third World set. Almost nothing. Slope slightly down. Figure 2, printed p. 10." },
        { value: ".01", label: "Countries at least as advanced as South Korea." }
      ],
      claims: [
        { title: "The cases", body: "The five; East Asia; a wider Third World set; as advanced as South Korea." },
        { title: "The claim", body: "Among the five there was no real link. Slow countries repress labour too." },
        { title: "The problem", body: "The five-country picture does not travel. This simple check cannot disconfirm the claim." }
      ]
    },
    {
      id: "skocpol",
      type: "claims",
      kicker: "",
      title: "Skocpol",
      names: ["France", "Russia", "China"],
      claims: [
        { title: "The cases", body: "She picks the three because they had revolutions. Then a few misses. Printed p. 12." },
        { title: "The claim", body: "An outside military threat, reforms the dominant class can block, a split at the top. If villages are solidary and free of the landlord day to day, peasants rebel." },
        { title: "The problem", body: "She does not test every link. Geddes holds village and class still in nine Spanish-American countries." }
      ]
    },
    {
      id: "figure5",
      type: "claims",
      kicker: "",
      title: "What that check found",
      stats: [
        { value: "7", label: "Extreme military threat, no revolution." },
        { value: "2", label: "Revolutions with no such threat." },
        { value: "1", label: "Fits. Bolivia, defeated 1935, revolution 1952." }
      ],
      claims: [
        { title: "The cases", body: "Nine Spanish-American countries. Threat: a lost war plus invasion or lost land." },
        { title: "The claim", body: "Figure 5, printed p. 20. Seven, two, one." },
        { title: "The problem", body: "Not a definitive disconfirmation. The set is not random, and her threat score is crude." }
      ]
    },
    {
      id: "chile",
      type: "prompt",
      kicker: "",
      title: "Where you stop the story",
      help: "",
      input: "text",
      viz: "list",
      placeholder: "Type your answer",
      ask: "Which comparison would you trust, and why?",
      chart: {
        id: "chile-end",
        title: "Yearly inflation, late years from her Table 2",
        source: "Hirschman, p. 160, as she prints it. Printed pp. 22 to 23.",
        max: 90,
        unit: "%",
        bars: [
          { label: "1955", n: 84 },
          { label: "1956", n: 38 },
          { label: "1957", n: 17 },
          { label: "1958", n: 33 },
          { label: "1959", n: 33 },
          { label: "1960", n: 5 },
          { label: "1961", n: 10 }
        ]
      },
      claims: [
        { title: "The cases", body: "Hirschman on Chile ends in 1961, when Alessandri seemed to have tamed it." },
        { title: "The claim", body: "1955 was 84 percent. 1960 and 1961 are 5 and 10." },
        { title: "The problem", body: "Stop the story on a quiet year and that year can run the conclusion." }
      ]
    },
    {
      id: "close",
      type: "claims",
      kicker: "",
      title: "What this paper is for",
      claims: [
        { title: "The cases", body: "Three arguments she re-runs: labour and growth, Skocpol, Hirschman on Chile." },
        { title: "The claim", body: "Good for how a thing happened, and for a hunch. Not, on its own, a test." },
        { title: "The problem", body: "If you pick cases because they already have the outcome, you will often get the wrong answer. Printed p. 24." }
      ]
    }
  ],
  script: [
    {
      id: "open",
      title: "Title",
      say: "One line, then we sit with it. The cases you pick can change the answer. That is the paper.",
      notes: "Tobyn.\nLeave the title up.\nGo live when names show."
    },
    {
      id: "ask",
      title: "What she wants",
      say: "Geddes is not asking why Korea grew, or why France had a revolution. She is asking what happens when we pick cases because they already have the outcome we want to explain.",
      notes: "Working paper 90-13, 1990.\nThe lone 1 on the opening page is a footnote, not a page number."
    },
    {
      id: "habit",
      title: "The habit",
      say: "You want revolution, so you read revolutions. You then see what those cases share. You cannot see whether the others share it too.",
      notes: "Unit: the country."
    },
    {
      id: "nics",
      title: "Five growers",
      say: "Taiwan, South Korea, Singapore, Brazil, Mexico. In the fast years labour was repressed or coopted. Many who wrote on the NICs said that helped growth. If those five are all you have read, what do you conclude?",
      notes: "The five are named on the NIC page with footnotes 2 to 5. No printed page number is visible there.\nFirst live board. Then say what they wrote."
    },
    {
      id: "regions",
      title: "Regions",
      say: "Her Table 1. East Asia at 5.2. Africa at 1.0. Geography is tied to growth, so picking East Asia is, in effect, picking on the thing you want to explain.",
      notes: "Table 1 sits after the Figure 1 page, which is printed 8. No page number is visible on the table page itself.\nDo not invent a country rate."
    },
    {
      id: "scores",
      title: "Labour scores",
      say: "She scores labour from 1 to 4, from the Country Reports on Human Rights Practices, 1980 and 1988. South Korea and Brazil sit at 3. She calls the score imperfect.",
      notes: "Criteria sit on the pages just before Figure 1."
    },
    {
      id: "fits",
      title: "Three samples",
      say: "East Asia alone, r squared of .56. A wider Third World set, .07, slope slightly down. Countries at least as advanced as South Korea, .01. Among the five there was no real link. Slow countries repress labour too.",
      notes: "Figure 1 printed p. 8. Figure 2 printed p. 10.\nShe says this simple bivariate test cannot disconfirm the hypothesis."
    },
    {
      id: "skocpol",
      title: "Skocpol",
      say: "Same habit, on revolutions. She picks France, Russia and China because they had them. The story is a chain. Geddes holds the village and class setup still in nine Spanish-American countries, then asks whether a lost war still leads to revolution.",
      notes: "Raquel.\nSkocpol section starts printed p. 12. The nine are Mexico, Guatemala, El Salvador, Honduras, Nicaragua, Ecuador, Peru, Bolivia, Paraguay."
    },
    {
      id: "figure5",
      title: "Seven, two, one",
      say: "Seven extreme threats, no revolution. Two revolutions with no such threat. One fit, Bolivia, defeated 1935, revolution 1952. She says this is not a definitive disconfirmation.",
      notes: "Figure 5, printed p. 20."
    },
    {
      id: "chile",
      title: "Chile",
      say: "Hirschman stops in 1961, when Alessandri seemed to have tamed it. 1955 was 84 percent. 1960 and 1961 are 5 and 10. Which comparison would you trust, and why? The five growers, her bigger set, Skocpol's three, or the nine Spanish-American cases.",
      notes: "Table 2, printed pp. 22 to 23.\n1957 is 17, as she prints it.\nSecond live board."
    },
    {
      id: "close",
      title: "Last slide",
      say: "Case studies are good for how a thing happened, and for a hunch. They cannot, on their own, test the theory they just wrote. If you pick cases because they already have the outcome, you will often get the wrong answer.",
      notes: "Tobyn.\nPrinted pp. 24 to 25.\nStop."
    }
  ]
});
