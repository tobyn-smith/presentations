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
      title: "What is she asking?",
      claims: [
        { n: "1", title: "Korea and France", body: "This is not a paper about why Korea grew, or why France had a revolution." },
        { n: "2", title: "Picking on the outcome", body: "She looks at what happens when we only study countries that already have the result." }
      ]
    },
    {
      id: "habit",
      type: "claims",
      kicker: "The habit",
      title: "Reading only winners",
      claims: [
        { n: "1", title: "France, Russia, China", body: "Want revolution, you read those. Want growth, you read Taiwan, Korea, Singapore, Brazil, Mexico." },
        { n: "2", title: "Slow cases stay off the desk", body: "The slower-growing countries are left out, so you cannot check whether they share the same traits." }
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
      title: "How do you pick?",
      quote: {
        text: "The two tasks crucial to testing any hypothesis are to identify the universe of cases to which the hypothesis should apply and to find or develop measures of the variables. If the universe is too large to make examining every case feasible, cases should be selected from it at random.",
        cite: "Geddes, IGS Working Paper 90-13, 1990."
      }
    },
    {
      id: "nics",
      type: "prompt",
      kicker: "Case 1. Labour and growth",
      title: "The five growers",
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
      title: "East Asia, 5.2",
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
        { n: "1", title: "Table 1, 1960 to 1982", body: "Average GNP per capita growth. East Asia 5.2. Africa 1.0." },
        { n: "2", title: "You already picked growth", body: "Choose East Asia and the high-growth countries are in the bag." }
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
      title: "Labour scored 1 to 4",
      stats: [
        { value: "1", label: "Free unions, own leaders, strikes happen. India, Jamaica, Venezuela." },
        { value: "2", label: "Unions legal. Strikes rare or squeezed. Colombia, Zimbabwe, Malaysia." },
        { value: "3", label: "Tied to the government or party. South Korea, Brazil, Pakistan." },
        { value: "4", label: "Banned, or violence is severe. Chile 1973 to 1979, Syria, Benin." }
      ],
      claims: [
        { n: "1", title: "Country Reports", body: "1980 and 1988. She says the coding is imperfect." },
        { n: "2", title: "The five do not test the link", body: "All five are fast growers with repressed or coopted labour. That alone cannot show that repression caused growth." }
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
      title: "Three samples, three r squareds",
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
        { n: "1", title: "Figure 1, East Asia", body: "r squared 0.56. Growth highest at labour score 3." },
        { n: "2", title: "The wider samples", body: "Figure 2 is 0.07 and Figure 3 is 0.01. The simple link weakens, but she warns that a few East Asian cases may drive the result and a curved relationship is possible." }
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
      title: "France, Russia, China",
      names: ["France", "Russia", "China"],
      claims: [
        { n: "1", title: "War, then reform", body: "An external military threat pushes state officials to try reforms." },
        { n: "2", title: "The landed class can split", body: "A landed class with its own economic base and a share of power can resist reform, splitting the elite." },
        { n: "3", title: "Villages on their own", body: "An elite split is not enough. Peasant rebellion also depends on villages being autonomous from landlords." }
      ]
    },
    {
      id: "contrast",
      type: "claims",
      kicker: "Case 2. Skocpol on revolutions",
      title: "No revolution",
      claims: [
        { n: "1", title: "Prussia and Japan", body: "The threat was as bad as France. The dominant class had no independent base, so no split." },
        { n: "2", title: "Britain, 1640 to 1660", body: "The elite did split. Villages were not autonomous." },
        { n: "3", title: "Prussia, 1848", body: "Split at the top again. Villages still not free." }
      ]
    },
    {
      id: "figure4",
      type: "compare",
      kicker: "Case 2. Skocpol on revolutions",
      title: "Figure 4, page 14",
      lead: "Two tables she printed. I did not add counts.",
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
      title: "Figure 5, nine Spanish American cases",
      chart: {
        id: "figure5",
        title: "Figure 5. Defeat in war and revolution",
        note: "Counts of cases in Figure 5, printed p. 20, not a count of nine separate countries in each bar. Defeat means losing a war with invasion and/or loss of territory; revolution is tracked over the following 20 years.",
        max: 7,
        bars: [
          { label: "Defeat, no revolution", n: 7 },
          { label: "Revolution, no such defeat", n: 2 },
          { label: "Both. Bolivia 1935 and 1952", n: 1 }
        ]
      },
      claims: [
        { n: "1", title: "Seven, two, and one", body: "Seven defeat cases had no revolution. Two revolutions had no such defeat. These are instances in her comparison, not nine country labels." },
        { n: "2", title: "Bolivia is the one match", body: "The result raises doubt, not a final rejection. Geddes says the threat measure is imperfect and the cases are not a random sample." }
      ]
    },
    {
      id: "hirschman",
      type: "claims",
      kicker: "Case 3. Hirschman on Chile",
      title: "Hirschman stops in 1961",
      chart: {
        id: "figure6",
        title: "Table 2. Chilean inflation, selected years",
        note: "Selected figures from Table 2, printed pp. 22 to 23. Figure 6 is a separate series that continues to 1972; these five bars are not the full Figure 6 data.",
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
        { n: "1", title: "84, then 5 and 10", body: "Chile inflation, 1930 to 1961. 84 per cent in 1955. 5 in 1960. 10 in 1961." },
        { n: "2", title: "The series continues", body: "Figure 6 extends to 1972 and changes the picture. Geddes suggests the earlier fall may reflect orthodox stabilisation under Alessandri." }
      ]
    },
    {
      id: "chile",
      type: "prompt",
      kicker: "Case 3. Hirschman on Chile",
      title: "Which comparison?",
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
      title: "What case selection does",
      claims: [
        { n: "1", title: "Selected cases can start ideas", body: "France can help develop an explanation for revolution. The five fast growers can do the same for growth." },
        { n: "2", title: "Testing needs a wider set", body: "To test the explanation, include cases where the outcome did not happen and think carefully about where the historical series ends." }
      ]
    },
    {
      id: "discuss",
      type: "claims",
      kicker: "Discussion",
      title: "Questions",
      claims: [
        { n: "1", title: "Only France, Russia, China", body: "What happens if those are the only revolutions you keep?" },
        { n: "2", title: "Table 1 is huge", body: "You cannot read every country. How would you pick?" },
        { n: "3", title: "Hirschman ended in 1961", body: "Would you stop there, or keep going to 1972?" }
      ]
    },
    {
      id: "pairs",
      type: "claims",
      kicker: "Five minutes",
      title: "Five minutes",
      claims: [
        { n: "1", title: "Research Design assignment", body: "How are you picking countries for your own work?" },
        { n: "2", title: "A case where it never happens", body: "Is that case still in your set?" }
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
      say: "Taiwan, South Korea, Singapore, Brazil, Mexico. Labour was repressed or coopted. What do the five give you?",
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
      say: "She scores labour from 1 to 4, using country reports. The five are all fast growers with repressed or coopted labour. That tells us what the selected cases share, but not whether it caused growth.",
      notes: "Criteria sit on the pages just before Figure 1.\nWeek 10: how you define the score, and which cases you count, can change her answer."
    },
    {
      id: "fits",
      title: "Three samples",
      say: "East Asia gives an r squared of .56. The wider Third World set gives .07, and the more advanced set .01. The simple link weakens. She is careful not to call that a disproof: the relationship could be curved, and other factors may matter.",
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
      say: "Raquel takes the same problem into Skocpol’s work on revolutions. An external threat pushes reform, reform can split the elite, and peasant rebellion is possible where villages are autonomous from landlords.",
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
      say: "Hirschman’s account ends in 1961, when inflation is still relatively low. Geddes carries the series on to 1972, and the later years change the picture. She suggests the earlier fall may be linked to Alessandri’s orthodox stabilisation policies.",
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
      say: "Cases where the outcome happened can help us develop a theory or spot something worth explaining. But they cannot test it on their own. For that, we need cases where the outcome did not happen as well.",
      notes: "Tobyn.\nClose.\nPrinted pp. 24 to 25."
    },
    {
      id: "discuss",
      title: "Discussion",
      say: "There are three questions to leave with: what happens when we only keep familiar cases, how we choose when there are too many cases to study, and when we decide a historical series has ended.",
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
