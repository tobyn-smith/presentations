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
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    page.on("pageerror", error => report.failures.push(viewport.width + "x" + viewport.height + " browser error: " + error.message));
    await page.goto("http://127.0.0.1:4173/slideshow.html", { waitUntil: "networkidle" });
    const total = await page.evaluate(() => (window.SLIDES || []).length);
    report.slides = total;
    if (total !== 13) report.failures.push("Expected 13 slides, found " + total);
    const dir = path.join(out, viewport.width + "x" + viewport.height);
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
          chartArtworkHeight: artHeight
        };
      });
      if (metrics.scrollWidth > viewport.width + 1) {
        report.failures.push(viewport.width + "x" + viewport.height + " slide " + (index + 1) + ": horizontal page overflow");
      }
      if (metrics.nestedClips.length) {
        report.failures.push(viewport.width + "x" + viewport.height + " slide " + (index + 1) + ": nested content clipped: " + metrics.nestedClips.join(", "));
      }
      if (["geddes-fig2","geddes-fig4","geddes-fig5","geddes-fig6"].includes(metrics.chartId) && metrics.chartArtworkHeight < 300) {
        report.failures.push(viewport.width + "x" + viewport.height + " slide " + (index + 1) + ": figure artwork missing or too short (" + metrics.chartArtworkHeight + "px)");
      }
      await page.screenshot({
        path: path.join(dir, "slide-" + String(index + 1).padStart(2, "0") + ".png"),
        animations: "disabled"
      });
      report.viewports.push({ viewport: viewport.width + "x" + viewport.height, slide: index + 1, ...metrics });
    }
    await page.close();
  }
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2));
console.log("Captured " + report.viewports.length + " slide/viewport combinations.");
console.log(report.failures.length ? report.failures.join("\n") : "No horizontal overflow or nested clipped content detected.");
if (report.failures.length) process.exitCode = 1;
