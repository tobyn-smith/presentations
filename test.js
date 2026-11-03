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
assert.strictEqual(SLIDES.length, 18);
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
var nics = SLIDES.filter(function (s) { return s.id === "nics"; })[0];
assert.ok(nics);
assert.strictEqual(nics.input, "place");
assert.ok(nics.tokens.length === 3);
assert.ok(nics.slots.length === 2);
assert.ok(nics.names && nics.names.length === 5);
assert.ok(SLIDES.some(function (s) { return s.id === "quote-universe" && s.quote && /universe of cases/.test(s.quote.text); }));
assert.ok(SLIDES.some(function (s) { return s.id === "quote-sample" && s.quote && /small samples selected on the dependent variable/.test(s.quote.text); }));
assert.ok(SLIDES.some(function (s) { return s.id === "skocpol" && s.claims.length === 3; }));
assert.ok(SLIDES.some(function (s) { return s.id === "contrast" && /Prussia and Japan/.test(JSON.stringify(s)); }));
assert.ok(SLIDES.some(function (s) { return s.id === "figure4" && s.type === "compare"; }));
assert.ok(SLIDES.some(function (s) { return s.id === "hirschman" && s.chart && s.chart.id === "figure6"; }));
assert.ok(SLIDES.some(function (s) { return s.id === "discuss" && s.claims.length === 3; }));
assert.ok(SLIDES.some(function (s) { return s.id === "pairs"; }));

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
assert.ok(withChart.length >= 4, "Table 1, r squared, Figure 5, Figure 6");
assert.ok(withStats.length >= 1, "labour scores");
assert.ok(SLIDES.some(function (s) { return s.id === "regions" && s.chart && s.chart.bars.length === 5; }));
assert.ok(SLIDES.some(function (s) { return s.id === "fits" && s.chart && s.chart.bars.length === 3; }));
assert.ok(SLIDES.some(function (s) { return s.id === "figure5" && s.chart && s.chart.bars[0].n === 7; }));
assert.ok(SLIDES.some(function (s) { return s.id === "hirschman" && s.chart && s.chart.bars.length === 5; }));
assert.ok(!SLIDES.filter(function (s) { return s.id === "chile"; })[0].chart);

var prompts = SLIDES.filter(function (s) { return s.type === "prompt"; });
assert.strictEqual(prompts.length, 2);
prompts.forEach(function (p) {
  assert.strictEqual(p.help, "");
});
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "chile"; })[0].input, "choice-text");
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "chile"; })[0].options.length, 4);

var slideDump = JSON.stringify(SLIDES);
var voiceDump = JSON.stringify(SLIDES) + JSON.stringify(SCRIPT);
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
[
  "delve",
  "tapestry",
  "testament",
  "furthermore",
  "moreover",
  "it is important to note",
  "pivotal",
  "landscape",
  "—",
  "–"
].forEach(function (bad) {
  assert.ok(voiceDump.toLowerCase().indexOf(bad.toLowerCase()) === -1, "no " + bad + " in slides or script");
});
assert.ok(!/\brich\b/i.test(voiceDump));

SCRIPT.forEach(function (s) {
  assert.ok(String(s.title).indexOf("·") === -1, "no labelled jump title " + s.title);
});
assert.ok(SCRIPT.some(function (s) { return s.id === "open" && /\bTobyn\./.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "skocpol" && /\bRaquel\./.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "hirschman" && /\bTobyn\./.test(s.notes); }));
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
assert.ok(!fromClass("hirschman"));
assert.ok(!fromClass("discuss"));
assert.ok(!fromClass("pairs"));
assert.ok(!/Burlacu|Tomz|Horn, Johannesson|Bremer and Spiro|Achen and Snidal|Pape studied/.test(slideDump));
assert.ok(!/Week 1|Week 7/.test(slideDump));
assert.ok(SCRIPT.some(function (s) { return s.id === "fits" && s.say.indexOf(".07") !== -1; }));

var fs = require("fs");
var admin = fs.readFileSync("./present/index.html", "utf8");
var adminAlias = fs.readFileSync("./adminpresentation.html", "utf8");
var user = fs.readFileSync("./index.html", "utf8");
var backup = fs.readFileSync("./slideshow.html", "utf8");
var start = fs.readFileSync("./start.html", "utf8");
var css = fs.readFileSync("./style.css", "utf8");
var cfg = fs.readFileSync("./config.js", "utf8");
assert.ok(admin.indexOf("readings/geddes-1990.js") !== -1);
assert.ok(admin.indexOf('base href="../"') !== -1);
assert.ok(adminAlias.indexOf("present/") !== -1);
assert.ok(cfg.indexOf("https://tobynsmith.me/geddes/") !== -1);
assert.ok(/presenterKey:\s*"6010"/.test(cfg));
assert.ok(!/presenterKey:\s*"example"/.test(cfg));
assert.ok(fs.existsSync("./gate.js"));
assert.ok(fs.existsSync("./_redirects"));
var redirects = fs.readFileSync("./_redirects", "utf8");
assert.ok(redirects.indexOf("/geddes") !== -1);
assert.ok(redirects.indexOf("/geddes/present") !== -1);
assert.ok(!/^\/6010/m.test(redirects));
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
assert.ok(css.indexOf("--navy") !== -1);
assert.ok(css.indexOf("--gold") !== -1);
assert.ok(fs.existsSync("./join-qr.svg"));
assert.ok(fs.existsSync("./uga-logo.png"));
assert.ok(admin.indexOf("uga-logo.png") !== -1);
assert.ok(backup.indexOf("uga-logo.png") !== -1);
assert.ok(admin.indexOf("uga-arch") === -1);
assert.ok(css.indexOf("user-select: none") !== -1);
assert.ok(css.indexOf("flex-wrap: nowrap") !== -1);
var deckSrc = fs.readFileSync("./deck.js", "utf8");
assert.ok(deckSrc.indexOf("I'm in") !== -1);
assert.ok(deckSrc.indexOf("Who are you?") === -1);
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
assert.ok(deckSrc.indexOf("ss-win-dots") === -1);
assert.ok(talk.indexOf("ss-win-dots") === -1);
assert.ok(deckSrc.indexOf("ss-win-label") !== -1);
assert.ok(talk.indexOf("ss-win-label") !== -1);
assert.ok(start.indexOf("Phones.") === -1);
["deck.js", "sync.js", "slideshow.js", "style.css", "readings/geddes-1990.js"].forEach(function (name) {
  var src = fs.readFileSync("./" + name, "utf8");
  assert.ok(src.toLowerCase().indexOf("rehear") === -1, "old local-only wording left in " + name);
});
assert.ok(deckSrc.indexOf("var keepBoard = !force && !changed && onBoard()") !== -1);
assert.ok(deckSrc.indexOf("if (isPres || DeckSync.isPresenting()) render(n);") !== -1);
assert.ok(deckSrc.indexOf("if (!isPres && (!DeckSync.isPresenting() || !DeckSync.seated())) return;") !== -1);
assert.ok(!/deck-content[\s\S]{0,500}sharePack/.test(deckSrc));
var syncSrc = fs.readFileSync("./sync.js", "utf8");
assert.ok(syncSrc.indexOf("if (lastHere && lastHere > t) return;") !== -1);
assert.ok(syncSrc.indexOf("localStorage.setItem(\"deck-me\"") !== -1);
assert.ok(syncSrc.indexOf("function clearMe()") !== -1);
assert.ok(user.indexOf('aria-live="off"') !== -1);
assert.ok(admin.indexOf('aria-live="off"') !== -1);
assert.ok(fs.existsSync("./docs/split.md"));
assert.ok(fs.existsSync("./docs/me-sync.md"));
assert.ok(/geddes\/docs/.test(fs.readFileSync("./docs/me-sync.md", "utf8")));
assert.ok(!/utilit/i.test(slideDump));
assert.ok(!/utilit/i.test(fs.readFileSync("./docs/split.md", "utf8")));

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
