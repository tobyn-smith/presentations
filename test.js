var assert = require("assert");
var store = {};

global.window = global;
global.document = { dispatchEvent: function () {} };
global.location = { search: "", href: "http://localhost/" };
global.fetch = function () {
  return Promise.resolve({ ok: false, json: function () { return Promise.resolve(null); } });
};
global.localStorage = {
  getItem: function (k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
  setItem: function (k, v) { store[k] = String(v); },
  removeItem: function (k) { delete store[k]; }
};

require("./prompts.js");
require("./readings/kellstedt-whitten.js");
require("./readings/conrad-2021.js");
require("./readings/fuhrmann-kreps.js");
require("./project/methods-accountability.js");
require("./script-content.js");
require("./build-week.js");

console.log(SLIDES.length + " slides");
SLIDES.forEach(function (s) { console.log((s.type + "       ").slice(0, 7), s.id); });

assert.strictEqual(PROMPTS.length, 12);
assert.strictEqual(READINGS.length, 3);
assert.ok(PROJECT_SLIDES.length >= 14);
assert.strictEqual(SLIDES[0].type, "title");

var grids = SLIDES.filter(function (s) { return s.layout === "grid"; });
assert.strictEqual(grids.length, READINGS.length);
grids.forEach(function (g) {
  assert.strictEqual(g.points.length, 12);
  var filled = g.points.filter(function (pt) { return String(pt.body || "").trim(); });
  assert.ok(filled.length >= 10, "grid cells have short notes");
});

READINGS.forEach(function (r) {
  assert.ok(SLIDES.filter(function (s) { return s.id === r.id + "-grid"; })[0]);
  (r.focus || []).forEach(function (key) {
    var board = SLIDES.filter(function (s) { return s.id === r.id + "-" + key; })[0];
    assert.ok(board, r.id + " " + key);
    assert.strictEqual(board.help, "");
    assert.strictEqual(board.placeholder, "Type your answer");
  });
  var extras = SLIDES.filter(function (s) {
    return s.id.indexOf(r.id + "-") === 0 && s.type === "prompt" && (r.focus || []).indexOf(s.id.replace(r.id + "-", "")) === -1;
  });
  assert.strictEqual(extras.length, 0, "no extra vote boards");
});

var dump = JSON.stringify(SLIDES) + JSON.stringify(SCRIPT) + JSON.stringify(PROJECT_SLIDES);
[
  "Phones:",
  "One tap each",
  "Bars:",
  "Reveal her",
  "delve",
  "tapestry",
  "furthermore",
  "—"
].forEach(function (bad) {
  assert.ok(dump.indexOf(bad) === -1, "no " + bad);
});

var decide = SLIDES.filter(function (s) {
  return String(s.note || "").indexOf("Tobyn to decide") !== -1;
});
assert.ok(decide.length >= 3, "open items stay marked");
assert.ok(SLIDES.filter(function (s) { return s.id === "proj-room"; })[0]);
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "proj-room"; })[0].placeholder, "Type your answer");

var types = {};
SLIDES.forEach(function (s) { types[s.type] = (types[s.type] || 0) + 1; });
assert.ok(types.title >= 2 && types.points && types.claims && types.story && types.compare && types.prompt);

assert.ok(SCRIPT.some(function (s) { return s.id === "before"; }));
assert.ok(SCRIPT.some(function (s) { return s.id === "proj-title" && s.say && s.say !== "[write here]"; }));

global.DECK = { useFileSlides: true, room: "test-room", title: "Week" };
store["deck-content"] = JSON.stringify({
  deck: { title: "Saved override" },
  slides: [{ id: "saved-only", type: "title", title: "Hidden" }],
  script: [{ id: "saved-script", title: "Hidden", say: "no", notes: "" }]
});
require("./apply-content.js");
assert.notStrictEqual(SLIDES[0].id, "saved-only");
assert.strictEqual(DECK.title, "Saved override");
DeckContent.setPreferFiles(false);
DeckContent.apply(DeckContent.read());
assert.strictEqual(SLIDES[0].id, "saved-only");
DeckContent.setPreferFiles(true);
window.SLIDES = [{ id: "file-again", type: "title" }];
DeckContent.apply(DeckContent.read());
assert.strictEqual(SLIDES[0].id, "file-again");

console.log("ok");
