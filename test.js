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
require("./readings/geddes-visuals.js");
require("./script-content.js");
require("./build-week.js");

console.log(SLIDES.length + " slides");
SLIDES.forEach(function (s) { console.log((s.type + "       ").slice(0, 7), s.id, s.title); });

assert.strictEqual(READINGS.length, 1);
assert.strictEqual(READINGS[0].id, "geddes-1990");
assert.strictEqual(SLIDES.length, READINGS[0].slides.length);
assert.strictEqual(SLIDES.length, 13, "the seminar is paced for fifteen minutes");
assert.strictEqual(SLIDES[0].type, "title");
assert.strictEqual(SLIDES[0].id, "open");
assert.strictEqual(SLIDES[0].title, "How the Cases You Choose Affect the Answers You Get");
assert.ok(SLIDES.some(function (s) { return s.id === "close"; }));
assert.ok(SLIDES.some(function (s) { return s.id === "figure4" && s.type === "claims"; }));
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
assert.strictEqual(withChart.length, 8, "the conceptual diagram, Figures 1-6 and Table 2 are represented across the boards");
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "ask"; })[0].chart.id, "geddes-selection");
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "regions"; })[0].chart.id, "geddes-fig1");
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "fits"; })[0].type, "prompt");
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "regions"; })[0].chart.id, "geddes-fig1");
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "figure2"; })[0].chart.id, "geddes-fig2");
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "fits"; })[0].chart.id, "geddes-fig3");
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "figure4"; })[0].chart.id, "geddes-fig4");
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "figure5"; })[0].chart.id, "geddes-fig5");
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "chile"; })[0].chart.id, "geddes-fig6");
assert.ok(/Figure 3/.test(SLIDES.filter(function (s) { return s.id === "fits"; })[0].chart.source));
assert.ok(/Figure 2/.test(SLIDES.filter(function (s) { return s.id === "figure2"; })[0].chart.source));
assert.ok(/Seven defeat\/no-revolution/.test(SLIDES.filter(function (s) { return s.id === "figure5"; })[0].chart.note));
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "hirschman"; })[0].chart.id, "table2");
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "hirschman"; })[0].chart.bars.length, 5);
assert.ok(/ten country-period instances/.test(SLIDES.filter(function (s) { return s.id === "figure5"; })[0].chart.note));
assert.ok(/five selected Table 2 observations/.test(SLIDES.filter(function (s) { return s.id === "hirschman"; })[0].chart.note));
assert.ok(/curve or a few NICs/.test(JSON.stringify(SLIDES.filter(function (s) { return s.id === "fits"; }))));
assert.ok(!/The five are all a 3/.test(JSON.stringify(SLIDES)));

var prompts = SLIDES.filter(function (s) { return s.type === "prompt"; });
assert.strictEqual(prompts.length, 3, "exactly three live interactions");
prompts.forEach(function (p) { assert.ok(p.help); });
var chile = SLIDES.filter(function (s) { return s.id === "chile"; })[0];
assert.strictEqual(chile.type, "claims");
assert.ok(/1972/.test(chile.chart.title));

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
["regions","figure2","fits","skocpol","figure4","figure5"].forEach(function (id) {
  var row = SCRIPT.filter(function (s) { return s.id === id; })[0];
  assert.ok(row && /RAQUEL/.test(row.notes), "Raquel owns graph section slide " + id);
});
assert.strictEqual(SLIDES.filter(function (s) { return s.id === "fits"; })[0].type, "prompt", "Figure 3 accepts student responses");
assert.ok(SCRIPT.some(function (s) { return s.id === "hirschman" && /TOBYN/.test(s.notes); }), "Hirschman slide returns to Tobyn for Part 3");
assert.ok(SCRIPT.some(function (s) { return s.id === "close" && /TOBYN/.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "quote-sample" && /TOBYN/.test(s.notes); }), "Tobyn completes the sample-design interaction before handover");
["hirschman","chile","close"].forEach(function (id) {
  var row = SCRIPT.filter(function (s) { return s.id === id; })[0];
  assert.ok(row && /TOBYN/.test(row.notes), "Tobyn leads the final Chile section and conclusion");
});

assert.ok(SCRIPT.some(function (s) { return s.id === "nics" && /INTERACTION 1 OF 3/.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "quote-sample" && /INTERACTION 2 OF 3/.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "fits" && /INTERACTION 3 OF 3/.test(s.notes); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "figure2" && /r-squared is only \.07/.test(s.say); }));
assert.ok(SCRIPT.some(function (s) { return s.id === "fits" && /straight-line fit is almost flat/.test(s.say); }));
assert.ok(/15:00/.test(SCRIPT[SCRIPT.length - 1].title));
assert.deepStrictEqual(SLIDES.map(function (s) { return s.id; }), ["open","ask","nics","quote-sample","regions","figure2","fits","skocpol","figure4","figure5","hirschman","chile","close"]);
assert.ok(!/five-minute pairs activity/.test(JSON.stringify(SLIDES)));

var fs = require("fs");
var vm = require("vm");
["deck.js", "sync.js", "slideshow.js", "readings/geddes-1990.js", "readings/geddes-visuals.js"].forEach(function (name) {
  new vm.Script(fs.readFileSync("./" + name, "utf8"), { filename: name });
});
var admin = fs.readFileSync("./present/index.html", "utf8");
var adminAlias = fs.readFileSync("./adminpresentation.html", "utf8");
var user = fs.readFileSync("./index.html", "utf8");
var backup = fs.readFileSync("./slideshow.html", "utf8");
var start = fs.readFileSync("./start.html", "utf8");
var css = fs.readFileSync("./style.css", "utf8");
var audienceCss = fs.readFileSync("./audience.css", "utf8");
var cfg = fs.readFileSync("./config.js", "utf8");
assert.ok(admin.indexOf("readings/geddes-1990.js") !== -1);
assert.ok(admin.indexOf("readings/geddes-visuals.js") !== -1);
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
assert.ok(user.indexOf("audience.css") !== -1);
assert.ok(user.indexOf("geddes-figures.css") !== -1);
assert.ok(user.indexOf("class=\"title-join-block\"") === -1, "no visible title URL in the student HTML");
assert.ok(user.indexOf('class="role-part is-desk"') !== -1);
assert.ok(user.indexOf("Open this on a laptop") !== -1);
assert.ok(user.indexOf('id="uga-kicker"') !== -1);
assert.ok(backup.indexOf("readings/geddes-1990.js") !== -1);
assert.ok(backup.indexOf("readings/geddes-visuals.js") !== -1);
assert.ok(backup.indexOf("geddes-figures.css") !== -1);
assert.ok(backup.indexOf("geddes-layout-fix.css") !== -1, "backup slideshow uses the same anti-clipping layout rules");
assert.ok(fs.existsSync("./visual-test.mjs"));
assert.ok(/geddes-chart-enter/.test(fs.readFileSync("./geddes-figures.css", "utf8")), "figure artwork has a restrained entrance animation");
assert.ok(fs.existsSync("./.github/workflows/geddes-visual-regression.yml"));

assert.ok(start.indexOf("Presenter") !== -1 && start.indexOf("Audience") !== -1 && start.indexOf("Backup slideshow") !== -1);
assert.ok(admin.indexOf('id="reveal"') === -1, "unused reveal control removed");
assert.ok(admin.indexOf('id="fs-title"') === -1, "QR/title room tool removed");
assert.ok(admin.indexOf('id="fs-end"') === -1, "duplicate end-room tool removed");
assert.ok(admin.indexOf('id="failsafe-open" aria-haspopup="dialog"') !== -1, "room status opens an accessible dialog");
assert.ok(admin.indexOf("Room status") !== -1 && admin.indexOf("Room actions") !== -1 && admin.indexOf("Room tools") === -1, "outdated room tools panel has been renamed and rebuilt");
assert.ok(admin.indexOf("Reset check-ins") !== -1 && admin.indexOf("including active students") !== -1, "room reset action clearly warns that it disconnects active students");
assert.ok(admin.indexOf('id="fs-slide"') !== -1 && admin.indexOf('id="fs-pull"') !== -1 && admin.indexOf('id="fs-probe"') !== -1 && admin.indexOf('id="fs-seats"') !== -1 && admin.indexOf('id="fs-copy"') !== -1);
assert.ok(admin.indexOf('id="key-change"') === -1 && admin.indexOf('id="roster-form"') === -1, "key and roster editing remain on the editor page, not in live-room recovery");
assert.ok(admin.indexOf('id="fs-push"') === -1 && admin.indexOf('id="fs-unkick"') === -1, "obsolete duplicate recovery actions removed");

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
assert.ok(fs.existsSync("./geddes-figures.css"));
assert.ok(fs.existsSync("./geddes-layout-fix.css"));
var layoutFix = fs.readFileSync("./geddes-layout-fix.css", "utf8");
assert.ok(layoutFix.indexOf("overflow-y: auto !important") !== -1, "both routes allow internal slide scrolling instead of clipping");
assert.ok(layoutFix.indexOf("max-width: none !important") !== -1, "graphs are not constrained to the old narrow presenter width");
assert.ok(layoutFix.indexOf("geddes-fig3") !== -1, "Figure 3 graph and interaction have a dedicated fit");
assert.ok(layoutFix.indexOf('geddes-fig1') !== -1 && layoutFix.indexOf('geddes-fig6') !== -1, "Figures 1 and 6 use full-width figure layouts");
assert.ok(layoutFix.indexOf("max-width: 1100px") !== -1, "compact laptop layouts are handled");

/* Layout regression guards: explicit figure metadata replaces competing :has rules. */
assert.ok(!layoutFix.includes(":has("), "the figure layout uses explicit slide metadata, not competing :has selectors");
assert.ok(layoutFix.indexOf('body.role-part .stage[data-chart="geddes-fig3"] .ask-panel') !== -1);
assert.ok(layoutFix.indexOf("overflow: visible !important") !== -1, "Figure 3 answer panel must not create a nested clipped scroll area");
assert.ok(layoutFix.indexOf("max-height: none !important") !== -1, "Figure 3 answer panel must be allowed to grow to its content");
assert.ok(layoutFix.indexOf("grid-template-columns: repeat(2, minmax(0, 1fr)) !important") !== -1, "Figure 3 choices use a compact two-column layout");
assert.ok(layoutFix.indexOf("max-height: min(50vh, 390px)") !== -1, "Figure 3 chart height is bounded to leave room for the question");
assert.ok(layoutFix.indexOf("flex-wrap: wrap") !== -1, "presenter toolbar can wrap on narrower laptop widths");
assert.ok(layoutFix.indexOf(":focus-visible") !== -1, "keyboard focus is visible across both presentation roles");
assert.ok(layoutFix.indexOf(".failsafe-card") !== -1 && layoutFix.indexOf("grid-template-columns: repeat(2, minmax(0, 1fr))") !== -1, "room status panel follows the deck visual system");
var deckSrc = fs.readFileSync("./deck.js", "utf8");
var syncSrc = fs.readFileSync("./sync.js", "utf8");
assert.ok(deckSrc.indexOf('stage.setAttribute("data-chart"') !== -1, "live student and presenter routes publish the active figure id");
assert.ok(fs.readFileSync("./slideshow.js", "utf8").indexOf('stage.setAttribute("data-chart"') !== -1, "backup route shares the same figure layout metadata");
assert.ok(fs.readFileSync("./readings/geddes-visuals.js", "utf8").indexOf('title:".07"') !== -1, "Figure 2 has a single clear takeaway beside the graph");
assert.ok(deckSrc.indexOf('temporary backup; restore Firebase before refreshing') !== -1, "room status warns when the temporary backup transport is active");
assert.ok(deckSrc.indexOf('["Activity", activity]') !== -1 && deckSrc.indexOf('["Responses"') !== -1, "room status reports the active activity and response count");
assert.ok(deckSrc.indexOf('This also removes students who are currently connected') !== -1, "resetting check-ins requires an explicit warning");
assert.ok(deckSrc.indexOf('if (isPres) {\n      render(n);') !== -1, "presenter view still renders when the room slide changes");
assert.ok(deckSrc.indexOf('if (wasReload && shouldResume)') !== -1 && deckSrc.indexOf('DeckSync.present();') !== -1, "presenter refresh restores the live room");
assert.ok(syncSrc.indexOf("function queueBackupResponse(msg)") !== -1 && syncSrc.indexOf("function flushBackupResponses()") !== -1, "backup responses are queued and persisted after reconnection");
assert.ok(syncSrc.indexOf('lastError = "Firebase read HTTP " + r.status') !== -1, "Firebase read failures trigger backup mode");
assert.ok(syncSrc.indexOf('sessionStorage.setItem("deck-resume-live", "1")') !== -1, "live presenter state is preserved during refresh");
assert.ok(fs.existsSync("./live-room-test.mjs"), "live transport regression tests are included");
assert.ok(fs.readFileSync("./.github/workflows/geddes-visual-regression.yml", "utf8").indexOf("node live-room-test.mjs") !== -1, "live transport tests run in CI");



["geddes-selection.svg","geddes-fig1.svg","geddes-fig2.svg","geddes-fig3.svg","geddes-fig4.svg","geddes-fig5.svg","geddes-fig6.svg"].forEach(function (name) { assert.ok(fs.existsSync("./figures/" + name)); });
var fig4svg = fs.readFileSync("./figures/geddes-fig4.svg", "utf8");
var fig5svg = fs.readFileSync("./figures/geddes-fig5.svg", "utf8");
assert.ok(fig4svg.indexOf("China after the") !== -1 && fig4svg.indexOf("Russia, World War I") !== -1);
assert.ok(fig4svg.indexOf("Prussia") !== -1 && fig4svg.indexOf("Japan") !== -1);
assert.ok(fig5svg.indexOf("Bolivia, 1903") !== -1 && fig5svg.indexOf("Nicaragua, 1979") !== -1);
assert.ok(fig5svg.indexOf("Cuba (1959)") !== -1 && fig5svg.indexOf("El Salvador, Peru and Guatemala") !== -1);
var fig6svg = fs.readFileSync("./figures/geddes-fig6.svg", "utf8");
["1955","84%","1956","38%","1957","17%","1960","5%","1961","10%","1972","above 100%"].forEach(function (v) {
  assert.ok(fig6svg.indexOf(v) !== -1, "Figure 6 retains " + v);
});
assert.ok(/not an annual series/.test(fig6svg), "Figure 6 labels the dashed extension as schematic");

assert.ok(fs.existsSync("./uga-logo.png"));
assert.ok(admin.indexOf("uga-logo.png") !== -1);
assert.ok(backup.indexOf("uga-logo.png") !== -1);
assert.ok(admin.indexOf("uga-arch") === -1);
assert.ok(css.indexOf("user-select: none") !== -1);
assert.ok(css.indexOf("flex-wrap: nowrap") !== -1);
assert.ok(deckSrc.indexOf("I'm in") !== -1);
assert.ok(deckSrc.indexOf("Who are you?") === -1);
assert.ok(deckSrc.indexOf("function bindRank") !== -1);
assert.ok(deckSrc.indexOf("function bindPlace") !== -1);
assert.ok(deckSrc.indexOf('data-move="up"') !== -1 && deckSrc.indexOf('data-move="down"') !== -1, "rank task has keyboard-operable move controls");
assert.ok(deckSrc.indexOf('data-token-place') !== -1 && deckSrc.indexOf('board.addEventListener("change"') !== -1, "placement task has a keyboard-operable select alternative");
assert.ok(deckSrc.indexOf('role="img" aria-label="\' + esc(accessible)') !== -1, "figure redraws expose an accessible description");

assert.ok(deckSrc.indexOf("if (!canSend || isPres) return;") !== -1, "presenter cannot drag or submit student input");
assert.ok(deckSrc.indexOf("if (isPres || !DeckSync.seated() || !DeckSync.isPresenting()) return Promise.resolve(false);") !== -1, "only a seated live student can submit");
assert.ok(deckSrc.indexOf("Room responses") !== -1, "presenter sees response summary rather than drag trays");
assert.ok(!/dragHtml\(s, false\)/.test(deckSrc), "presenter view does not render student drag controls");
assert.ok(deckSrc.indexOf("id=\"drag-send\"") !== -1);
assert.ok(deckSrc.indexOf("function fitStage") !== -1);
assert.ok(deckSrc.indexOf("Waiting for votes") === -1);
assert.ok(user.indexOf("data-role=\"participant\"") !== -1);
assert.ok(user.indexOf("classList.add(\"is-desk\")") === -1);
assert.ok(audienceCss.indexOf("calc(100svh * 16 / 9)") !== -1);
assert.ok(audienceCss.indexOf("@media (max-width: 799px)") !== -1, "student view and desktop notice share the 800px minimum");
assert.ok(audienceCss.indexOf("grid-template-columns: repeat(3, minmax(0, 1fr))") !== -1);
assert.ok(deckSrc.indexOf("data-response-count") !== -1);
assert.ok(deckSrc.indexOf("var join = isPres ?") !== -1, "title link is presenter-only");
assert.ok(deckSrc.indexOf("class=\"join-qr\"") === -1);
assert.ok(user.indexOf("class=\"title-join-block\"") === -1, "student HTML has no visible title URL");
assert.ok(deckSrc.indexOf("if (document.body.classList.contains(\"is-hold\"))") !== -1);
assert.ok(deckSrc.indexOf("revealBtn") === -1);
assert.ok(backup.indexOf("slideshow.js") !== -1);
assert.ok(backup.indexOf('id="prev"') !== -1);
assert.ok(css.indexOf(".ghost-nav") !== -1);
var talk = fs.readFileSync("./slideshow.js", "utf8");
assert.ok(talk.indexOf("function bindRank") !== -1);
assert.ok(talk.indexOf("function bindPlace") !== -1);
assert.ok(talk.indexOf("function fitStage") !== -1);
assert.ok(talk.indexOf(">Build</text>") !== -1 && talk.indexOf(">Test</text>") !== -1 && talk.indexOf(">Time</text>") !== -1, "backup closing slide reinforces build, test and time");
assert.ok(talk.indexOf("Math.max(0.68") === -1, "backup slideshow does not shrink slides to fit");
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
assert.ok(syncSrc.indexOf("return shout(row)") !== -1, "response submission exposes delivery success or failure");
assert.ok(syncSrc.indexOf("Backup message could not be sent") !== -1, "backup delivery failures are surfaced");
assert.ok(syncSrc.indexOf("function retryFirebase()") !== -1 && syncSrc.indexOf("setInterval(retryFirebase, 20000)") !== -1, "Firebase reconnection is retried");
assert.ok(syncSrc.indexOf("function takeRoom(data)") !== -1 && syncSrc.indexOf("ingestAnswers(data)") !== -1, "presenter refresh restores persisted room responses");
assert.ok(syncSrc.indexOf("onResponses: function (fn)") !== -1, "presenter response listeners are restored after room data loads");
assert.ok(fs.existsSync("./docs/live-room-verification.md"), "live transport and refresh scenarios have a repeatable test plan");

assert.ok(deckSrc.indexOf("pendingSubmissions") !== -1 && deckSrc.indexOf("That did not reach the room") !== -1, "student submission blocks duplicates and provides a retry path");
assert.ok(deckSrc.indexOf('var inner = \'<div class="ask">\' + q + "</div>";') !== -1, "student prompt includes the teaching column");
assert.ok(fs.readFileSync("./index.html", "utf8").includes('<body class="role-part is-desk"'), "audience page has its own participant role at load time");
assert.ok(fs.readFileSync("./index.html", "utf8").includes('href="audience.css"'), "audience page loads its own classroom styles");

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
