/* Tobyn's Methods research-design talk. Speaking material from his 30 Oct draft.
   Three choices stay marked Tobyn to decide. No results. */
window.PROJECT_SLIDES = [
  {
    id: "proj-title",
    type: "title",
    kicker: "INTL 6010",
    title: "Who answers when it goes wrong?",
    lede: "A short online game about AI and blame.",
    agenda: [],
    speaker: "Tobyn Smith"
  },
  {
    id: "proj-question",
    type: "claims",
    kicker: "The question",
    title: "Two ideas, and a guess",
    lead: "",
    claims: [
      { n: "", title: "Autonomy", body: "How far the AI can act without a person approving each step." },
      { n: "", title: "Clarity", body: "Can you point to one actor who could have stopped, approved, supervised or explained it?" },
      { n: "", title: "My guess", body: "More autonomy, less clarity. If a clear rule set in advance keeps the chain clear, the guess is wrong. That is still a result." }
    ]
  },
  {
    id: "proj-night",
    type: "story",
    kicker: "The game",
    title: "What happens in the night",
    steps: [
      { n: "1", title: "Watch", body: "Two made-up countries, Araknes and Lei. A tanker is damaged. You do not make choices." },
      { n: "2", title: "Advice, then a free hand", body: "ORACLE first advises. Then it is upgraded and can act on its own." },
      { n: "3", title: "It acts", body: "Lei moves its navy towards the shipping route." },
      { n: "4", title: "You are the inquiry", body: "You say who was responsible. About fifteen minutes on a computer." }
    ]
  },
  {
    id: "proj-asks",
    type: "points",
    kicker: "The inquiry",
    title: "What I ask at the end",
    lead: "The pick-one line is the main measure.",
    points: [
      { title: "In your own words", body: "Who was responsible?" },
      { title: "Pick one, or say you cannot", body: "Six actors, ORACLE included, or I can't point to one actor." },
      { title: "Two scores, 1 to 5", body: "Could a person still have stopped this? How clear was it? How sure are you?" }
    ]
  },
  {
    id: "proj-row",
    type: "points",
    kicker: "The data",
    title: "What one row is",
    lead: "",
    points: [
      { title: "One finished inquiry", body: "Written answer, the actor named, and the scores." },
      { title: "Not quite one person", body: "Someone could file twice. I will look for repeats." },
      { title: "Drop what never changes", body: "A column that is the same for everyone cannot tell you anything. Count those leftovers yourself before you say a number." }
    ]
  },
  {
    id: "proj-code",
    type: "claims",
    kicker: "Coding",
    title: "How I turn answers into counts",
    lead: "Coding just means making the answers countable.",
    claims: [
      { n: "", title: "Clear", body: "Names one actor." },
      { n: "", title: "Unclear", body: "I can't point to one actor." },
      { n: "", title: "Cross-check", body: "The pick-one question is the main measure. The clarity score sits beside it. For the written answers I count how many actors get named." }
    ]
  },
  {
    id: "proj-pilot",
    type: "claims",
    kicker: "Honest limit",
    title: "This is a one-condition pilot",
    lead: "",
    claims: [
      { n: "", title: "Same night for everyone", body: "There is nothing to compare yet." },
      { n: "", title: "So I cannot talk about cause", body: "A cause has to differ between cases." },
      { n: "", title: "What it can show", body: "Do people finish, and do the questions make sense?" }
    ]
  },
  {
    id: "proj-next",
    type: "compare",
    kicker: "Next",
    title: "Two groups, picked by chance",
    lead: "Same story. Same actions. Only who decides changes.",
    left: {
      label: "Group A",
      title: "Advice only",
      body: "ORACLE gives advice. A person still signs off."
    },
    right: {
      label: "Group B",
      title: "Acts on its own",
      body: "ORACLE can trigger the measures without a check each time."
    },
    callout: "Chance picks the group. The server can already take both versions. They are not switched on."
  },
  {
    id: "proj-order",
    type: "claims",
    kicker: "Limit",
    title: "The order and the wording",
    lead: "",
    claims: [
      { n: "", title: "Advice always comes first", body: "The upgrade comes later, as the crisis gets worse. Autonomy is tangled up with time." },
      { n: "", title: "The inquiry line already names ORACLE", body: "The live page says ORACLE carried out the action. That nudges people." }
    ],
    note: "Tobyn to decide: keep the live inquiry wording, or use the neutral line (who, if anyone, was responsible). Not decided here."
  },
  {
    id: "proj-leak",
    type: "points",
    kicker: "Limit",
    title: "People might already know my guess",
    lead: "",
    points: [
      { title: "The last page shows the hypothesis", body: "Only after people file. Friends can still pass it on." },
      { title: "The files are public online", body: "tobyn-smith/capstone. Anyone can read the idea first." },
      { title: "No recall check yet", body: "I do not ask what ORACLE actually did." }
    ],
    note: "Tobyn to decide: keep the repo public or make it private. Add a recall question, or leave it out. Not decided here."
  },
  {
    id: "proj-who",
    type: "points",
    kicker: "Limit",
    title: "Who plays, and what they tell me",
    lead: "",
    points: [
      { title: "Classmates", body: "Not officials, and not picked at random." },
      { title: "What people say", body: "That is not the same as what an official would do." },
      { title: "One story, same ending", body: "Made-up countries on purpose, so real-world politics stay out." }
    ]
  },
  {
    id: "proj-consent",
    type: "points",
    kicker: "Consent",
    title: "What people see before Start",
    lead: "",
    points: [
      { title: "Today", body: "One sentence. About fifteen minutes. Start means I can save the answers." },
      { title: "Missing", body: "How to withdraw, where the data is kept, who sees it." },
      { title: "No real names", body: "I am asking Dr Powers about review. That answer is not in yet." }
    ]
  },
  {
    id: "proj-next-steps",
    type: "points",
    kicker: "If I go on",
    title: "What I would improve",
    lead: "",
    points: [
      { title: "Two groups, picked by chance", body: "That is the big one." },
      { title: "Write the coding rules first", body: "Before I look at any answers." },
      { title: "Fuller consent, and tidy code", body: "The test file checks rules the game page never loads. That should match." }
    ],
    note: "Tobyn to decide: the wording, and a recall check. Still open."
  },
  {
    id: "proj-room",
    type: "prompt",
    kicker: "Over to you",
    title: "What would you change first?",
    help: "One sentence is enough.",
    input: "text",
    viz: "list",
    placeholder: "Type your answer"
  }
];

window.PROJECT_SCRIPT = [
  { id: "proj-title", title: "Title", say: "My project is a short online game. It asks one thing. When an AI system acts on its own and something goes wrong, can people still say who is responsible?", notes: "Leave the QR if this is the opener.\nSolo. No results." },
  { id: "proj-question", title: "The question", say: "Autonomy is how much the system can do without someone signing off each move. Clarity is whether you can point at one person or body afterwards and say, that is who. My guess is that the more it does on its own, the harder that gets.", notes: "K&W: a theory links two things that can differ.\nDefine both words once." },
  { id: "proj-night", title: "The night", say: "You watch one night and you do not make any choices. Officials first ask ORACLE for advice, then they let it trigger measures on its own. Then you sit the inquiry. It takes about fifteen minutes.", notes: "The night is how autonomy becomes something people see." },
  { id: "proj-asks", title: "The questions", say: "The first answer is written, so I can see what people meant. The second one matters most: pick one of six actors, or say you cannot point to one. The last lines are scores from 1 to 5.", notes: "Do not ask the room who they would blame.\nClassmates may still play." },
  { id: "proj-row", title: "A row", say: "A row is one finished inquiry. It is not quite one person, because someone could go again. Leftover columns that never change get dropped. I will count those myself before I say how many.", notes: "Conrad: a row is a pair of groups.\nFuhrmann and Kreps: a row is a strike or near-strike moment." },
  { id: "proj-code", title: "Coding", say: "If you name one actor, that is clear. If you say you cannot, that is unclear. I would like a second person to code some too.", notes: "Reliable means two people get the same call.\nNo data on the board." },
  { id: "proj-pilot", title: "Pilot", say: "Right now everyone gets the same version, so I cannot say autonomy caused anything. This is a small test run: does the game work, and do the questions make sense?", notes: "Cause has to vary.\nNo results." },
  { id: "proj-next", title: "Two groups", say: "The next version splits people by chance. One group sees advice only. The other sees ORACLE acting by itself. Nothing else changes.", notes: "Do not name a test as if it has been run." },
  { id: "proj-order", title: "Order", say: "The upgrade always comes after the advice, so by then the crisis has also got worse. And the line above the questions already says ORACLE carried out the action. That second one is still open.", notes: "Tobyn to decide: inquiry wording.\nDo not pick it." },
  { id: "proj-leak", title: "Leakage", say: "The game only shows my guess at the end, but anyone who has played can pass it on, and the code is public. I also do not check whether people noticed the upgrade.", notes: "Tobyn to decide: repo public or private.\nTobyn to decide: recall question." },
  { id: "proj-who", title: "Who plays", say: "The players are my classmates, so this describes them, not governments. It is what people tell me, not what an official would do. The invented countries keep real rivals out of it.", notes: "Sample is not random." },
  { id: "proj-consent", title: "Consent", say: "Consent is one sentence today. It does not say how to pull out, where the data lives, or who sees it. I am asking Dr Powers whether it needs a review board.", notes: "Do not invent her answer." },
  { id: "proj-next-steps", title: "Improve", say: "The big one is two random groups. I would write the coding rules down before I see any answers. Smaller thing: the test file and the game page should use the same rules.", notes: "Tobyn to decide: wording and recall.\nWhen there is data, talk about the size of a gap, not only a pass or fail. No data yet." },
  { id: "proj-room", title: "Over to you", say: "That is where it has got to. What would you change first?", notes: "Do not ask who they would blame." }
];
