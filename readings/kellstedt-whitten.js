/* Methods week. Textbook chapter. Edition and pages not confirmed from class files. */
(window.READINGS = window.READINGS || []).push({
  id: "kellstedt-whitten",
  short: "Kellstedt and Whitten",
  title: "Regression, from The Fundamentals of Political Science Research",
  authors: "Paul M. Kellstedt and Guy D. Whitten",
  year: "",
  pages: "",
  caseTypes: [],
  source: "Cambridge University Press. Chapter number depends on the edition. Unverified which edition is on eLC.",
  focus: ["theory", "measures"],
  grid: {
    question: "How does Y tend to move when X moves, once you fit one line to the points?",
    goal: "Explanation",
    theory: "Draw the line that best fits the scatter. The slope is the usual change in Y when X goes up by one.",
    concepts: "Y is what you want to explain. X is what you think shifts it.",
    unit: "One row in the data. The book uses many examples. Edition not confirmed.",
    actors: "The rows are the cases, not a cast of people.",
    implications: "If X matters, that slope should not sit at zero.",
    tested: "Ordinary least squares. The line with the smallest squared gaps.",
    design: "Quantitative",
    adequate: "This is a teaching chapter, not one theory test. Unverified: which edition the class has.",
    measures: "Whatever the example variables are. I have not reopened the book.",
    cases: "Textbook examples. Pages not confirmed."
  },
  asks: [],
  script: {
    grid: {
      say: "This is the book chapter, not a paper. Regression is just a way to ask: when this goes up, what usually happens to that?",
      notes: "Define slope once.\nNo formula.\nEdition is unverified."
    },
    theory: {
      say: "Imagine dots on a page. We draw one straight line through them. The slope is the typical change in the thing we care about when the other thing moves one step.",
      notes: "Keep it to the line.\nDo not write an equation."
    },
    measures: {
      say: "Y is the thing you want to explain. X is the thing you think moves it. That is all we need before we look at a paper that actually uses a model.",
      notes: "One definition each.\nNo extra terms."
    }
  }
});
