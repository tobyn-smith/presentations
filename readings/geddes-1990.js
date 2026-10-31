/* Geddes, IGS Working Paper 90-13 (1990). Two parts. Numbers only where
   the scan shows them. No phone-instruction lines. */
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
      kicker: "Part 1",
      title: "How the cases you choose affect the answers you get",
      lede: "Geddes, 1990. Selection bias in comparative politics.",
      agenda: [
        "Part 1 · the five growers and her numbers",
        "Part 2 · Skocpol, Hirschman, and the close"
      ],
      speaker: ""
    },
    {
      id: "ask",
      type: "points",
      kicker: "Part 1",
      title: "What she wants to know",
      lead: "Not a new theory of growth or revolution. A test of a habit.",
      points: [
        { title: "The habit", body: "Study only the outcome you already care about." },
        { title: "The worry", body: "The causes you then name may be just as common where the outcome never happened." }
      ]
    },
    {
      id: "habit",
      type: "points",
      kicker: "Part 1",
      title: "How the habit works",
      lead: "Want revolution? Read revolutions. Want growth? Read the fast growers.",
      points: [
        { title: "What you can see", body: "What those cases share." },
        { title: "What you cannot", body: "Whether the others share it too." },
        { title: "Unit", body: "The country, in every example she works through." }
      ]
    },
    {
      id: "nics",
      type: "points",
      kicker: "Part 1",
      title: "The five she keeps seeing",
      lead: "Taiwan, South Korea, Singapore, Brazil, Mexico. Printed p. 5.",
      points: [
        { title: "What they share", body: "In the fast years, labour was held down or brought inside the state." },
        { title: "The claim", body: "Johnson, O'Donnell, Cardoso, Koo, Deyo give different reasons. The shared line is that this helped growth." }
      ]
    },
    {
      id: "regions",
      type: "charts",
      kicker: "Part 1",
      title: "Growth by region, 1960 to 1982",
      note: "Average country growth in GNP per capita. Printed p. 8, Table 1. East Asia sits far above the rest, so picking East Asia is close to picking on growth.",
      charts: [
        {
          id: "table1",
          title: "World Bank figures she calculates",
          source: "World Development Report, 1984 and 1988. Printed p. 8.",
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
      title: "Her labour scores, 1 to 4",
      footer: "From US Country Reports on Human Rights Practices, 1980 and 1988. Printed pp. 7 to 8.",
      stats: [
        { value: "1", label: "Free unions, strikes happen. India, Jamaica, Venezuela." },
        { value: "2", label: "Unions exist, strikes rare or squeezed. Colombia, Zimbabwe, Malaysia." },
        { value: "3", label: "Tied to the party or state. South Korea, Brazil, Pakistan." },
        { value: "4", label: "Illegal, captured, or very violent. Chile 1973 to 1979, Syria, Benin." }
      ]
    },
    {
      id: "ask-score",
      type: "prompt",
      kicker: "Part 1",
      title: "A country has unions, but strikes almost never happen. Where does that sit on her 1 to 4?",
      help: "",
      input: "text",
      viz: "list",
      placeholder: "Type your answer"
    },
    {
      id: "fits",
      type: "stats",
      kicker: "Part 1",
      title: "What the scatter plots do",
      footer: "Printed pp. 8 and 10. She says the simple check cannot kill the labour-and-growth claim. Controls might still save it.",
      stats: [
        { value: ".56", label: "r squared, East Asia only. Looks like repression helps." },
        { value: ".07", label: "r squared, a wider Third World set. The link is gone. Slope slightly down." },
        { value: ".01", label: "r squared, countries at least as advanced as South Korea." }
      ]
    },
    {
      id: "wider",
      type: "points",
      kicker: "Part 1",
      title: "The wider set",
      lead: "Taiwan plus developing countries in the World Bank files, with rich oil states, communist states, long civil wars, and tiny states left out.",
      points: [
        { title: "Among the five", body: "No real link between how hard labour was held and how fast they grew." },
        { title: "In the bigger set", body: "Slow countries hold labour down too. Printed p. 10." }
      ]
    },
    {
      id: "part2",
      type: "title",
      kicker: "Part 2",
      title: "Same habit. Harder stories.",
      lede: "Skocpol, then where Hirschman stops the clock.",
      agenda: [],
      speaker: ""
    },
    {
      id: "skocpol",
      type: "points",
      kicker: "Part 2",
      title: "Skocpol",
      lead: "France, Russia, China, because they had revolutions. Then a few misses. Printed pp. 12 to 13.",
      points: [
        { title: "The chain", body: "A war or invasion, a fight inside the elite, villages that can move on their own, then revolution." },
        { title: "What she tests", body: "She takes nine Spanish-American countries that already have that village and class setup. Threat here means a lost war plus invasion or lost land." }
      ]
    },
    {
      id: "figure5",
      type: "stats",
      kicker: "Part 2",
      title: "Defeat in war, and revolution",
      footer: "Printed p. 20. Not a kill, she says. The set is not random, and threat is crude.",
      stats: [
        { value: "7", label: "Hard threats, no revolution." },
        { value: "2", label: "Revolutions with no such threat." },
        { value: "1", label: "Fits the chain. Bolivia, once." }
      ]
    },
    {
      id: "chile",
      type: "charts",
      kicker: "Part 2",
      title: "Chilean inflation, late in his story",
      note: "Hirschman stops in 1961, when it looked tamed. Printed pp. 21 to 23, Table 2.",
      charts: [
        {
          id: "chile-end",
          title: "Yearly rate, selected years from her table",
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
      lead: "Good for a hunch. Not, on its own, a test. Printed p. 24.",
      points: [
        { title: "If you pick cases because they already have the outcome", body: "You will often get the wrong answer." }
      ]
    }
  ],
  script: [
    {
      id: "open",
      title: "Open",
      say: "Geddes, 1990. How the cases you choose affect the answers you get. Two parts. Numbers first, then two harder stories.",
      notes: "Leave the title up.\nGo live when names show."
    },
    {
      id: "ask",
      title: "What she wants",
      say: "She is not asking why Korea grew. She is asking whether a habit in comparative work still gives you a fair test.",
      notes: "Goal: explanation of a method.\nWorking paper 90-13."
    },
    {
      id: "habit",
      title: "The habit",
      say: "You want revolution, so you read revolutions. You then see what those cases share. You cannot see whether the others share it too. The unit, all the way through, is the country.",
      notes: "Opening of the paper.\nThe lone 1 on that page is a footnote, not a page number."
    },
    {
      id: "nics",
      title: "Five growers",
      say: "Taiwan, South Korea, Singapore, Brazil, Mexico. In the fast years, labour was held down. Several well-known people said that helped growth. Printed page 5.",
      notes: "Actors: governments and workers. It matters, because the claim is about how states treat labour."
    },
    {
      id: "regions",
      title: "Regions",
      say: "Her Table 1. East Asia at 5.2. Africa at 1.0. If you pick East Asia, you have already leaned toward the fast cases.",
      notes: "Printed p. 8.\nDo not invent a country rate. The five are not given separate growth numbers on the scan."
    },
    {
      id: "scores",
      title: "Labour scores",
      say: "She builds a 1 to 4 from the US human rights reports. South Korea and Brazil sit at 3. Chile under the junta at 4. She calls it imperfect.",
      notes: "Printed pp. 7 to 8."
    },
    {
      id: "ask-score",
      title: "Score",
      say: "A country has unions, but strikes almost never happen. Where does that sit on her 1 to 4? A number is enough.",
      notes: "She would put that near 2.\nOne board. Do not add another poll."
    },
    {
      id: "fits",
      title: "The fits",
      say: "East Asia alone, r squared of .56. A wider Third World set, .07, slope slightly down. The more advanced cut, .01. The NIC picture does not travel.",
      notes: "Printed p. 10.\nShe says this cannot kill the claim on its own."
    },
    {
      id: "wider",
      title: "Wider look",
      say: "Among the five, no real link. In the bigger set, slow countries hold labour down too.",
      notes: "Printed p. 10."
    },
    {
      id: "part2",
      title: "Part 2",
      say: "Same habit. Two harder stories. Then we stop.",
      notes: "About ten minutes left."
    },
    {
      id: "skocpol",
      title: "Skocpol",
      say: "She picks France, Russia and China because they had revolutions. The story is a chain. Geddes holds the village and class setup still, then asks whether war still leads to revolution.",
      notes: "Printed pp. 12 to 13."
    },
    {
      id: "figure5",
      title: "Seven, two, one",
      say: "Seven hard threats, no revolution. Two revolutions with no such threat. One fit, Bolivia. She says this is not a kill.",
      notes: "Printed p. 20."
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
      title: "Close",
      say: "Case studies are good for how a thing happened, and for a hunch. They cannot, on their own, test the theory they just wrote. If you pick cases because they already have the outcome, you will often get the wrong answer.",
      notes: "Printed pp. 24 to 25.\nStop."
    }
  ]
});
