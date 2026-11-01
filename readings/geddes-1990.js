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
      kicker: "",
      title: "Do the cases you pick change the answer?",
      lede: "",
      agenda: [],
      speaker: "",
      claims: [
        { n: "1", title: "The paper", body: "How the cases you choose affect the answers you get. Selection bias in comparative politics." },
        { n: "2", title: "The habit", body: "Study only the outcome you already care about." },
        { n: "3", title: "The cost", body: "The causes you then name may be just as common where the outcome never happened." }
      ],
      fromClass: {
        week: 2,
        body: "Experts carry mind-sets that filter what they see. A method should catch the habit of picking only the cases you notice."
      }
    },
    {
      id: "ask",
      type: "claims",
      kicker: "1 · The paper",
      title: "What is she actually asking?",
      claims: [
        { n: "1", title: "Not a new theory", body: "She is not offering a new account of why Korea grew, or why France had a revolution." },
        { n: "2", title: "A test of a habit", body: "I think the paper tests what happens when we pick cases because they already have the outcome." },
        { n: "3", title: "The unit", body: "The unit, all the way through, is the country. Working paper 90-13, 1990." }
      ],
      fromClass: {
        week: 3,
        body: "Burlacu on corruption and voting: if corruption changes who turns out, studying only voters can mislead."
      }
    },
    {
      id: "habit",
      type: "claims",
      kicker: "1 · The habit",
      title: "What do you see if you only read winners?",
      claims: [
        { n: "1", title: "What you do", body: "Want revolution? Read revolutions. Want growth? Read the fast growers." },
        { n: "2", title: "What you see", body: "You then see what those cases share." },
        { n: "3", title: "What you miss", body: "You cannot see whether the others share it too." }
      ],
      fromClass: {
        week: 8,
        body: "Pape studied only suicide attacks, so he cannot say what causes them. Ashworth, Clinton, Meirowitz and Ramsay say he samples on the dependent variable."
      }
    },
    {
      id: "nics",
      type: "prompt",
      kicker: "1 · Discussion",
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
      kicker: "2 · Regions",
      title: "What happens if you pick East Asia?",
      chart: {
        id: "table1",
        title: "Table 1 · Average country growth",
        source: "World Development Report, 1984 and 1988.",
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
        { n: "1", title: "The rates", body: "East Asia 5.2. Africa 1.0. Average country growth, GNP per capita, 1960 to 1982." },
        { n: "2", title: "The problem", body: "Geography is tied to growth. Pick East Asia and you have, in effect, picked on growth." }
      ],
      fromClass: {
        week: 6,
        body: "Achen and Snidal: well-known crises skew the result. A few famous cases cannot test a theory that says this usually happens."
      }
    },
    {
      id: "scores",
      type: "claims",
      kicker: "2 · Labour",
      title: "How did she score the unions?",
      stats: [
        { value: "1", label: "Free unions, own leaders, strikes happen. India, Jamaica, Venezuela." },
        { value: "2", label: "Unions legal. Strikes rare or squeezed. Colombia, Zimbabwe, Malaysia." },
        { value: "3", label: "Tied to the government or party. South Korea, Brazil, Pakistan." },
        { value: "4", label: "Banned, or violence is severe. Chile 1973 to 1979, Syria, Benin." }
      ],
      claims: [
        { n: "1", title: "The source", body: "Country Reports on Human Rights Practices, 1980 and 1988. She calls the score imperfect." },
        { n: "2", title: "Good enough here", body: "South Korea and Brazil sit at 3. Adequate for a methodological point. Not a perfect labour index." }
      ],
      fromClass: {
        week: 10,
        body: "Bremer and Spiro: how you define democracy, and which cases you count, can change the answer."
      }
    },
    {
      id: "fits",
      type: "claims",
      kicker: "2 · Samples",
      title: "Does the claim travel?",
      stats: [
        { value: ".56", label: "East Asia only. Looks like a link. Figure 1, printed p. 8." },
        { value: ".07", label: "A wider Third World set. Almost nothing. Slope slightly down. Figure 2, printed p. 10." },
        { value: ".01", label: "Countries at least as advanced as South Korea." }
      ],
      claims: [
        { n: "1", title: "Among the five", body: "There was no real link. Slow countries repress labour too." },
        { n: "2", title: "The limit", body: "This simple check cannot disconfirm the claim. The five-country picture does not travel." }
      ],
      fromClass: {
        week: 4,
        body: "Horn, Johannesson and Mavroidis: a high WTO win rate may just mean states only file cases they expect to win."
      }
    },
    {
      id: "skocpol",
      type: "claims",
      kicker: "3 · Revolutions",
      title: "Same habit, different outcome?",
      names: ["France", "Russia", "China"],
      claims: [
        { n: "1", title: "The cases", body: "She picks the three because they had revolutions. Then a few misses. Printed p. 12." },
        { n: "2", title: "The chain", body: "An outside military threat, reforms the dominant class can block, a split at the top. Solidary villages rebel." },
        { n: "3", title: "The gap", body: "She does not test every link. Geddes holds village and class still in nine Spanish-American countries." }
      ]
    },
    {
      id: "figure5",
      type: "claims",
      kicker: "3 · The check",
      title: "What did the nine countries show?",
      stats: [
        { value: "7", label: "Extreme military threat, no revolution." },
        { value: "2", label: "Revolutions with no such threat." },
        { value: "1", label: "Fits. Bolivia, defeated 1935, revolution 1952." }
      ],
      claims: [
        { n: "1", title: "The count", body: "Figure 5, printed p. 20. Threat: a lost war plus invasion or lost land." },
        { n: "2", title: "Her caution", body: "Not a definitive disconfirmation. The set is not random, and her threat score is crude." }
      ]
    },
    {
      id: "chile",
      type: "prompt",
      kicker: "3 · Discussion",
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
      claims: [
        { n: "1", title: "A quiet year", body: "Hirschman on Chile ends in 1961. 1955 was 84 per cent. 1960 and 1961 are 5 and 10. Printed pp. 22 to 23." }
      ],
      fromClass: {
        week: 5,
        body: "Tomz used an experiment because history only shows the leaders who chose to back down."
      }
    },
    {
      id: "close",
      type: "claims",
      kicker: "4 · Close",
      title: "What is this paper for?",
      claims: [
        { n: "1", title: "What she re-ran", body: "Labour and growth, Skocpol, and Hirschman on Chile." },
        { n: "2", title: "What cases are good for", body: "Good for how a thing happened, and for a hunch. Not, on their own, a test." },
        { n: "3", title: "The risk", body: "If you pick cases because they already have the outcome, you will often get the wrong answer. Printed p. 24." }
      ],
      fromClass: {
        week: 9,
        body: "Errors and pitfalls in inference. That is the class topic. This paper is one way into it."
      }
    }
  ],
  script: [
    {
      id: "open",
      title: "Title",
      say: "One line, then we sit with it. Do the cases you pick change the answer. That is the paper.",
      notes: "Tobyn.\nPart 1.\nLeave the title up.\nGo live when names show.\nWeek 2: science is a cycle. Correlation is not cause. Ice cream and murder both rise in summer. Clark et al ch.1; Heuer ch.1."
    },
    {
      id: "ask",
      title: "What she wants",
      say: "I don't think she is asking why Korea grew. She is asking what happens when we pick cases because they already have the outcome.",
      notes: "Working paper 90-13, 1990.\nThe lone 1 on the opening page is a footnote, not a page number.\nWeek 3: Burlacu. Corruption may change who votes. X causes Y. Question, theory, hypothesis, then data."
    },
    {
      id: "habit",
      title: "The habit",
      say: "You want revolution, so you read revolutions. You then see what those cases share. You cannot see whether the others share it too.",
      notes: "Unit: the country.\nWeek 8: Pape 2003 studied only suicide attacks. Ashworth, Clinton, Meirowitz and Ramsay 2008: samples on the dependent variable."
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
      notes: "Table 1 sits after the Figure 1 page, printed 8. No page number is visible on the table page itself.\nWeek 6: Achen and Snidal 1989. Well-known crises skew results. Random assignment makes groups alike."
    },
    {
      id: "scores",
      title: "Labour scores",
      say: "She scores labour from 1 to 4. South Korea and Brazil sit at 3. She calls the score imperfect.",
      notes: "Criteria sit on the pages just before Figure 1.\nWeek 10: Bremer 1992 and Spiro 1994. How you define democracy and which cases count can change the answer. Zero wars may be chance because democracies were rare."
    },
    {
      id: "fits",
      title: "Three samples",
      say: "East Asia alone, r squared of .56. A wider set, .07. As advanced as South Korea, .01. Among the five there was no real link.",
      notes: "Figure 1 printed p. 8. Figure 2 printed p. 10.\nWeek 4: Horn, Johannesson and Mavroidis 2011. Look at the data before claiming cause. High WTO win rate may be case selection."
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
      notes: "Table 2, printed pp. 22 to 23.\n1957 is 17, as she prints it.\nLeave it up. Give them a minute.\nAsk one person from two different picks.\nWeek 5: four hurdles. Mechanism, no reverse cause, X and Y move together, no hidden Z. Tomz 2007."
    },
    {
      id: "close",
      title: "Last slide",
      say: "Case studies are good for how a thing happened, and for a hunch. They cannot, on their own, test the theory they just wrote.",
      notes: "Tobyn.\nClose.\nPrinted pp. 24 to 25.\nStop.\nWeek 9: errors and pitfalls in inference. Topic only. No authors on the board."
    }
  ]
});
