import { chromium } from "playwright";
import { createServer } from "http";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { extname, join } from "path";

const ROOT = "/workspace";
const OUT = join(ROOT, "audit-out");
const ART = "/opt/cursor/artifacts/screenshots";
const PORT = 8767;
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".json": "application/json"
};

mkdirSync(OUT, { recursive: true });
try { mkdirSync(ART, { recursive: true }); } catch (e) {}

const server = createServer((req, res) => {
  const path = decodeURIComponent((req.url || "/").split("?")[0]);
  const file = path === "/" ? "/start.html" : path;
  const abs = join(ROOT, file);
  if (!abs.startsWith(ROOT) || !existsSync(abs)) {
    res.writeHead(404);
    res.end("no");
    return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(abs)] || "application/octet-stream" });
  res.end(readFileSync(abs));
});
await new Promise((resolve) => server.listen(PORT, resolve));

async function unlockAdmin(page) {
  const gate = page.locator("#gate");
  if (await gate.isVisible()) {
    await page.fill("#key", "example");
    await page.click("#gate-form button[type=submit]");
    await page.locator("#app").waitFor({ state: "visible" });
  }
}

async function settle(page) {
  await page.evaluate(async () => {
    const stage = document.getElementById("stage");
    if (stage) stage.classList.remove("fade");
    const imgs = Array.from(document.images);
    await Promise.all(imgs.map((img) => {
      if (img.complete && img.naturalWidth) return Promise.resolve();
      return new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
        setTimeout(resolve, 2500);
      });
    }));
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const anims = (document.getAnimations && document.getAnimations()) || [];
    await Promise.all(anims.map((a) => (a.finished ? a.finished.catch(() => {}) : Promise.resolve())));
    if (stage) stage.classList.remove("fade");
  });
  await page.waitForTimeout(60);
}

async function measurePage(page, label, vp) {
  return page.evaluate(({ label, vp }) => {
    const fails = [];
    const chrome = document.querySelector(".chrome");
    const stage = document.getElementById("stage");
    const chromeBox = chrome ? chrome.getBoundingClientRect() : null;

    if (chrome) {
      const cs = getComputedStyle(chrome);
      if (cs.flexWrap === "wrap") fails.push("chrome flex-wrap:wrap");
      if (chrome.scrollHeight > chrome.clientHeight + 4) fails.push("chrome wraps vertically");
      chrome.querySelectorAll("button").forEach((btn) => {
        if (getComputedStyle(btn).userSelect !== "none") fails.push("button user-select on " + (btn.id || btn.textContent));
      });
    }

    const tab = document.querySelector(".role-pres .accent-tab");
    if (tab && getComputedStyle(tab).display !== "none") {
      const r = tab.getBoundingClientRect();
      if (chromeBox && r.top < chromeBox.bottom - 1) fails.push("accent tab cut by bar");
    }

    if (stage) {
      stage.querySelectorAll("*").forEach((el) => {
        if (el.classList.contains("sr")) return;
        const cs = getComputedStyle(el);
        if ((cs.overflowY === "auto" || cs.overflowY === "scroll" || cs.overflow === "auto" || cs.overflow === "scroll") &&
            el.scrollHeight > el.clientHeight + 2) {
          fails.push("inner scrollbar " + (el.id || el.className));
        }
        if (chromeBox && stage.contains(el) && (el.innerText || "").trim()) {
          const r = el.getBoundingClientRect();
          if (r.width > 2 && r.height > 2 && r.bottom > chromeBox.top + 1 && r.top < chromeBox.bottom - 1 &&
              r.left < chromeBox.right && r.right > chromeBox.left) {
            fails.push("content under bar: " + (el.className || el.tagName));
          }
        }
      });
    }

    const qr = document.querySelector(".join-qr");
    if (qr) {
      if (!qr.complete || qr.naturalWidth < 8) fails.push("QR did not render");
    }

    let fill = 1;
    if (stage) {
      const box = stage.getBoundingClientRect();
          const surfaces = stage.querySelectorAll("h1, .slide-kicker, .claim-bars, .claim-bars li, .ss-win, .split, .join, .join-qr, .token, .slot, .name-stack, .stats-stack, .chart, .talk, .talk li, .bar, .choices button, .title-side, .title-copy, p, h2");
      let hit = 0;
      let total = 0;
      const cols = 16;
      const rows = 10;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          total++;
          const px = box.left + (x + 0.5) * box.width / cols;
          const py = box.top + (y + 0.5) * box.height / rows;
          let on = false;
          surfaces.forEach((el) => {
            const r = el.getBoundingClientRect();
            if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom) on = true;
          });
          if (on) hit++;
        }
      }
      fill = total ? hit / total : 1;
      if (document.body.classList.contains("role-pres") && vp && vp.w >= 1280 && fill < 0.69) {
        fails.push("empty stage " + Math.round((1 - fill) * 100) + "% fill=" + fill.toFixed(2));
      }
    }

    if (stage && vp && vp.w === 1280 && vp.zoom === 1 && document.body.classList.contains("role-pres")) {
      const bodies = stage.querySelectorAll(".claim-bars p:not(.card-n), .stats-stack .label, .token, .talk li, .chart-lab, .slot-empty, .choices button");
      bodies.forEach((el) => {
        const px = parseFloat(getComputedStyle(el).fontSize);
        if (px && px < 19.5) fails.push("body too small " + px.toFixed(1) + "px “" + (el.innerText || "").slice(0, 28) + "”");
      });
    }

    return {
      label,
      title: (stage && stage.querySelector("h1") && stage.querySelector("h1").textContent) || "",
      fails,
      fill: Number(fill.toFixed(3))
    };
  }, { label, vp });
}

async function shot(page, name) {
  await settle(page);
  const dest = join(OUT, name + ".png");
  await page.screenshot({ path: dest, fullPage: false });
  try { writeFileSync(join(ART, name + ".png"), readFileSync(dest)); } catch (e) {}
  return dest;
}

async function injectVotes(page) {
  await page.evaluate(() => {
    const viz = document.getElementById("viz");
    if (!viz) return;
    const n = window.DeckSync ? window.DeckSync.getSlide() : 0;
    const s = (window.SLIDES || [])[n] || {};
    viz.classList.remove("is-hidden");
    if (s.input === "place") {
      viz.innerHTML = '<p class="tally">3 answers</p><ol class="responses">'
        + '<li class="card"><p class="said">Labour was repressed or coopted → What the five show</p></li>'
        + '<li class="card"><p class="said">That caused the growth → What does not follow</p></li>'
        + '<li class="card"><p class="said">You have not seen the slow cases → What the five show</p></li>'
        + "</ol>";
      return;
    }
    const opts = s.options || [];
    const counts = opts.map((_, i) => [2, 1, 1, 0][i] || 0);
    const total = counts.reduce((a, b) => a + b, 0) || 1;
    viz.innerHTML = '<p class="tally">' + total + ' answers</p><div class="bars">'
      + opts.map((o, i) => {
        const c = counts[i];
        return '<div class="bar"><div class="bar-top"><span class="lab">' + o + "</span></div>"
          + '<div class="track"><div class="fill" style="width:' + (c / total * 100) + '%"></div></div>'
          + '<span class="n">' + c + "</span></div>";
      }).join("")
      + "</div>";
  });
}

const viewports = [
  { w: 1280, h: 720 },
  { w: 1366, h: 768 },
  { w: 1440, h: 900 },
  { w: 1920, h: 1080 },
  { w: 1024, h: 640 }
];
const zooms = [1, 1.25];
const results = [];
const fills = [];

const browser = await chromium.launch({ args: ["--disable-dev-shm-usage"] });

async function runPresenter(kind, path) {
  for (const vp of viewports) {
    for (const zoom of zooms) {
      const context = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}/${path}?local=1`, { waitUntil: "domcontentloaded" });
      await page.evaluate((z) => { document.body.style.zoom = String(z); }, zoom);
      if (kind === "admin") await unlockAdmin(page);
      await settle(page);
      const count = await page.evaluate(() => (window.SLIDES || []).length);
      for (let i = 0; i < count; i++) {
        if (kind === "admin") {
          await page.evaluate((n) => { if (window.DeckSync) window.DeckSync.setSlide(n); }, i);
        } else {
          await page.evaluate((n) => { location.hash = "#" + (n + 1); }, i);
        }
        await settle(page);
        const slideId = await page.evaluate(() => {
          const n = window.DeckSync ? window.DeckSync.getSlide() : Math.max(0, parseInt(String(location.hash).replace("#", ""), 10) - 1 || 0);
          return ((window.SLIDES || [])[n] || {}).id;
        });
        const type = await page.evaluate(() => {
          const n = window.DeckSync ? window.DeckSync.getSlide() : Math.max(0, parseInt(String(location.hash).replace("#", ""), 10) - 1 || 0);
          return ((window.SLIDES || [])[n] || {}).type;
        });
        const base = `${kind}-${slideId || i}-${vp.w}x${vp.h}-z${zoom}`;
        const m = await measurePage(page, base, { w: vp.w, zoom });
        results.push(m);
        fills.push({ label: base, fill: m.fill, title: m.title });
        if (zoom === 1 && vp.w === 1280) await shot(page, `${kind}-${slideId || i}`);
        if (kind === "admin" && type === "prompt") {
          const reveal = page.locator("#reveal");
          if (await reveal.isVisible()) {
            await reveal.click();
            await settle(page);
            results.push(await measurePage(page, base + "-reveal", { w: vp.w, zoom }));
            await injectVotes(page);
            await settle(page);
            const mv = await measurePage(page, base + "-votes", { w: vp.w, zoom });
            results.push(mv);
            if (zoom === 1 && vp.w === 1280) await shot(page, `${kind}-${slideId}-votes`);
          }
        }
      }
      if (kind === "admin" && zoom === 1) {
        await page.evaluate(() => { if (window.DeckSync) window.DeckSync.setSlide(0); });
        const live = page.locator("#live");
        if (await live.isVisible()) {
          await live.click();
          await settle(page);
          results.push(await measurePage(page, `admin-live-${vp.w}x${vp.h}`, { w: vp.w, zoom }));
        }
      }
      await context.close();
    }
  }
}

await runPresenter("admin", "adminpresentation.html");
await runPresenter("slideshow", "slideshow.html");

const phones = [{ w: 390, h: 844 }, { w: 1024, h: 640 }];
for (const vp of phones) {
  for (const zoom of zooms) {
    const context = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const admin = await context.newPage();
    const page = await context.newPage();
    await admin.goto(`http://127.0.0.1:${PORT}/adminpresentation.html?local=1`, { waitUntil: "domcontentloaded" });
    await unlockAdmin(admin);
    const live = admin.locator("#live");
    if (await live.isVisible()) await live.click();
    await page.goto(`http://127.0.0.1:${PORT}/index.html?local=1`, { waitUntil: "domcontentloaded" });
    await page.evaluate((z) => { document.body.style.zoom = String(z); }, zoom);
    await settle(page);
    results.push(await measurePage(page, `student-wait-${vp.w}x${vp.h}-z${zoom}`, { w: vp.w, zoom }));
    if (zoom === 1 && vp.w === 390) await shot(page, "student-wait");
    const pick = page.locator(".name-pick").first();
    if (await pick.count()) {
      await pick.click({ force: true });
      const face = page.locator(".face-pick").first();
      if (await face.count()) await face.click({ force: true });
      const seat = page.locator("#seat");
      if (await seat.count()) await seat.click({ force: true });
      await page.waitForTimeout(250);
    }
    const count = await admin.evaluate(() => (window.SLIDES || []).length);
    for (let i = 0; i < count; i++) {
      await admin.evaluate((n) => { if (window.DeckSync) window.DeckSync.setSlide(n); }, i);
      await page.waitForTimeout(180);
      await settle(page);
      const slideId = await admin.evaluate(() => {
        const n = window.DeckSync ? window.DeckSync.getSlide() : 0;
        return ((window.SLIDES || [])[n] || {}).id;
      });
      const m = await measurePage(page, `student-${slideId || i}-${vp.w}x${vp.h}-z${zoom}`, { w: vp.w, zoom });
      results.push(m);
      if (zoom === 1 && (vp.w === 390 || vp.w === 1024)) await shot(page, `student-${slideId || i}-${vp.w}`);
    }
    await context.close();
  }
}

await browser.close();
server.close();

const failed = results.filter((r) => r.fails && r.fails.length);
writeFileSync(join(OUT, "audit.json"), JSON.stringify({ failed: failed.length, total: results.length, fills, results }, null, 2));
console.log("AUDIT", failed.length ? "FAIL" : "PASS", failed.length + "/" + results.length);
console.log("FILL");
fills.filter((f) => f.label.indexOf("1280x720-z1") !== -1 && f.label.indexOf("admin-") === 0).forEach((f) => {
  console.log(" ", f.label, "fill", f.fill, f.title);
});
failed.slice(0, 50).forEach((r) => {
  console.log("—", r.label);
  r.fails.forEach((f) => console.log("   ", f));
});
if (failed.length > 50) console.log("..." + (failed.length - 50) + " more");
process.exit(failed.length ? 1 : 0);
