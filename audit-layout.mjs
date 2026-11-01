import { chromium } from "playwright";
import { createServer } from "http";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { extname, join } from "path";

const ROOT = "/workspace";
const OUT = join(ROOT, "audit-out");
const PORT = 8766;
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".json": "application/json"
};

mkdirSync(OUT, { recursive: true });

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

function lum(rgb) {
  const [r, g, b] = rgb.map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function parseRgb(s) {
  const m = String(s).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

async function unlockAdmin(page) {
  const gate = page.locator("#gate");
  if (await gate.isVisible()) {
    await page.fill("#key", "example");
    await page.click("#gate-form button[type=submit]");
    await page.locator("#app").waitFor({ state: "visible" });
  }
}

async function measurePage(page, label) {
  return page.evaluate((label) => {
    const fails = [];
    const chrome = document.querySelector(".chrome");
    const stage = document.getElementById("stage");
    const board = document.querySelector(".board");
    const chromeBox = chrome ? chrome.getBoundingClientRect() : null;
    const stageBox = stage ? stage.getBoundingClientRect() : null;

    if (chrome) {
      const cs = getComputedStyle(chrome);
      if (cs.flexWrap === "wrap") fails.push("chrome flex-wrap:wrap");
      if (chrome.scrollWidth > chrome.clientWidth + 2) fails.push("chrome overflows horizontally");
      if (chrome.scrollHeight > chrome.clientHeight + 4) fails.push("chrome wraps/overflows vertically " + chrome.scrollHeight + ">" + chrome.clientHeight);
      chrome.querySelectorAll("button").forEach((btn) => {
        const us = getComputedStyle(btn).userSelect;
        if (us !== "none") fails.push("button user-select is " + us + " on " + (btn.id || btn.textContent));
        const r = btn.getBoundingClientRect();
        if (r.bottom - 1 > chromeBox.bottom) fails.push("button below chrome: " + (btn.id || btn.textContent.trim()));
      });
    }

    const walk = (root) => {
      if (!root) return;
      const els = root.querySelectorAll("*");
      els.forEach((el) => {
        const cs = getComputedStyle(el);
        if ((cs.overflow === "auto" || cs.overflowY === "auto" || cs.overflowX === "auto" ||
             cs.overflow === "scroll" || cs.overflowY === "scroll" || cs.overflowX === "scroll") &&
            (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2)) {
          fails.push("inner scrollbar " + (el.id || el.className));
        }
        if (el.classList.contains("sr")) return;
        if (el.childElementCount === 0 && (el.innerText || "").trim()) {
          const ellipsis = cs.textOverflow === "ellipsis" || cs.overflow === "hidden";
          if (el.scrollWidth > el.clientWidth + 2 && !ellipsis) fails.push("text overflows parent " + (el.className || el.tagName) + " “" + el.innerText.slice(0, 40) + "”");
          if (el.scrollHeight > el.clientHeight + 3 && cs.overflow === "hidden" && !el.classList.contains("sr")) {
            fails.push("text clipped " + (el.className || el.tagName) + " “" + el.innerText.slice(0, 40) + "”");
          }
        }
        if (chromeBox && stage && stage.contains(el) && (el.innerText || "").trim()) {
          const r = el.getBoundingClientRect();
          if (r.width > 2 && r.height > 2 && r.bottom > chromeBox.top && r.top < chromeBox.bottom && r.left < chromeBox.right && r.right > chromeBox.left) {
            fails.push("content under bar: " + (el.className || el.tagName) + " “" + el.innerText.slice(0, 32) + "”");
          }
        }
      });
    };
    walk(stage);
    walk(chrome);

    if (board && getComputedStyle(document.body).getPropertyValue("--paper")) {
      // contrast on visible text
    }
    if (stage) {
      stage.querySelectorAll("h1, h2, p, li, button, .chart-lab, .chart-n, .label, .token, .slot-lab").forEach((el) => {
        const cs = getComputedStyle(el);
        const fg = cs.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        let bgEl = el;
        let bg = null;
        while (bgEl && !bg) {
          const b = getComputedStyle(bgEl).backgroundColor;
          const m = b.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?/);
          if (m && Number(m[4] == null ? 1 : m[4]) > 0.6) bg = [Number(m[1]), Number(m[2]), Number(m[3])];
          bgEl = bgEl.parentElement;
        }
        if (fg && bg) {
          const lin = (v) => {
            const x = v / 255;
            return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
          };
          const L = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
          const a = L([Number(fg[1]), Number(fg[2]), Number(fg[3])]);
          const b = L(bg);
          const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
          if (ratio < 4.5 && (el.innerText || "").trim()) {
            fails.push("contrast " + ratio.toFixed(2) + " on “" + el.innerText.slice(0, 36) + "”");
          }
        }
      });
    }

    return {
      label,
      title: document.title,
      slide: (stage && stage.querySelector("h1") && stage.querySelector("h1").textContent) || "",
      fails,
      chrome: chromeBox && { y: chromeBox.bottom, h: chromeBox.height, wrap: getComputedStyle(chrome).flexWrap },
      stage: stageBox && { y: stageBox.top, h: stageBox.height }
    };
  }, label);
}

async function shot(page, name) {
  const dest = join(OUT, name + ".png");
  await page.screenshot({ path: dest, fullPage: false });
  return dest;
}

async function injectVotes(page) {
  await page.evaluate(() => {
    const viz = document.getElementById("viz");
    if (!viz) return;
    viz.classList.remove("is-hidden");
    viz.innerHTML = '<p class="tally">4 answers</p><div class="bars">'
      + '<div class="bar lead"><div class="bar-top"><span class="lab">The five growers</span><span class="pct">50%</span></div><div class="track"><div class="fill" style="width:50%"></div></div><span class="n">2</span></div>'
      + '<div class="bar"><div class="bar-top"><span class="lab">Her wider Third World set</span><span class="pct">25%</span></div><div class="track"><div class="fill" style="width:25%"></div></div><span class="n">1</span></div>'
      + '<div class="bar"><div class="bar-top"><span class="lab">Skocpol\'s three revolutions</span><span class="pct">25%</span></div><div class="track"><div class="fill" style="width:25%"></div></div><span class="n">1</span></div>'
      + '<div class="bar"><div class="bar-top"><span class="lab">The nine Spanish-American cases</span><span class="pct">0%</span></div><div class="track"><div class="fill" style="width:0%"></div></div><span class="n">0</span></div>'
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

const browser = await chromium.launch({ args: ["--disable-dev-shm-usage"] });

async function runPresenter(kind, path) {
  for (const vp of viewports) {
    for (const zoom of zooms) {
      const context = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        deviceScaleFactor: 1
      });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}/${path}?local=1`, { waitUntil: "domcontentloaded" });
      await page.evaluate((z) => { document.body.style.zoom = String(z); }, zoom);
      if (kind === "admin") await unlockAdmin(page);
      await page.waitForTimeout(200);

      const count = await page.evaluate(() => (window.SLIDES || []).length);
      for (let i = 0; i < count; i++) {
        if (kind === "admin") {
          await page.evaluate((n) => { if (window.DeckSync) window.DeckSync.setSlide(n); }, i);
        } else {
          await page.evaluate((n) => { location.hash = "#" + (n + 1); }, i);
        }
        await page.waitForTimeout(80);
        const slideId = await page.evaluate(() => {
          const n = window.DeckSync ? window.DeckSync.getSlide() : Math.max(0, parseInt(String(location.hash).replace("#", ""), 10) - 1 || 0);
          return ((window.SLIDES || [])[n] || {}).id;
        });
        const base = `${kind}-${slideId || i}-${vp.w}x${vp.h}-z${zoom}`;
        const m1 = await measurePage(page, base);
        results.push(m1);
        if (zoom === 1 && vp.w === 1280) await shot(page, `after-${kind}-${slideId || i}`);

        const type = await page.evaluate(() => {
          const n = window.DeckSync ? window.DeckSync.getSlide() : Math.max(0, parseInt(String(location.hash).replace("#", ""), 10) - 1 || 0);
          return ((window.SLIDES || [])[n] || {}).type;
        });
        if (kind === "admin" && type === "prompt") {
          const reveal = page.locator("#reveal");
          if (await reveal.isVisible()) {
            await reveal.click();
            await page.waitForTimeout(80);
            const m2 = await measurePage(page, base + "-reveal");
            results.push(m2);
            await injectVotes(page);
            await page.waitForTimeout(40);
            const m3 = await measurePage(page, base + "-votes");
            results.push(m3);
            if (zoom === 1 && vp.w === 1280) await shot(page, `after-${kind}-${slideId}-votes`);
          }
        }
      }

      if (kind === "admin" && zoom === 1) {
        await page.evaluate(() => { if (window.DeckSync) window.DeckSync.setSlide(0); });
        const live = page.locator("#live");
        if (await live.isVisible()) {
          await live.click();
          await page.waitForTimeout(120);
          const m = await measurePage(page, `admin-live-${vp.w}x${vp.h}`);
          results.push(m);
        }
      }
      await context.close();
    }
  }
}

await runPresenter("admin", "adminpresentation.html");
await runPresenter("slideshow", "slideshow.html");

const phones = [
  { w: 390, h: 844 },
  { w: 1024, h: 640 }
];
for (const vp of phones) {
  for (const zoom of zooms) {
    const context = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${PORT}/index.html?local=1`, { waitUntil: "domcontentloaded" });
    await page.evaluate((z) => { document.body.style.zoom = String(z); }, zoom);
    await page.waitForTimeout(200);
    results.push(await measurePage(page, `student-wait-${vp.w}x${vp.h}-z${zoom}`));
    if (zoom === 1 && vp.w === 390) await shot(page, "after-student-wait");

    const pick = page.locator(".name-pick").first();
    if (await pick.count()) {
      await pick.click({ force: true });
      const face = page.locator(".face-pick").first();
      if (await face.count()) await face.click({ force: true });
      const seat = page.locator("#seat");
      if (await seat.count()) await seat.click({ force: true });
      await page.waitForTimeout(200);
      results.push(await measurePage(page, `student-hold-${vp.w}x${vp.h}-z${zoom}`));
      if (zoom === 1 && vp.w === 390) await shot(page, "after-student-hold");
    }
    await context.close();
  }
}

await browser.close();
server.close();

const failed = results.filter((r) => r.fails && r.fails.length);
writeFileSync(join(OUT, "audit.json"), JSON.stringify({ failed: failed.length, total: results.length, results }, null, 2));
console.log("AUDIT", failed.length ? "FAIL" : "PASS", failed.length + "/" + results.length);
failed.slice(0, 40).forEach((r) => {
  console.log("—", r.label);
  r.fails.forEach((f) => console.log("   ", f));
});
if (failed.length > 40) console.log("..." + (failed.length - 40) + " more failing states");
process.exit(failed.length ? 1 : 0);
