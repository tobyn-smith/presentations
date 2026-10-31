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
assert.strictEqual(SLIDES.length, 11);
assert.strictEqual(SLIDES[0].type, "title");
assert.strictEqual(SLIDES[0].title, "The cases you pick can change the answer.");
assert.ok(!SLIDES[0].lede);
assert.ok(!(SLIDES[0].agenda && SLIDES[0].agenda.length));
assert.ok(!SLIDES[0].speaker);
assert.ok(SLIDES[0].claims && SLIDES[0].claims.length >= 3);
assert.ok(!SLIDES.some(function (s) { return s.id === "part2"; }));
assert.ok(SLIDES.some(function (s) { return s.id === "close"; }));
assert.strictEqual(SLIDES[3].id, "nics");
assert.strictEqual(SLIDES[3].title, "Five fast growers, one shared trait");
assert.ok(SLIDES[3].claims.some(function (c) { return c.title === "The cases"; }));
assert.ok(SLIDES[3].claims.some(function (c) { return c.title === "The claim"; }));
assert.ok(SLIDES[3].claims.some(function (c) { return c.title === "The problem"; }));

SLIDES.forEach(function (s) {
  assert.ok(!s.kicker, "no kicker on " + s.id);
  assert.ok(!s.speaker, "no speaker on " + s.id);
});

var withChart = SLIDES.filter(function (s) { return s.chart || (s.charts && s.charts.length); });
var withStats = SLIDES.filter(function (s) { return s.stats && s.stats.length; });
assert.ok(withChart.length >= 2, "region and Chile charts");
assert.ok(withStats.length >= 3, "labour scores, r squared, Figure 5");
assert.ok(SLIDES.some(function (s) { return s.id === "regions" && s.chart && s.chart.bars.length === 5; }));
assert.ok(SLIDES.some(function (s) { return s.id === "chile" && s.chart.bars.some(function (b) { return b.label === "1957" && b.n === 17; }); }));

var prompts = SLIDES.filter(function (s) { return s.type === "prompt"; });
assert.strictEqual(prompts.length, 2);
prompts.forEach(function (p) {
  assert.strictEqual(p.help, "");
  assert.ok(p.ask);
  assert.ok(p.claims && p.claims.length >= 3);
});
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "nics"; })[0].input, "place");
assert.ok(SLIDES.filter(function (s) { return s.id === "nics"; })[0].tokens.length === 3);
assert.ok(SLIDES.filter(function (s) { return s.id === "nics"; })[0].slots.length === 2);
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "chile"; })[0].input, "rank");
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "chile"; })[0].options.length, 4);

var dump = JSON.stringify(SLIDES) + JSON.stringify(SCRIPT);
[
  "Phones:",
  "One tap",
  "Bars:",
  "Now: Tobyn",
  "Now: ",
  "Discussion Question:",
  "Tobyn Smith",
  "Part 1",
  "Part 2",
  "Score three made-up",
  "delve",
  "tapestry",
  "furthermore",
  "—"
].forEach(function (bad) {
  assert.ok(dump.indexOf(bad) === -1, "no " + bad);
});

SCRIPT.forEach(function (s) {
  assert.ok(String(s.title).indexOf("·") === -1, "no labelled jump title " + s.title);
});
assert.ok(SCRIPT.some(function (s) { return s.id === "before"; }));
assert.ok(SCRIPT.some(function (s) { return s.id === "open" && /\bTobyn\./.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "skocpol" && /\bRaquel\./.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "close" && /\bTobyn\./.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "fits" && s.say.indexOf(".07") !== -1; }));

var fs = require("fs");
var admin = fs.readFileSync("./adminpresentation.html", "utf8");
var user = fs.readFileSync("./index.html", "utf8");
var backup = fs.readFileSync("./slideshow.html", "utf8");
var start = fs.readFileSync("./start.html", "utf8");
var css = fs.readFileSync("./style.css", "utf8");
assert.ok(admin.indexOf("readings/geddes-1990.js") !== -1);
assert.ok(user.indexOf("readings/geddes-1990.js") !== -1);
assert.ok(backup.indexOf("readings/geddes-1990.js") !== -1);
assert.ok(start.indexOf("Admin") !== -1 && start.indexOf("Audience") !== -1 && start.indexOf("Backup") !== -1);
assert.ok(admin.indexOf('id="reveal"') !== -1);
assert.ok(admin.indexOf("class=\"brand\"") === -1);
assert.ok(backup.indexOf("class=\"brand\"") === -1);
assert.ok(css.indexOf(".claim-bars") !== -1);
assert.ok(css.indexOf(".split.has-viz") !== -1);
assert.ok(css.indexOf(".drag-place") !== -1);
assert.ok(css.indexOf(".drag-rank") !== -1);
var deckSrc = fs.readFileSync("./deck.js", "utf8");
assert.ok(deckSrc.indexOf("function bindRank") !== -1);
assert.ok(deckSrc.indexOf("function bindPlace") !== -1);
assert.ok(deckSrc.indexOf("id=\"drag-send\"") !== -1);
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
