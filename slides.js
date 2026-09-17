window.SLIDES = [
  {
    id: "title",
    type: "title",
    kicker: "Live example",
    title: "Phone check-in, shared boards",
    lede: "Scan the code, pick a name, wait for Go live.",
    agenda: [
      "Check in from a phone",
      "Look at a board together",
      "Send one answer"
    ],
    speaker: ""
  },
  {
    id: "board-1",
    type: "claims",
    kicker: "1",
    title: "What this is",
    claims: [
      { n: "1", title: "Students join from a phone", body: "Names on the list, a picture, then Hold until the room starts." },
      { n: "2", title: "The presenter drives the boards", body: "Same slide on every phone. Hands and answers come back to the room." },
      { n: "3", title: "Slideshow is the backup", body: "If phones will not join, the same boards still run with no check-in." }
    ]
  },
  {
    id: "q1",
    type: "prompt",
    kicker: "1 · Question",
    title: "What would you use a live board for?",
    help: "A sentence is enough. Names stay with the answer.",
    input: "text",
    viz: "list",
    placeholder: "Enter your response below."
  },
  {
    id: "board-2",
    type: "points",
    kicker: "2",
    title: "Try the other pages",
    lead: "Start is the map. Each card is a different job.",
    points: [
      { title: "Students", body: "Phones open the home page. Computer layout is the wide version." },
      { title: "Present", body: "QR, Go live, next and back. On this example the key is example." },
      { title: "Change the boards", body: "Open Edit. Type in the boxes. No files." }
    ]
  },
  {
    id: "q2",
    type: "prompt",
    kicker: "2 · Question",
    title: "What would you still want to know?",
    help: "",
    input: "text",
    viz: "list",
    placeholder: "Enter your response below."
  }
];
