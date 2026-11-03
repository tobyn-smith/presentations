import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "artifacts", "geddes-visual");
fs.mkdirSync(out, { recursive: true });

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const target = path.resolve(root, "." + pathname);
  if (!target.startsWith(root)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  fs.readFile(target, (err, data) => {
    if (err) {
      res.writeHead(404).end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mime[path.extname(target)] || "application/octet-stream" });
    res.end(data);
  });
});

await new Promise(resolve => server.listen(4173, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true });
const viewports = [
  { width: 1920, height: 1080 },
  { width: 1600, height: 900 },
  { width: 1366, height: 768 },
  { width: 1280, height: 720 },
  { width: 1024, height: 768 },
  { width: 800, height: 600 }
];
const report = { generatedAt: new Date().toISOString(), routes: { presenter: "/present/index.html?local=1", student: "/index.html?local=1", backup: "/slideshow.html" }, slides: 0, viewports: [], failures: [] };

try {
  for (const viewport of viewports) {
    for (const mode of ["presenter", "student"]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
      const page = await context.newPage();
      page.on("pageerror", error => report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " browser error: " + error.message));
      await page.emulateMedia({ reducedMotion: "reduce" });
      let controller = null;
      if (mode === "student") {
        controller = await context.newPage();
        controller.on("pageerror", error => report.failures.push("controller " + viewport.width + "x" + viewport.height + " browser error: " + error.message));
        await controller.addInitScript(() => sessionStorage.setItem("deck-key", "6010"));
        await controller.goto("http://127.0.0.1:4173/present/index.html?local=1", { waitUntil: "networkidle" });
        await controller.waitForSelector("#live", { state: "visible" });
        await controller.click("#live");
        await controller.waitForFunction(() => document.querySelector("#live")?.getAttribute("aria-pressed") === "true");
        await page.goto("http://127.0.0.1:4173/index.html?local=1", { waitUntil: "networkidle" });
        await page.waitForSelector("#seat", { state: "visible" });
        await page.click("#seat");
        await page.waitForFunction(() => (document.querySelector("#counter")?.textContent || "").split("/")[0].trim() === "1");
      } else {
        await page.addInitScript(() => sessionStorage.setItem("deck-key", "6010"));
        await page.goto("http://127.0.0.1:4173/present/index.html?local=1", { waitUntil: "networkidle" });
        await page.waitForSelector("#next", { state: "visible" });
        await page.waitForSelector("#live", { state: "visible" });
        await page.click("#live");
        await page.waitForFunction(() => document.querySelector("#live")?.getAttribute("aria-pressed") === "true");
      }
      const total = await page.evaluate(() => (window.SLIDES || []).length);
      report.slides = total;
      if (total !== 13) report.failures.push("Expected 13 slides, found " + total);
      const dir = path.join(out, mode, viewport.width + "x" + viewport.height);
      fs.mkdirSync(dir, { recursive: true });

      for (let index = 0; index < total; index++) {
        if (index > 0) {
          if (mode === "student") {
            await controller.click("#next");
            await page.waitForFunction(expected => (document.querySelector("#counter")?.textContent || "").split("/")[0].trim() === String(expected), index + 1);
          } else {
            await page.keyboard.press("ArrowRight");
            await page.waitForFunction(expected => document.querySelector("#counter")?.textContent.trim() === String(expected), index + 1);
          }
        }
        await page.waitForTimeout(80);
        await page.evaluate(() => {
          document.getAnimations().forEach(animation => {
            try { animation.finish(); } catch (error) {}
          });
        });
        const metrics = await page.evaluate(() => {
          const stage = document.querySelector("#stage");
          const root = document.documentElement;
          const clips = [];
          stage.querySelectorAll(".ask-panel,.ss-win-body,.split-viz,.chart").forEach(el => {
            const style = getComputedStyle(el);
            if (/hidden|clip/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 3) {
              clips.push(el.className || el.tagName.toLowerCase());
            }
          });
          const chart = stage.querySelector("figure.chart[data-chart]");
          const chartId = chart?.getAttribute("data-chart") || "";
          const artHeight = chart ? Math.round(parseFloat(getComputedStyle(chart, "::after").height) || 0) : 0;
          const stageRect = stage.getBoundingClientRect();
          const outside = Array.from(stage.querySelectorAll("h1,.split,.ask-panel,.chart,.claim-bars,.choices,form.answer,.drag-place,.drag-rank"))
            .filter(el => {
              const r = el.getBoundingClientRect();
              return r.width > 0 && r.height > 0 &&
                (r.left < stageRect.left - 2 || r.right > stageRect.right + 2 ||
                 r.top < stageRect.top - 2 || (window.innerWidth > 800 && r.bottom > stageRect.bottom + 2));
            })
            .map(el => el.className || el.tagName.toLowerCase());
          return {
            title: stage.querySelector("h1")?.textContent.trim() || "",
            titleJoinHeight: Math.round(stage.querySelector(".title-join")?.getBoundingClientRect().height || 0),
            scrollWidth: root.scrollWidth,
            pageHeightOverflow: Math.max(0, root.scrollHeight - window.innerHeight),
            viewportWidth: window.innerWidth,
            dataChart: stage.getAttribute("data-chart") || "",
            outsideStage: outside,
            stageClientHeight: stage.clientHeight,
            stageScrollHeight: stage.scrollHeight,
            stageOverflow: Math.max(0, stage.scrollHeight - stage.clientHeight),
            nestedClips: clips,
            chartId,
            chartArtworkHeight: artHeight,
            chartWidth: chart ? Math.round(chart.getBoundingClientRect().width) : 0,
            chartCaptionDisplay: chart ? getComputedStyle(chart.querySelector("figcaption") || chart).display : "none",
            stageClientWidth: stage.clientWidth,
            chartRight: chart ? Math.round(chart.getBoundingClientRect().right) : 0,
            askPanelLeft: stage.querySelector(".ask-panel") ? Math.round(stage.querySelector(".ask-panel").getBoundingClientRect().left) : 0,
            askRight: stage.querySelector(".ask") ? Math.round(stage.querySelector(".ask").getBoundingClientRect().right) : 0,
            askHeight: stage.querySelector(".ask") ? Math.round(stage.querySelector(".ask").getBoundingClientRect().height) : 0,
            answerHeight: stage.querySelector(".ask-panel form.answer") ? Math.round(stage.querySelector(".ask-panel form.answer").getBoundingClientRect().height) : 0,
            answerBottom: stage.querySelector(".ask-panel form.answer") ? Math.round(stage.querySelector(".ask-panel form.answer").getBoundingClientRect().bottom) : 0,
            panelBottom: stage.querySelector(".ask-panel") ? Math.round(stage.querySelector(".ask-panel").getBoundingClientRect().bottom) : 0,
            answerDisplay: stage.querySelector(".ask-panel form.answer") ? getComputedStyle(stage.querySelector(".ask-panel form.answer")).display : "missing",
            repeatedSectionKicker: Array.from(stage.querySelectorAll(".slide-kicker")).some(el => getComputedStyle(el).display !== "none")
          };
        });
        if (metrics.scrollWidth > viewport.width + 1) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " slide " + (index + 1) + ": horizontal page overflow");
        }
        const allowedStageOverflow = viewport.width === 800 ? 120 : 24;
        if (metrics.stageOverflow > allowedStageOverflow) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " slide " + (index + 1) + ": content extends " + metrics.stageOverflow + "px beyond the slide stage (limit " + allowedStageOverflow + "px)");
        }
        if (metrics.pageHeightOverflow > 1) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " slide " + (index + 1) + ": the page itself scrolls vertically");
        }
        if (metrics.outsideStage.length) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " slide " + (index + 1) + ": key content extends beyond the visible board: " + metrics.outsideStage.join(", "));
        }
        if (metrics.chartId && metrics.dataChart !== metrics.chartId) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " slide " + (index + 1) + ": slide figure metadata is missing or stale");
        }
        if (metrics.nestedClips.length) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " slide " + (index + 1) + ": nested content clipped: " + metrics.nestedClips.join(", "));
        }
        if (["geddes-fig2","geddes-fig4","geddes-fig5","geddes-fig6"].includes(metrics.chartId) && metrics.chartArtworkHeight < (viewport.width === 800 ? 200 : 300)) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " slide " + (index + 1) + ": figure artwork missing or too short (" + metrics.chartArtworkHeight + "px)");
        }
        if (metrics.chartId === "geddes-fig3" && metrics.stageOverflow > (viewport.width === 800 ? 120 : 40)) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " Figure 3 still needs scrolling (" + metrics.stageOverflow + "px overflow)");
        }
        if (["geddes-fig2","geddes-fig4","geddes-fig5","geddes-fig6"].includes(metrics.chartId) && metrics.stageOverflow > (viewport.width === 800 ? 120 : 20)) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " " + metrics.chartId + " requires excessive slide scrolling (" + metrics.stageOverflow + "px overflow)");
        }
        if (metrics.chartId === "geddes-fig2" && metrics.chartWidth < metrics.stageClientWidth * .52) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " Figure 2 leaves an empty chart column");
        }
        if (metrics.chartId === "geddes-fig2" && metrics.chartCaptionDisplay !== "none") {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " Figure 2 repeats the title/source above its artwork");
        }
        if (["geddes-fig1","geddes-fig6"].includes(metrics.chartId) && metrics.chartWidth < metrics.stageClientWidth * .55) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " " + metrics.chartId + " is not using the full slide width");
        }
        if (mode === "student" && [2,3].includes(index) && metrics.askHeight < 100) {
          report.failures.push(viewport.width + "x" + viewport.height + " student prompt " + (index + 1) + " has no left teaching column");
        }
        if (mode === "student" && [2,3,6].includes(index) && metrics.stageOverflow > (viewport.width === 800 ? 120 : 40)) {
          report.failures.push(viewport.width + "x" + viewport.height + " student interaction " + (index + 1) + " requires scrolling (" + metrics.stageOverflow + "px)");
        }
        if (mode === "student" && [3,6].includes(index)) {
          if (metrics.answerHeight < 70 || metrics.answerDisplay === "none" || metrics.answerBottom > metrics.panelBottom + 2) {
            report.failures.push(viewport.width + "x" + viewport.height + " student interaction " + (index + 1) + " has a missing or clipped response form");
          }
        }
        if (mode === "student" && [2,3].includes(index) && metrics.askPanelLeft < metrics.askRight - 8) {
          report.failures.push(viewport.width + "x" + viewport.height + " student prompt " + (index + 1) + " does not place the task beside the teaching column");
        }
        if (metrics.chartId === "geddes-fig3" && metrics.askPanelLeft < metrics.chartRight - 8) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " Figure 3 question panel is not beside the graph");
        }
        if (index === 0 && metrics.titleJoinHeight > 45) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " title URL wraps into multiple lines");
        }
        if (metrics.repeatedSectionKicker) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " repeats the section label above the slide title");
        }
        await page.screenshot({
          path: path.join(dir, "slide-" + String(index + 1).padStart(2, "0") + ".png"),
          animations: "disabled"
        });
        report.viewports.push({ mode, viewport: viewport.width + "x" + viewport.height, slide: index + 1, ...metrics });
      }
      await context.close();
    }
  }

  // Smoke-test the separate backup slideshow route. It is a fallback, not the presenter UI.
  const backup = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  backup.on("pageerror", error => report.failures.push("backup slideshow browser error: " + error.message));
  await backup.goto("http://127.0.0.1:4173/slideshow.html", { waitUntil: "networkidle" });
  await backup.waitForSelector("#stage", { state: "visible" });
  const backupSlides = await backup.evaluate(() => (window.SLIDES || []).length);
  if (backupSlides !== 13) report.failures.push("Backup slideshow expected 13 slides, found " + backupSlides);
  await backup.click("#next");
  await backup.waitForFunction(() => (document.querySelector("#counter")?.textContent || "").trim().startsWith("2"));
  await backup.screenshot({ path: path.join(out, "backup-slideshow.png"), animations: "disabled" });
  await backup.close();

  // Exercise the real presenter status drawer in local mode without contacting Firebase.
  const admin = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await admin.addInitScript(() => sessionStorage.setItem("deck-key", "6010"));
  await admin.goto("http://127.0.0.1:4173/present/index.html?local=1", { waitUntil: "networkidle" });
  await admin.waitForSelector("#failsafe-open", { state: "visible" });
  await admin.click("#failsafe-open");
  await admin.waitForSelector("#failsafe [role=dialog]", { state: "visible" });
  const dialogText = await admin.locator("#failsafe").innerText();
  if (!dialogText.toLowerCase().includes("room status") ||
      !dialogText.toLowerCase().includes("room actions") ||
      !dialogText.toLowerCase().includes("activity") ||
      !dialogText.toLowerCase().includes("responses")) {
    report.failures.push("Room status drawer is missing its live activity or recovery information");
  }
  await admin.screenshot({ path: path.join(out, "room-status.png"), animations: "disabled" });
  await admin.keyboard.press("Shift+Tab");
  const wrappedLast = await admin.evaluate(() => document.activeElement?.textContent.trim());
  await admin.keyboard.press("Tab");
  const wrappedFirst = await admin.evaluate(() => document.activeElement?.id);
  if (!wrappedLast.includes("Presentation start page") || wrappedFirst !== "failsafe-close") {
    report.failures.push("Room status dialog focus does not wrap at its boundaries");
  }
  await admin.keyboard.press("Escape");
  const closed = await admin.locator("#failsafe").isHidden();
  const restored = await admin.evaluate(() => document.activeElement?.id === "failsafe-open");
  if (!closed || !restored) report.failures.push("Room status dialog did not close and restore focus");
  await admin.close();
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2));
console.log("Captured " + report.viewports.length + " slide/mode/viewport combinations.");
console.log(report.failures.length ? report.failures.join("\n") : "No horizontal overflow or nested clipped content detected.");
if (report.failures.length) process.exitCode = 1;
