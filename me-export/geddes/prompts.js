/* The instructor's discussion list, word for word in meaning. Shared by every week. */
window.PROMPTS = [
  { key: "question",  label: "What question motivates the research?" },
  { key: "goal",      label: "Goal: description, explanation or prediction?", input: "choice", options: ["Description", "Explanation", "Prediction"] },
  { key: "theory",    label: "What is the theory? Is it clear?" },
  { key: "concepts",  label: "Are the concepts clearly defined?" },
  { key: "unit",      label: "Unit of analysis" },
  { key: "actors",    label: "Key actors: individuals, groups, states, other? Does it matter?", input: "choice", options: ["Individuals", "Groups", "States", "Something else"] },
  { key: "implications", label: "Observable implications" },
  { key: "tested",    label: "Which implications are tested? Central empirical strategy?" },
  { key: "design",    label: "Qualitative or quantitative? Cross-sectional or time series?", input: "choice", options: ["Qualitative", "Quantitative", "Mixed"] },
  { key: "adequate",  label: "Does the strategy adequately test the theory?", input: "scale", options: ["1","2","3","4","5"] },
  { key: "measures",  label: "Are concepts validly measured?" },
  { key: "cases",     label: "How are cases selected? Fair comparison?" }
];
