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
require("./script-content.js");
require("./build-week.js");

console.log(SLIDES.length + " slides");
SLIDES.forEach(function (s) { console.log((s.type + "       ").slice(0, 7), s.id, s.title); });

assert.strictEqual(READINGS.length, 1);
assert.strictEqual(READINGS[0].id, "geddes-1990");
assert.ok(READINGS[0].slides.length >= 10);
assert.strictEqual(SLIDES.length, READINGS[0].slides.length);
assert.strictEqual(SLIDES[0].type, "title");
assert.strictEqual(SLIDES[0].id, "open");
assert.ok(!SLIDES[0].speaker);
assert.ok(!(SLIDES[0].agenda && SLIDES[0].agenda.length));
assert.ok(!SLIDES[0].lede);
assert.ok(String(SLIDES[0].title).indexOf("cases") !== -1);

var parts = SLIDES.filter(function (s) { return s.id === "open" || s.id === "part2"; });
assert.strictEqual(parts.length, 2);

var prompts = SLIDES.filter(function (s) { return s.type === "prompt"; });
assert.strictEqual(prompts.length, 2, "two live boards, not a poll march");
prompts.forEach(function (p) {
  assert.strictEqual(p.input, "text");
  assert.strictEqual(p.help, "");
  assert.strictEqual(p.placeholder, "Type your answer");
});

assert.ok(SLIDES.some(function (s) { return s.id === "close"; }));
assert.ok(SCRIPT.some(function (s) { return s.id === "before"; }));
assert.ok(SCRIPT.some(function (s) { return s.id === "open" && s.say && s.say !== "[write here]"; }));

var dump = JSON.stringify(SLIDES) + JSON.stringify(SCRIPT);
[
  "Phones:",
  "One tap",
  "Bars:",
  "Now: Tobyn",
  "Now: ",
  "Discussion Question:",
  "Tobyn Smith",
  "delve",
  "tapestry",
  "furthermore",
  "—"
].forEach(function (bad) {
  assert.ok(dump.indexOf(bad) === -1, "no " + bad);
});

SLIDES.forEach(function (s) {
  var words = String(s.title || "").split(/\s+/).filter(Boolean);
  assert.ok(words.length <= 16, "short title: " + s.title);
});

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
