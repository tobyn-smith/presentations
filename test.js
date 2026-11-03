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
assert.strictEqual(SLIDES.length, 12, "the seminar is paced for fifteen minutes");
assert.strictEqual(SLIDES[0].type, "title");
assert.strictEqual(SLIDES[0].id, "open");
assert.strictEqual(SLIDES[0].title, "How the Cases You Choose Affect the Answers You Get");
assert.ok(SLIDES.some(function (s) { return s.id === "close"; }));
assert.ok(SLIDES.some(function (s) { return s.id === "figure4" && s.type === "compare"; }));
assert.ok(SLIDES.some(function (s) { return s.id === "skocpol" && s.claims.length === 3; }));
assert.ok(SLIDES.some(function (s) { return s.id === "quote-sample" && s.quote && /small samples selected on the dependent variable/.test(s.quote.text); }));

var nics = SLIDES.filter(function (s) { return s.id === "nics"; })[0];
assert.ok(nics);
assert.strictEqual(nics.type, "prompt");
assert.strictEqual(nics.input, "place");
assert.strictEqual(nics.tokens.length, 3);
assert.strictEqual(nics.slots.length, 2);
assert.strictEqual(nics.names.length, 5);

var withChart = SLIDES.filter(function (s) { return s.chart; });
assert.strictEqual(withChart.length, 4, "Table 1, Figures 1-3, Figure 5 and Table 2");
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "regions"; })[0].chart.bars.length, 5);
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "fits"; })[0].chart.bars.length, 3);
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "fits"; })[0].chart.plots.length, 2);
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "figure5"; })[0].chart.bars[0].n, 7);
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "hirschman"; })[0].chart.id, "table2");
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "hirschman"; })[0].chart.bars.length, 5);
assert.ok(/not nine separate country labels/.test(SLIDES.filter(function (s) { return s.id === "figure5"; })[0].chart.note));
assert.ok(/continues through 1972/.test(SLIDES.filter(function (s) { return s.id === "hirschman"; })[0].chart.note));
assert.ok(/curved relationship/.test(JSON.stringify(SLIDES.filter(function (s) { return s.id === "fits"; }))));
assert.ok(!/The five are all a 3/.test(JSON.stringify(SLIDES)));

var prompts = SLIDES.filter(function (s) { return s.type === "prompt"; });
assert.strictEqual(prompts.length, 3, "exactly three live interactions");
prompts.forEach(function (p) { assert.ok(p.help); });
var chile = SLIDES.filter(function (s) { return s.id === "chile"; })[0];
assert.strictEqual(chile.input, "choice-text");
assert.strictEqual(chile.options.length, 4);

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
  "Score three made-up",
  "delve",
  "tapestry",
  "furthermore",
  "—",
  "actually",
  "tidy",
  "neat",
  "falls apart",
  "the point"
].forEach(function (bad) {
  assert.ok(slideDump.toLowerCase().indexOf(bad.toLowerCase()) === -1, "no " + bad + " on slides");
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
  "actually",
  "tidy",
  "neat",
  "falls apart",
  "the point",
  "—",
  "–"
].forEach(function (bad) {
  assert.ok(voiceDump.toLowerCase().indexOf(bad.toLowerCase()) === -1, "no " + bad + " in slides or script");
});
assert.ok(!/\brich\b/i.test(voiceDump));

SCRIPT.forEach(function (s) {
  assert.strictEqual(String(s.title).indexOf("·"), -1, "no labelled jump title " + s.title);
});
assert.ok(SCRIPT.some(function (s) { return s.id === "open" && /TOBYN/.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "skocpol" && /RAQUEL/.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "hirschman" && /TOBYN/.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "close" && /TOBYN/.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "nics" && /INTERACTION 1 OF 2/.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "quote-sample" && /INTERACTION 2 OF 3/.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "chile" && /INTERACTION 3 OF 3/.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "fits" && s.say.indexOf("0.07") !== -1; }));
assert.ok(/15:00/.test(SCRIPT[SCRIPT.length - 1].title));
assert.ok(!/five-minute pairs activity/.test(JSON.stringify(SLIDES)));

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
assert.ok(cfg.indexOf("https://intl6010-default-rtdb.firebaseio.com") !== -1);
assert.ok(!/apiKey:\s*"[A-Za-z0-9]/.test(cfg));
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
assert.ok(syncSrc.indexOf("Live sync: Firebase") !== -1);
assert.ok(syncSrc.indexOf("Live sync: backup, Firebase locked") !== -1);
assert.ok(syncSrc.indexOf("new EventSource(fbUrl(\"\"))") !== -1);
assert.ok(syncSrc.indexOf("method: \"PATCH\"") !== -1);
assert.ok(syncSrc.indexOf("function startBackup()") !== -1);
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
