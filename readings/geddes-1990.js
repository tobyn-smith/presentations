/* Geddes (1990). One continuous deck. Numbers only where the scan prints them. */
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
      speaker: ""
    },
    {
      id: "ask",
      type: "points",
      kicker: "",
      title: "What she wants to know",
      lead: "",
      points: [
        { title: "", body: "If you pick cases because they already have the outcome, do you still get a fair test?" }
      ]
    },
    {
      id: "habit",
      type: "points",
      kicker: "",
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
      kicker: "",
      title: "Five fast growers",
      lead: "Taiwan, South Korea, Singapore, Brazil, Mexico. In the fast years labour was repressed or coopted. Writers on the NICs said that helped growth.",
      points: []
    },
    {
      id: "ask-five",
      type: "prompt",
      kicker: "",
      title: "If those five are all you read, what do you conclude?",
      help: "",
      input: "text",
      viz: "list",
      placeholder: "Type your answer"
    },
    {
      id: "regions",
      type: "charts",
      kicker: "",
      title: "Growth by region, 1960 to 1982",
      note: "East Asia is unusually fast. Pick that region and you have, in effect, picked on growth. Table 1.",
      charts: [
        {
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
        }
      ]
    },
    {
      id: "scores",
      type: "stats",
      kicker: "",
      title: "How she scored labour",
      footer: "Country Reports on Human Rights Practices, 1980 and 1988. She calls the score imperfect.",
      stats: [
        { value: "1", label: "Free unions, own leaders, strikes happen. India, Jamaica, Venezuela." },
        { value: "2", label: "Unions legal. Strikes rare or squeezed. Colombia, Zimbabwe, Malaysia." },
        { value: "3", label: "Tied to the government or party. South Korea, Brazil, Pakistan." },
        { value: "4", label: "Banned, or violence is severe. Chile 1973 to 1979, Syria, Benin." }
      ]
    },
    {
      id: "fits",
      type: "stats",
      kicker: "",
      title: "The same claim, three samples",
      footer: "Figure 1, printed p. 8. Figure 2, printed p. 10. This simple check cannot disconfirm the claim. It does show the five-country picture does not travel.",
      stats: [
        { value: ".56", label: "East Asia only. Looks like a link." },
        { value: ".07", label: "A wider Third World set. Almost nothing. Slope slightly down." },
        { value: ".01", label: "Countries at least as advanced as South Korea." }
      ]
    },
    {
      id: "skocpol",
      type: "points",
      kicker: "",
      title: "Skocpol",
      lead: "She picks France, Russia and China because they had revolutions. Then a few misses.",
      points: [
        { title: "The chain", body: "An outside military threat, reforms the dominant class can block, a split at the top. If villages are solidary and free of the landlord day to day, peasants rebel." },
        { title: "Her check", body: "Nine Spanish-American countries that already have that village and class setup. She then scores threat as a lost war plus invasion or lost land." }
      ]
    },
    {
      id: "figure5",
      type: "stats",
      kicker: "",
      title: "What that check found",
      footer: "Figure 5, printed p. 20. Not a definitive disconfirmation. The set is not random, and her threat score is crude.",
      stats: [
        { value: "7", label: "Extreme military threat, no revolution." },
        { value: "2", label: "Revolutions with no such threat." },
        { value: "1", label: "Fits. Bolivia, 1935 then 1952." }
      ]
    },
    {
      id: "chile",
      type: "charts",
      kicker: "",
      title: "Where you stop the story",
      note: "Hirschman on Chile ends in 1961, when Alessandri seemed to have tamed it. Table 2, printed pp. 22 to 23.",
      charts: [
        {
          id: "chile-end",
          title: "Yearly inflation, late years from her Table 2",
          source: "Hirschman, p. 160, as she prints it.",
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
        }
      ]
    },
    {
      id: "ask-trust",
      type: "prompt",
      kicker: "",
      title: "Which comparison would you trust, and why?",
      help: "",
      input: "text",
      viz: "list",
      placeholder: "Type your answer"
    },
    {
      id: "close",
      type: "points",
      kicker: "",
      title: "What this paper is for",
      lead: "Good for how a thing happened, and for a hunch. Not, on its own, a test.",
      points: [
        { title: "If you pick cases because they already have the outcome", body: "You will often get the wrong answer. Printed p. 24." }
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
      notes: "Working paper 90-13, 1990.\nOpening: selection on the dependent variable.\nThe lone 1 on that page is a footnote, not a page number."
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
      say: "Taiwan, South Korea, Singapore, Brazil, Mexico. In the fast years labour was repressed or coopted. Johnson, O'Donnell, Cardoso, Koo, Deyo. Many who wrote on the NICs said that helped growth.",
      notes: "The five are named on the NIC page with footnotes 2 to 5. No printed page number is visible there.\nShe then says the conclusion does not follow."
    },
    {
      id: "ask-five",
      title: "If you only read five",
      say: "If those five are all you have read, what do you conclude? A sentence is enough.",
      notes: "First live board.\nThen say what they wrote."
    },
    {
      id: "regions",
      title: "Regions",
      say: "Her Table 1. East Asia at 5.2. Africa at 1.0. Geography is tied to growth, so picking East Asia is, in effect, picking on the thing you want to explain.",
      notes: "Table 1 sits after the Figure 1 page, which is printed 8. No page number is visible on the table page itself.\nDo not invent a country rate. The five are not given separate growth numbers on the scan."
    },
    {
      id: "scores",
      title: "Labour scores",
      say: "She scores labour from 1 to 4, from the Country Reports on Human Rights Practices, 1980 and 1988. South Korea and Brazil sit at 3. She calls the score imperfect.",
      notes: "Criteria and examples are on the pages just before Figure 1. No printed page number is visible on those pages.\nShe says it is adequate for a methodological point."
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
      notes: "Raquel.\nSkocpol section starts printed p. 12. The nine are Mexico, Guatemala, El Salvador, Honduras, Nicaragua, Ecuador, Peru, Bolivia, Paraguay. Printed p. 17 is visible on that page.\nThreat in her test: lost a war plus invasion or lost land. That is her bar, not Skocpol's original wording."
    },
    {
      id: "figure5",
      title: "Seven, two, one",
      say: "Seven extreme threats, no revolution. Two revolutions with no such threat. One fit, Bolivia, defeated 1935, revolution 1952. She says this is not a definitive disconfirmation.",
      notes: "Figure 5, printed p. 20.\nThe two without that threat are on her figure: Nicaragua 1979 and Cuba 1959, which she marks as intermediate."
    },
    {
      id: "chile",
      title: "Chile",
      say: "Hirschman stops in 1961, when Alessandri seemed to have tamed it. 1955 was 84 percent. 1960 and 1961 are 5 and 10. If you stop the story on a quiet year, that year can run the conclusion.",
      notes: "Table 2, printed pp. 22 to 23.\nSource on the scan: Hirschman, p. 160.\n1957 is 17, as she prints it."
    },
    {
      id: "ask-trust",
      title: "Which comparison",
      say: "Which comparison would you trust, and why? The five growers, her bigger set, Skocpol's three, or the nine Spanish-American cases.",
      notes: "Second and last live board.\nLeave time for the last slide."
    },
    {
      id: "close",
      title: "Last slide",
      say: "Case studies are good for how a thing happened, and for a hunch. They cannot, on their own, test the theory they just wrote. If you pick cases because they already have the outcome, you will often get the wrong answer.",
      notes: "Tobyn.\nPrinted pp. 24 to 25.\nHer line: selecting on the dependent variable entails a high probability of getting the wrong answer.\nStop."
    }
  ]
});
