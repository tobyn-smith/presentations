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
assert.strictEqual(SLIDES[0].title, "How the Cases You Choose Affect the Answers You Get");
assert.strictEqual(SLIDES[0].kicker, "Geddes");
assert.ok(/Barbara Geddes/.test(SLIDES[0].byline));
assert.strictEqual(SLIDES[0].presented, "Presented by Tobyn and Raquel");
assert.ok(!SLIDES[0].lede);
assert.ok(!(SLIDES[0].agenda && SLIDES[0].agenda.length));
assert.ok(!SLIDES[0].speaker);
assert.ok(!(SLIDES[0].claims && SLIDES[0].claims.length));
assert.ok(!SLIDES[0].fromClass);
assert.ok(!SLIDES.some(function (s) { return s.id === "part2"; }));
assert.ok(SLIDES.some(function (s) { return s.id === "close"; }));
assert.strictEqual(SLIDES[3].id, "nics");
assert.strictEqual(SLIDES[3].input, "place");
assert.ok(SLIDES[3].tokens.length === 3);
assert.ok(SLIDES[3].slots.length === 2);
assert.ok(SLIDES[3].names && SLIDES[3].names.length === 5);

SLIDES.forEach(function (s) {
  assert.ok(!s.speaker, "no speaker on " + s.id);
  if (s.kicker) {
    assert.ok(!/Part\s+[12]|Tobyn|Raquel/i.test(s.kicker), "kicker is not a speaker label on " + s.id);
  }
  (s.claims || []).forEach(function (c) {
    var words = String(c.body || "").trim().split(/\s+/).filter(Boolean);
    assert.ok(words.length <= 40, "card too long on " + s.id + ": " + c.title);
    var titleWords = String(c.title || "").trim().split(/\s+/).filter(Boolean);
    assert.ok(titleWords.length >= 2 && titleWords.length <= 8, "card title length on " + s.id);
  });
});

var withChart = SLIDES.filter(function (s) { return s.chart || (s.charts && s.charts.length); });
var withStats = SLIDES.filter(function (s) { return s.stats && s.stats.length; });
assert.ok(withChart.length >= 1, "Table 1 chart");
assert.ok(withStats.length >= 3, "labour scores, r squared, Figure 5");
assert.ok(SLIDES.some(function (s) { return s.id === "regions" && s.chart && s.chart.bars.length === 5; }));

var prompts = SLIDES.filter(function (s) { return s.type === "prompt"; });
assert.strictEqual(prompts.length, 2);
prompts.forEach(function (p) {
  assert.strictEqual(p.help, "");
});
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "chile"; })[0].input, "choice-text");
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "chile"; })[0].options.length, 4);

var slideDump = JSON.stringify(SLIDES);
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
  assert.ok(slideDump.indexOf(bad) === -1, "no " + bad + " on slides");
});

SCRIPT.forEach(function (s) {
  assert.ok(String(s.title).indexOf("·") === -1, "no labelled jump title " + s.title);
});
assert.ok(SCRIPT.some(function (s) { return s.id === "open" && /\bTobyn\./.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "skocpol" && /\bRaquel\./.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "close" && /\bTobyn\./.test(s.notes); }));
function fromClass(id) {
  var s = SLIDES.filter(function (row) { return row.id === id; })[0];
  return s && s.fromClass;
}
assert.ok(!fromClass("open"));
assert.ok(!fromClass("ask"));
assert.strictEqual(fromClass("habit").week, 8);
assert.ok(/sampling on the dependent variable/.test(fromClass("habit").body));
assert.strictEqual(fromClass("nics").week, 8);
assert.ok(/dependent variable/.test(fromClass("nics").body));
assert.strictEqual(fromClass("regions").week, 6);
assert.ok(/East Asia/.test(fromClass("regions").body));
assert.strictEqual(fromClass("scores").week, 10);
assert.ok(/labour score/.test(fromClass("scores").body));
assert.ok(!fromClass("fits"));
assert.ok(!fromClass("chile"));
assert.ok(!fromClass("close"));
assert.ok(!fromClass("skocpol"));
assert.ok(!fromClass("figure5"));
assert.ok(!/Burlacu|Tomz|Horn, Johannesson|Bremer and Spiro|Achen and Snidal|Pape studied/.test(slideDump));
assert.ok(!/Week 1|Week 7/.test(slideDump));
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
assert.ok(admin.indexOf("stage-wrap") !== -1);
assert.ok(backup.indexOf("stage-wrap") !== -1);
assert.ok(css.indexOf(".claim-bars") !== -1);
assert.ok(css.indexOf(".split.has-viz") !== -1);
assert.ok(css.indexOf(".drag-place") !== -1);
assert.ok(css.indexOf(".ss-win") !== -1);
assert.ok(fs.existsSync("./join-qr.svg"));
assert.ok(css.indexOf("user-select: none") !== -1);
assert.ok(css.indexOf("flex-wrap: nowrap") !== -1);
var deckSrc = fs.readFileSync("./deck.js", "utf8");
assert.ok(deckSrc.indexOf("function bindRank") !== -1);
assert.ok(deckSrc.indexOf("function bindPlace") !== -1);
assert.ok(deckSrc.indexOf("id=\"drag-send\"") !== -1);
assert.ok(deckSrc.indexOf("function fitStage") !== -1);
assert.ok(deckSrc.indexOf("Waiting for votes") === -1);
assert.ok(user.indexOf("data-role=\"participant\"") !== -1);
assert.ok(user.indexOf("classList.add(\"is-desk\")") === -1);
assert.ok(backup.indexOf("slideshow.js") !== -1);
assert.ok(backup.indexOf('id="prev"') !== -1);
assert.ok(css.indexOf(".ghost-nav") !== -1);
var talk = fs.readFileSync("./slideshow.js", "utf8");
assert.ok(talk.indexOf("function bindRank") !== -1);
assert.ok(talk.indexOf("function bindPlace") !== -1);
assert.ok(talk.indexOf("function fitStage") !== -1);
assert.ok(start.indexOf("Phones.") === -1);

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
