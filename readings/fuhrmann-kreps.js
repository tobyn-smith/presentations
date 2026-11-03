/* Methods week. Journal article is 2010. A Belfer discussion paper is dated October 2009. Syllabus list not checked. */
(window.READINGS = window.READINGS || []).push({
  id: "fuhrmann-kreps",
  short: "Fuhrmann and Kreps (2010)",
  title: "Targeting Nuclear Programs in War and Peace: A Quantitative Empirical Analysis, 1941-2000",
  authors: "Matthew Fuhrmann and Sarah E. Kreps",
  year: 2010,
  pages: "831-859",
  caseTypes: [],
  source: "Journal of Conflict Resolution 54(6). Unverified: whether eLC lists the 2009 Belfer draft instead.",
  focus: ["question", "tested"],
  grid: {
    question: "When do states strike, or seriously think about striking, another state's nuclear sites?",
    goal: "Explanation",
    theory: "They do it when that country's bomb would be a real threat. The paper names prior violent conflict, a very autocratic proliferator, and clashing foreign policy as things that raise the threat.",
    concepts: "The outcome is a strike, or a serious plan to strike, nuclear infrastructure in a state that does not already have nuclear weapons.",
    unit: "A time one state struck, or seriously thought about striking, another state's nuclear sites.",
    actors: "States.",
    implications: "Those threat conditions should show up more often in the strike or consider-strike cases.",
    tested: "A statistical model on their set of strike or consider-strike instances, 1941 to 2000.",
    design: "Quantitative",
    adequate: "They say the results back the threat story and give little support to fear of a military reply or world condemnation. I have not opened the tables. No numbers here.",
    measures: "Whether a strike happened or was seriously considered, plus the threat conditions. Coding details not re-checked.",
    cases: "The instances they recorded from 1941 to 2000, as they define a case in the paper."
  },
  asks: [],
  script: {
    grid: {
      say: "Here a row is a moment when one state hit, or seriously thought about hitting, another state's nuclear kit.",
      notes: "One line on the row.\nYear is the 2010 journal piece."
    },
    question: {
      say: "When would a government actually bomb a nuclear site, or get close to that decision? That is the whole paper.",
      notes: "Stay with the question.\nNo war stories."
    },
    tested: {
      say: "They built a list of strikes and near-strikes from 1941 to 2000 and looked for the threat conditions. I am not putting their estimates on the board.",
      notes: "No coefficients.\n1941 to 2000 is the one number set they give for the window."
    }
  }
});
