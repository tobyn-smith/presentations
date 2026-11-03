import { chromium } from "playwright";

const room = "live-test-930d-" + Date.now().toString(36);
const base = "http://127.0.0.1:8766/geddes";
const fb = "https://intl6010-default-rtdb.firebaseio.com/deck/" + room + ".json";
const evidence = { room, seats: 0, voteMs: null, placeMs: null, studentSlide: null };

async function unlock(page) {
  await page.goto(base + "/present/?room=" + room, { waitUntil: "networkidle" });
  if (await page.locator("#gate-form").isVisible()) {
    await page.fill("#key", "6010");
    await page.click('#gate-form button[type="submit"]');
  } else if (await page.locator("#gate-set-form").isVisible()) {
    await page.fill("#key-new", "6010");
    await page.fill("#key-again", "6010");
    await page.click('#gate-set-form button[type="submit"]');
  }
  await page.waitForSelector("#app:not([hidden])", { timeout: 8000 });
}

const browser = await chromium.launch();
const presCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const phoneCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const pres = await presCtx.newPage();
const phone = await phoneCtx.newPage();

try {
  await unlock(pres);
  await pres.click("#live");
  await pres.waitForTimeout(600);

  await phone.goto(base + "/?room=" + room, { waitUntil: "networkidle" });
  await phone.locator("#seat").click();
  await pres.waitForFunction(() => {
    const el = document.querySelector(".seated-count");
    return el && parseInt(el.textContent, 10) >= 1;
  }, { timeout: 4000 });
  evidence.seats = await pres.evaluate(() => parseInt(document.querySelector(".seated-count").textContent, 10));

  await pres.evaluate(() => DeckSync.setSlide(14));
  await phone.waitForFunction(() => window.DeckSync && DeckSync.getSlide() === 14, { timeout: 4000 });
  evidence.studentSlide = await phone.evaluate(() => DeckSync.getSlide());

  const tVote = Date.now();
  await phone.locator('button[data-choice="The five growers"]').click();
  await phone.fill("#ans", "because I know the five");
  await phone.locator("#form button[type=submit], #form button, form#form button").first().click();
  await pres.waitForFunction(() => {
    const t = document.getElementById("viz")?.textContent || "";
    return /1 answer|The five growers/.test(t);
  }, { timeout: 4000 });
  evidence.voteMs = Date.now() - tVote;

  await pres.evaluate(() => DeckSync.setSlide(4));
  await phone.waitForFunction(() => window.DeckSync && DeckSync.getSlide() === 4, { timeout: 4000 });
  await phone.waitForSelector(".token", { timeout: 4000 });
  await phone.evaluate(() => {
    var wells = {
      show: document.querySelector('.slot[data-slot="show"] .slot-well'),
      not: document.querySelector('.slot[data-slot="not"] .slot-well')
    };
    var toks = Array.prototype.slice.call(document.querySelectorAll(".token"));
    wells.show.appendChild(toks[0]);
    wells.not.appendChild(toks[1]);
    wells.show.appendChild(toks[2]);
  });
  const tPlace = Date.now();
  await phone.locator("#drag-send").click();
  await pres.waitForFunction(() => {
    const t = document.getElementById("viz")?.textContent || "";
    return /1 answer|What the five show|What does not follow/.test(t);
  }, { timeout: 4000 });
  evidence.placeMs = Date.now() - tPlace;

  if (evidence.seats < 1) throw new Error("seat count did not rise");
  if (evidence.studentSlide !== 14) throw new Error("student did not follow slide");
  if (evidence.voteMs > 2000) throw new Error("vote too slow " + evidence.voteMs);
  if (evidence.placeMs > 2000) throw new Error("place too slow " + evidence.placeMs);
  console.log(JSON.stringify(evidence));
} finally {
  await fetch(fb, { method: "DELETE" });
  await browser.close();
}
