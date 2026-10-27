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
require("./readings/geddes-1990.js");
require("./readings/seawright-gerring-2008.js");
require("./script-content.js");
require("./build-week.js");

console.log(SLIDES.length + " slides");
SLIDES.forEach(function (s) { console.log((s.type + "       ").slice(0, 7), s.id); });

assert.strictEqual(PROMPTS.length, 12);
assert.strictEqual(READINGS.length, 2);
assert.ok(SLIDES.length > 2);
assert.strictEqual(SLIDES[0].type, "title");

var grids = SLIDES.filter(function (s) { return s.layout === "grid"; });
assert.strictEqual(grids.length, READINGS.length);
grids.forEach(function (g) {
  assert.strictEqual(g.type, "points");
  assert.strictEqual(g.points.length, 12);
  g.points.forEach(function (pt) {
    assert.strictEqual(String(pt.body || "").trim(), "", "grid answers stay empty");
  });
});

var closedKeys = PROMPTS.filter(function (p) {
  return p.input === "choice" || p.input === "scale";
}).map(function (p) { return p.key; });

READINGS.forEach(function (r) {
  var grid = SLIDES.filter(function (s) { return s.id === r.id + "-grid"; })[0];
  assert.ok(grid, r.id + " grid");
  r.focus.forEach(function (key) {
    var board = SLIDES.filter(function (s) { return s.id === r.id + "-" + key; })[0];
    assert.ok(board, r.id + " focus " + key);
    assert.strictEqual(board.type, "prompt");
    var p = PROMPTS.filter(function (x) { return x.key === key; })[0];
    if (p && (p.input === "choice" || p.input === "scale")) {
      assert.strictEqual(board.input, p.input);
      assert.strictEqual(board.viz, "bars");
    } else {
      assert.strictEqual(board.input, "text");
    }
    assert.strictEqual(board.placeholder, "[write here]");
    assert.strictEqual(board.help, "");
  });
  closedKeys.forEach(function (key) {
    var vote = SLIDES.filter(function (s) { return s.id === r.id + "-" + key; })[0];
    assert.ok(vote, r.id + " vote " + key);
    var p = PROMPTS.filter(function (x) { return x.key === key; })[0];
    assert.strictEqual(vote.input, p.input);
    assert.ok(vote.options && vote.options.length);
  });
  assert.strictEqual((r.asks || []).length, 0);
});

assert.ok(SCRIPT.some(function (s) { return s.id === "before"; }));
SCRIPT.forEach(function (sec) {
  if (sec.id === "before") return;
  assert.strictEqual(sec.say, "[write here]");
  assert.strictEqual(sec.notes, "[write here]");
});

var types = {};
SLIDES.forEach(function (s) { types[s.type] = true; });
assert.ok(types.title && types.points && types.prompt);

global.DECK = { useFileSlides: true, room: "test-room", title: "Week" };
store["deck-content"] = JSON.stringify({
  deck: { title: "Saved override" },
  slides: [{ id: "saved-only", type: "title", title: "Hidden" }],
  script: [{ id: "saved-script", title: "Hidden", say: "no", notes: "" }]
});
require("./apply-content.js");
assert.notStrictEqual(SLIDES[0].id, "saved-only", "file slides stay when switch is on");
assert.ok(SCRIPT.some(function (s) { return s.id === "before"; }));
assert.strictEqual(DECK.title, "Saved override", "session fields still apply");

DeckContent.setPreferFiles(false);
DeckContent.apply(DeckContent.read());
assert.strictEqual(SLIDES[0].id, "saved-only", "saved boards apply when switch is off");

DeckContent.setPreferFiles(true);
window.SLIDES = [{ id: "file-again", type: "title" }];
DeckContent.apply(DeckContent.read());
assert.strictEqual(SLIDES[0].id, "file-again");

console.log("ok");
