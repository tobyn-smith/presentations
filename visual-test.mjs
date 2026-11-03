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
  { width: 1366, height: 768 },
  { width: 1280, height: 720 },
  { width: 1024, height: 768 }
];
const report = { generatedAt: new Date().toISOString(), route: "/slideshow.html", slides: 0, viewports: [], failures: [] };

try {
  for (const viewport of viewports) {
    for (const mode of ["presenter", "student"]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      page.on("pageerror", error => report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " browser error: " + error.message));
      await page.goto("http://127.0.0.1:4173/slideshow.html", { waitUntil: "networkidle" });
      if (mode === "student") {
        await page.addStyleTag({ path: path.join(root, "audience.css") });
        await page.evaluate(() => {
          document.body.classList.remove("role-pres", "is-backup");
          document.body.classList.add("role-part", "is-desk");
        });
      }
      const total = await page.evaluate(() => (window.SLIDES || []).length);
      report.slides = total;
      if (total !== 13) report.failures.push("Expected 13 slides, found " + total);
      const dir = path.join(out, mode, viewport.width + "x" + viewport.height);
      fs.mkdirSync(dir, { recursive: true });

      for (let index = 0; index < total; index++) {
        if (index > 0) {
          await page.keyboard.press("ArrowRight");
          await page.waitForFunction(expected => document.querySelector("#counter")?.textContent.trim() === String(expected), index + 1);
        }
        await page.waitForTimeout(80);
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
          return {
            title: stage.querySelector("h1")?.textContent.trim() || "",
            scrollWidth: root.scrollWidth,
            viewportWidth: window.innerWidth,
            stageClientHeight: stage.clientHeight,
            stageScrollHeight: stage.scrollHeight,
            stageOverflow: Math.max(0, stage.scrollHeight - stage.clientHeight),
            nestedClips: clips,
            chartId,
            chartArtworkHeight: artHeight,
            chartWidth: chart ? Math.round(chart.getBoundingClientRect().width) : 0,
            stageClientWidth: stage.clientWidth,
            repeatedSectionKicker: mode === "student" && Array.from(stage.querySelectorAll(".slide-kicker")).some(el => getComputedStyle(el).display !== "none")
          };
        });
        if (metrics.scrollWidth > viewport.width + 1) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " slide " + (index + 1) + ": horizontal page overflow");
        }
        if (metrics.nestedClips.length) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " slide " + (index + 1) + ": nested content clipped: " + metrics.nestedClips.join(", "));
        }
        if (["geddes-fig2","geddes-fig4","geddes-fig5","geddes-fig6"].includes(metrics.chartId) && metrics.chartArtworkHeight < 300) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " slide " + (index + 1) + ": figure artwork missing or too short (" + metrics.chartArtworkHeight + "px)");
        }
        if (metrics.chartId === "geddes-fig3" && metrics.stageOverflow > 40) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " Figure 3 still needs scrolling (" + metrics.stageOverflow + "px overflow)");
        }
        if (metrics.chartId === "geddes-fig2" && metrics.chartWidth < metrics.stageClientWidth * .72) {
          report.failures.push(mode + " " + viewport.width + "x" + viewport.height + " Figure 2 leaves an empty chart column");
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
      await page.close();
    }
  }

  // Exercise the real presenter status drawer in local mode without contacting Firebase.
  const admin = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await admin.addInitScript(() => sessionStorage.setItem("deck-key", "6010"));
  await admin.goto("http://127.0.0.1:4173/present/?local=1", { waitUntil: "networkidle" });
  await admin.waitForSelector("#failsafe-open", { state: "visible" });
  await admin.click("#failsafe-open");
  await admin.waitForSelector("#failsafe [role=dialog]", { state: "visible" });
  const dialogText = await admin.locator("#failsafe").innerText();
  if (!dialogText.includes("Room status") || !dialogText.includes("Recovery")) {
    report.failures.push("Room status drawer is missing its title or recovery actions");
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
