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
assert.strictEqual(SLIDES.length, READINGS[0].slides.length);
assert.strictEqual(SLIDES[0].type, "title");
assert.ok(!SLIDES[0].speaker);
assert.ok(SLIDES.some(function (s) { return s.id === "part2"; }));
assert.ok(SLIDES.some(function (s) { return s.id === "close"; }));

var charts = SLIDES.filter(function (s) { return s.type === "charts"; });
var stats = SLIDES.filter(function (s) { return s.type === "stats"; });
assert.ok(charts.length >= 2, "region and Chile charts");
assert.ok(stats.length >= 3, "labour scores, r squared, Figure 5");
assert.ok(charts.some(function (s) { return s.id === "regions"; }));
assert.strictEqual(charts.filter(function (s) { return s.id === "regions"; })[0].charts[0].bars.length, 5);

var prompts = SLIDES.filter(function (s) { return s.type === "prompt"; });
assert.strictEqual(prompts.length, 2);
prompts.forEach(function (p) {
  assert.strictEqual(p.help, "");
  assert.strictEqual(p.placeholder, "Type your answer");
});

var dump = JSON.stringify(SLIDES) + JSON.stringify(SCRIPT);
[
  "Phones:",
  "One tap",
  "Bars:",
  "Now: Tobyn",
  "Now: ",
  "Discussion Question:",
  "Tobyn Smith",
  "Score three made-up",
  "delve",
  "tapestry",
  "furthermore",
  "—"
].forEach(function (bad) {
  assert.ok(dump.indexOf(bad) === -1, "no " + bad);
});

assert.ok(SCRIPT.some(function (s) { return s.id === "before"; }));
assert.ok(SCRIPT.some(function (s) { return s.id === "fits" && s.say.indexOf(".07") !== -1; }));

var fs = require("fs");
var admin = fs.readFileSync("./adminpresentation.html", "utf8");
var user = fs.readFileSync("./index.html", "utf8");
var backup = fs.readFileSync("./slideshow.html", "utf8");
var start = fs.readFileSync("./start.html", "utf8");
assert.ok(admin.indexOf("readings/geddes-1990.js") !== -1);
assert.ok(user.indexOf("readings/geddes-1990.js") !== -1);
assert.ok(backup.indexOf("readings/geddes-1990.js") !== -1);
assert.ok(start.indexOf("Admin") !== -1 && start.indexOf("Audience") !== -1 && start.indexOf("Backup") !== -1);
assert.ok(admin.indexOf('id="reveal"') !== -1);
assert.ok(user.indexOf("data-role=\"participant\"") !== -1);
assert.ok(backup.indexOf("slideshow.js") !== -1);

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
