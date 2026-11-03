/* Geddes (1990). One continuous deck. Cream and red. Script holds the handover. */
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
      kicker: "Geddes",
      title: "How the Cases You Choose Affect the Answers You Get",
      byline: "Barbara Geddes. IGS Working Paper 90-13, 1990.",
      presented: "Presented by Tobyn and Raquel",
      lede: "",
      agenda: [],
      speaker: "",
      claims: []
    },
    {
      id: "ask",
      type: "claims",
      kicker: "The paper",
      title: "What is she actually asking?",
      claims: [
        { n: "1", title: "Not a new theory", body: "She is not offering a new account of why Korea grew, or why France had a revolution." },
        { n: "2", title: "She is testing a habit", body: "I think she wants to know what happens when we pick cases because they already have the outcome." },
        { n: "3", title: "The unit is the country", body: "All the way through. Working paper 90-13, 1990." }
      ]
    },
    {
      id: "habit",
      type: "claims",
      kicker: "The habit",
      title: "What do you see if you only read winners?",
      claims: [
        { n: "1", title: "Read the winners", body: "Want revolution? Read revolutions. Want growth? Read the fast growers." },
        { n: "2", title: "Then the shared bits", body: "You then see what those cases share." },
        { n: "3", title: "The rest stay hidden", body: "You cannot see whether the others share it too." }
      ],
      fromClass: {
        week: 8,
        body: "Class called this sampling on the dependent variable. That is the habit she is testing."
      }
    },
    {
      id: "nics",
      type: "prompt",
      kicker: "The five",
      title: "What do the five actually give you?",
      help: "",
      input: "place",
      viz: "bars-list",
      ask: "",
      tokens: [
        "Labour was repressed or coopted",
        "That caused the growth",
        "You have not seen the slow cases"
      ],
      slots: [
        { id: "show", label: "What the five show" },
        { id: "not", label: "What does not follow" }
      ],
      placeKey: "That caused the growth",
      options: ["What the five show", "What does not follow"],
      names: ["Taiwan", "South Korea", "Singapore", "Brazil", "Mexico"],
      fromClass: {
        week: 8,
        body: "Same trap as the five fast growers. That is a sample on the dependent variable."
      }
    },
    {
      id: "regions",
      type: "claims",
      kicker: "Regions",
      title: "What happens if you pick East Asia?",
      chart: {
        id: "table1",
        title: "Table 1. Average country growth",
        source: "World Development Report, 1984 and 1988.",
        note: "I redrew the 1960 to 1982 column. East Asia is 5.2. Africa is 1.0.",
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
        { n: "1", title: "East Asia 5.2, Africa 1.0", body: "Average country growth, GNP per capita, 1960 to 1982." },
        { n: "2", title: "Picking East Asia picks growth", body: "Geography is tied to growth. Pick East Asia and you have, in effect, picked on growth." }
      ],
      fromClass: {
        week: 6,
        body: "A few famous cases cannot test a theory that says this usually happens. Pick East Asia and you have picked on growth."
      }
    },
    {
      id: "scores",
      type: "claims",
      kicker: "Labour",
      title: "How did she score the unions?",
      stats: [
        { value: "1", label: "Free unions, own leaders, strikes happen. India, Jamaica, Venezuela." },
        { value: "2", label: "Unions legal. Strikes rare or squeezed. Colombia, Zimbabwe, Malaysia." },
        { value: "3", label: "Tied to the government or party. South Korea, Brazil, Pakistan." },
        { value: "4", label: "Banned, or violence is severe. Chile 1973 to 1979, Syria, Benin." }
      ],
      claims: [
        { n: "1", title: "Country Reports, 1980 and 1988", body: "She calls the score imperfect." },
        { n: "2", title: "South Korea and Brazil sit at 3", body: "Fine for a methodological point. Not a perfect labour index." }
      ],
      fromClass: {
        week: 10,
        body: "How you define the score, and which cases you count, can change the answer. She calls the labour score imperfect."
      }
    },
    {
      id: "fits",
      type: "claims",
      kicker: "Samples",
      title: "Does the claim travel?",
      chart: {
        id: "r2",
        title: "r squared from Figures 1, 2 and 3",
        note: "I redrew the r squared values she prints. Figure 1, printed p. 8. Figure 2, printed p. 10. Figure 3 is the more advanced set.",
        max: 0.6,
        bars: [
          { label: "East Asia, Figure 1", n: 0.56 },
          { label: "Third World, Figure 2", n: 0.07 },
          { label: "As advanced as South Korea, Figure 3", n: 0.01 }
        ]
      },
      claims: [
        { n: "1", title: "No real link among the five", body: "Slow countries repress labour too." },
        { n: "2", title: "That picture does not travel", body: "This simple check cannot disconfirm the claim." }
      ]
    },
    {
      id: "skocpol",
      type: "claims",
      kicker: "Revolutions",
      title: "Same habit, different outcome?",
      names: ["France", "Russia", "China"],
      claims: [
        { n: "1", title: "France, Russia and China", body: "She picks the three because they had revolutions. Then a few misses. Printed p. 12." },
        { n: "2", title: "Threat, blocked reform, a split", body: "An outside military threat, reforms the dominant class can block, a split at the top. Solidary villages rebel." },
        { n: "3", title: "Nine Spanish-American countries", body: "Geddes holds village and class still. She does not test every link." }
      ]
    },
    {
      id: "figure5",
      type: "claims",
      kicker: "The check",
      title: "What did the nine countries show?",
      chart: {
        id: "figure5",
        title: "Figure 5. Defeat in war and revolution",
        note: "I counted the cells she printed. Printed p. 20. Threat here is a lost war plus invasion or lost land.",
        max: 7,
        bars: [
          { label: "Extreme threat, no revolution", n: 7 },
          { label: "Revolution, no such threat", n: 2 },
          { label: "Both. Bolivia 1935 and 1952", n: 1 }
        ]
      },
      claims: [
        { n: "1", title: "Figure 5, printed p. 20", body: "Threat: a lost war plus invasion or lost land." },
        { n: "2", title: "Not a definitive disconfirmation", body: "The set is not random, and her threat score is crude." }
      ]
    },
    {
      id: "chile",
      type: "prompt",
      kicker: "Chile",
      title: "Which comparison would you trust?",
      help: "",
      input: "choice-text",
      requireText: true,
      viz: "bars-list",
      ask: "",
      placeholder: "Say why",
      options: [
        "The five growers",
        "Her wider Third World set",
        "Skocpol's three revolutions",
        "The nine Spanish-American cases"
      ],
      chart: {
        id: "table2",
        title: "Table 2. Chilean inflation",
        note: "Four years from Table 2, printed pp. 22 to 23. Hirschman ends the series in 1961.",
        max: 84,
        unit: "%",
        bars: [
          { label: "1955", n: 84 },
          { label: "1957", n: 17 },
          { label: "1960", n: 5 },
          { label: "1961", n: 10 }
        ]
      },
      claims: [
        { n: "1", title: "Hirschman stops in 1961", body: "1955 was 84 per cent. 1960 and 1961 are 5 and 10. Printed pp. 22 to 23." }
      ]
    },
    {
      id: "close",
      type: "claims",
      kicker: "Close",
      title: "What is this paper for?",
      claims: [
        { n: "1", title: "She re-ran three checks", body: "Labour and growth, Skocpol, and Hirschman on Chile." },
        { n: "2", title: "Good for a hunch", body: "Good for how a thing happened. Not, on their own, a test." },
        { n: "3", title: "The wrong answer, often", body: "If you pick cases because they already have the outcome. Printed p. 24." }
      ]
    }
  ],
  script: [
    {
      id: "open",
      title: "Title",
      say: "The paper is in the title. Do the cases you pick change the answer.",
      notes: "Tobyn.\nPart 1.\nLeave the title up.\nGo live when names show."
    },
    {
      id: "ask",
      title: "What she wants",
      say: "I don't think she is asking why Korea grew. She is asking what happens when we pick cases because they already have the outcome.",
      notes: "Working paper 90-13, 1990.\nThe lone 1 on the opening page is a footnote, not a page number."
    },
    {
      id: "habit",
      title: "The habit",
      say: "You want revolution, so you read revolutions. You then see what those cases share. You cannot see whether the others share it too.",
      notes: "Unit: the country.\nWeek 8: class called this sampling on the dependent variable. That is her habit."
    },
    {
      id: "nics",
      title: "Five growers",
      say: "Taiwan, South Korea, Singapore, Brazil, Mexico. Labour was repressed or coopted. What do the five actually give you?",
      notes: "The five are named with footnotes 2 to 5.\nFirst live board. People drag the three lines onto the two trays.\nThen Reveal and read two or three.\nWeek 8: same trap. Sample on the dependent variable."
    },
    {
      id: "regions",
      title: "Regions",
      say: "Table 1. East Asia at 5.2. Africa at 1.0. Pick East Asia and you have, in effect, picked on the thing you want to explain.",
      notes: "Table 1 sits after the Figure 1 page, printed 8. No page number is visible on the table page itself.\nWeek 6: a few famous cases cannot test a usually claim. That is the East Asia pick."
    },
    {
      id: "scores",
      title: "Labour scores",
      say: "She scores labour from 1 to 4. South Korea and Brazil sit at 3. She calls the score imperfect.",
      notes: "Criteria sit on the pages just before Figure 1.\nWeek 10: how you define the score, and which cases you count, can change her answer."
    },
    {
      id: "fits",
      title: "Three samples",
      say: "East Asia alone, r squared of .56. A wider set, .07. As advanced as South Korea, .01. Among the five there was no real link.",
      notes: "Figure 1 printed p. 8. Figure 2 printed p. 10."
    },
    {
      id: "skocpol",
      title: "Skocpol",
      say: "Same habit, on revolutions. She picks France, Russia and China because they had them. Geddes holds village and class still in nine Spanish-American countries.",
      notes: "Raquel.\nPart 2.\nSkocpol section starts printed p. 12. The nine are Mexico, Guatemala, El Salvador, Honduras, Nicaragua, Ecuador, Peru, Bolivia, Paraguay."
    },
    {
      id: "figure5",
      title: "Seven, two, one",
      say: "Seven extreme threats, no revolution. Two revolutions with no such threat. One fit, Bolivia. She says this is not a definitive disconfirmation.",
      notes: "Figure 5, printed p. 20."
    },
    {
      id: "chile",
      title: "Which comparison",
      say: "Hirschman stops in 1961. 1955 was 84 per cent. 1960 and 1961 are 5 and 10. Which comparison would you trust, and why?",
      notes: "Table 2, printed pp. 22 to 23.\n1957 is 17, as she prints it.\nLeave it up. Give them a minute.\nAsk one person from two different picks."
    },
    {
      id: "close",
      title: "Last slide",
      say: "Case studies are good for how a thing happened, and for a hunch. They cannot, on their own, test the theory they just wrote.",
      notes: "Tobyn.\nClose.\nPrinted pp. 24 to 25.\nStop."
    }
  ]
});
