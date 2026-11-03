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
      id: "quote-universe",
      type: "claims",
      kicker: "From the paper",
      title: "How do you even pick?",
      quote: {
        text: "The two tasks crucial to testing any hypothesis are to identify the universe of cases to which the hypothesis should apply and to find or develop measures of the variables. If the universe is too large to make examining every case feasible, cases should be selected from it at random.",
        cite: "Geddes, IGS Working Paper 90-13, 1990."
      }
    },
    {
      id: "nics",
      type: "prompt",
      kicker: "Case 1. Labour and growth",
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
      kicker: "Case 1. Labour and growth",
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
      kicker: "Case 1. Labour and growth",
      title: "How did she score the unions?",
      stats: [
        { value: "1", label: "Free unions, own leaders, strikes happen. India, Jamaica, Venezuela." },
        { value: "2", label: "Unions legal. Strikes rare or squeezed. Colombia, Zimbabwe, Malaysia." },
        { value: "3", label: "Tied to the government or party. South Korea, Brazil, Pakistan." },
        { value: "4", label: "Banned, or violence is severe. Chile 1973 to 1979, Syria, Benin." }
      ],
      claims: [
        { n: "1", title: "Country Reports, 1980 and 1988", body: "She calls the score imperfect." },
        { n: "2", title: "The five all sit at 3", body: "Singapore, South Korea, Taiwan, Brazil, Mexico. Repression does not vary. There is no slow country in that set." }
      ],
      fromClass: {
        week: 10,
        body: "How you define the score, and which cases you count, can change the answer. She calls the labour score imperfect."
      }
    },
    {
      id: "fits",
      type: "claims",
      kicker: "Case 1. Labour and growth",
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
        { n: "1", title: "East Asia looks tidy", body: "Figure 1, r squared 0.56. Growth is highest at repression 3." },
        { n: "2", title: "A wider set does not", body: "Figure 2, 0.07. Figure 3, 0.01. Two readings: a curve, or a few unusual cases." },
        { n: "3", title: "Not a disproof", body: "The test does not prove the claim false. The link vanishes in a representative sample." }
      ]
    },
    {
      id: "quote-sample",
      type: "claims",
      kicker: "From the paper",
      title: "What can a small sample claim?",
      quote: {
        text: "One should not make inferences based on small samples selected on the dependent variable. This is not to say that a relationship found within the sample will never characterize the population, but only that one cannot assume that it does.",
        cite: "Geddes, IGS Working Paper 90-13, 1990."
      }
    },
    {
      id: "skocpol",
      type: "claims",
      kicker: "Case 2. Skocpol on revolutions",
      title: "What are the three links?",
      names: ["France", "Russia", "China"],
      claims: [
        { n: "1", title: "Threat leads to reform", body: "A foreign military threat pushes the state to try reform." },
        { n: "2", title: "Reform can split the elite", body: "The split comes where the dominant class has its own base and shares power." },
        { n: "3", title: "A split is not enough", body: "Revolution follows only where villages are autonomous. Printed p. 12." }
      ]
    },
    {
      id: "contrast",
      type: "claims",
      kicker: "Case 2. Skocpol on revolutions",
      title: "Where does the chain break?",
      claims: [
        { n: "1", title: "Prussia and Japan", body: "The threat was as bad as in France. The dominant class had no independent base. No elite split. No revolution." },
        { n: "2", title: "Britain 1640 to 1660", body: "The elite split. Villages were not autonomous. No revolution." },
        { n: "3", title: "Prussia 1848", body: "Same break. Split at the top. Villages not free. No revolution." }
      ]
    },
    {
      id: "figure4",
      type: "compare",
      kicker: "Case 2. Skocpol on revolutions",
      title: "What does Figure 4 actually show?",
      lead: "I redrew the two tables on p. 14. I did not add counts she did not print.",
      left: {
        label: "After a military threat",
        title: "Who stays together",
        body: "Independent class that shares power: France. China after the Taiping Rebellion. Dependent class kept from power: Prussia, Japan, Russia before the First World War, China before the Taiping Rebellion."
      },
      right: {
        label: "After an elite split",
        title: "Who gets a revolution",
        body: "Villages autonomous: Russia, France, Communist areas of China. Villages not autonomous: Britain 1640 to 1660, Germany 1848, China before the Communists."
      }
    },
    {
      id: "figure5",
      type: "claims",
      kicker: "Case 2. Skocpol on revolutions",
      title: "What did the nine countries show?",
      chart: {
        id: "figure5",
        title: "Figure 5. Defeat in war and revolution",
        note: "I counted the cells she printed. Printed p. 20. Nine Spanish American countries. Lost war plus invasion or lost land. Up to 20 years to revolution.",
        max: 7,
        bars: [
          { label: "Defeat, no revolution", n: 7 },
          { label: "Revolution, no such defeat", n: 2 },
          { label: "Both. Bolivia 1935 and 1952", n: 1 }
        ]
      },
      claims: [
        { n: "1", title: "Seven, two, and one", body: "Mexico 1910 and Nicaragua 1979 had no such defeat. Bolivia fits: 1935 defeat, 1952 revolution." },
        { n: "2", title: "Doubt, not disproof", body: "The set is not random, and her threat score is crude. She calls this doubt, not a disproof." }
      ]
    },
    {
      id: "hirschman",
      type: "claims",
      kicker: "Case 3. Hirschman on Chile",
      title: "What if the series stops early?",
      chart: {
        id: "figure6",
        title: "Figure 6, from Table 2",
        note: "Printed years from Table 2, pp. 22 to 23. Hirschman ends in 1961. Figure 6 continues to 1972. I did not plot years she did not print as numbers.",
        max: 84,
        unit: "%",
        bars: [
          { label: "1955", n: 84 },
          { label: "1956", n: 38 },
          { label: "1957", n: 17 },
          { label: "1960", n: 5 },
          { label: "1961", n: 10 }
        ]
      },
      claims: [
        { n: "1", title: "He stops on a low", body: "Chile 1930 to 1961. 1955 is 84 per cent. 1960 and 1961 are 5 and 10." },
        { n: "2", title: "The end shapes the story", body: "Figure 6 runs to 1972. She says it does not look solved. Later it goes past 100 per cent." }
      ]
    },
    {
      id: "chile",
      type: "prompt",
      kicker: "Case 3. Hirschman on Chile",
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
        "The nine Spanish American cases"
      ]
    },
    {
      id: "close",
      type: "claims",
      kicker: "Close",
      title: "Studying only the cases where something happened can inspire a new theory, but only cases where it did not happen as well can test it.",
      claims: [
        { n: "1", title: "Compare the outcomes", body: "Winners can start a theory. Cases where it did not happen have to be in the test." },
        { n: "2", title: "Check your sample", body: "A link in a small selected sample may vanish in a broader one. The years you study can change the conclusion." },
        { n: "3", title: "Generating is not testing", body: "A hunch from the winners is fine. It is not a test. Same rule on our own papers." }
      ]
    },
    {
      id: "discuss",
      type: "claims",
      kicker: "Discussion",
      title: "What do you want to argue with?",
      claims: [
        { n: "1", title: "Only the friendly cases", body: "What is the danger of working only with cases that support the argument?" },
        { n: "2", title: "Too many cases", body: "If the universe is huge, how do you choose?" },
        { n: "3", title: "Where the series ends", body: "How do you pick an endpoint? Must you always use the most recent data?" }
      ]
    },
    {
      id: "pairs",
      type: "claims",
      kicker: "Five minutes",
      title: "How are you picking cases?",
      claims: [
        { n: "1", title: "Your own research", body: "How are you selecting cases for your own work? This is the Research Design assignment." },
        { n: "2", title: "The missing outcome", body: "Would your selection include cases where the outcome did not occur?" }
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
      id: "quote-universe",
      title: "Universe quote",
      say: "She says the two tasks are to name the universe the claim should cover, and to measure the variables. If you cannot read every case, pick at random.",
      notes: "Exact lines from the labour section. Checked against the IGS PDF."
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
      say: "She scores labour from 1 to 4. The five famous growers all sit at 3. Repression does not vary in that set.",
      notes: "Criteria sit on the pages just before Figure 1.\nWeek 10: how you define the score, and which cases you count, can change her answer."
    },
    {
      id: "fits",
      title: "Three samples",
      say: "East Asia alone, r squared of .56. A wider set, .07. As advanced as South Korea, .01. The link vanishes. That is not a disproof.",
      notes: "Figure 1 printed p. 8. Figure 2 printed p. 10. Figure 3 is the more advanced set.\nLast labour board. Then the second quote, then Raquel."
    },
    {
      id: "quote-sample",
      title: "Sample quote",
      say: "A link inside a small selected sample might be true in the population. You cannot assume that it is.",
      notes: "Exact lines from the paper. Checked against the IGS PDF."
    },
    {
      id: "skocpol",
      title: "Three links",
      say: "Same habit, on revolutions. Threat, then reform, then a split where the dominant class has its own base, then revolution only if villages are autonomous.",
      notes: "Raquel.\nPart 2.\nSkocpol section starts printed p. 12."
    },
    {
      id: "contrast",
      title: "Where it breaks",
      say: "Prussia and Japan: threat, no split. Britain 1640 to 1660 and Prussia 1848: split, villages not free. No revolution.",
      notes: "Printed with Figure 4 on p. 14."
    },
    {
      id: "figure4",
      title: "Figure 4",
      say: "Two small tables. I redrew what she printed. No extra numbers.",
      notes: "Figure 4, printed p. 14."
    },
    {
      id: "figure5",
      title: "Seven, two, one",
      say: "Nine Spanish American countries. Seven defeats, no revolution. Mexico 1910 and Nicaragua 1979 with no such defeat. Bolivia fits. Doubt, not disproof.",
      notes: "Figure 5, printed p. 20."
    },
    {
      id: "hirschman",
      title: "Hirschman",
      say: "He stops in 1961 on a low. 1955 was 84 per cent. Figure 6 runs to 1972. The end of the series shapes the story.",
      notes: "Tobyn.\nCase 3.\nTable 2, printed pp. 22 to 23.\nFigure 6 follows the table. I did not invent yearly bars after 1961."
    },
    {
      id: "chile",
      title: "Which comparison",
      say: "Which comparison would you trust, and why?",
      notes: "Leave it up. Give them a minute.\nAsk one person from two different picks."
    },
    {
      id: "close",
      title: "Last claim",
      say: "Cases where it happened can start a theory. Cases where it did not have to be in the test. Same rule on our papers.",
      notes: "Tobyn.\nClose.\nPrinted pp. 24 to 25."
    },
    {
      id: "discuss",
      title: "Discussion",
      say: "Three questions. Friendly cases. Too many cases. Where a series ends.",
      notes: "Tobyn.\nStay on this if the room is talking."
    },
    {
      id: "pairs",
      title: "Pairs",
      say: "Five minutes. How are you picking cases, and would you include cases where the outcome did not happen?",
      notes: "Tobyn.\nOptional. Research Design assignment.\nSkip if time is gone."
    }
  ]
});
