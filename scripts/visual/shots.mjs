/**
 * Screenshots of each Phase 2 effect, for eyeballing regressions.
 *
 *   node scripts/visual/shots.mjs http://localhost:3000/ ./shots
 *
 * Captures elements, not the page. A fullPage screenshot of this site comes
 * out blank below the fold: sections carry `content-visibility: auto`, and
 * Chrome's fullPage capture does not render the skipped subtrees.
 *
 * Each shot is timed to the moment the effect is worth looking at — the
 * architecture band is caught mid-flight, not at rest, because "the dashes
 * are not moving" and "the dashes are moving" look identical in a still.
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const url = process.argv[2] || "http://localhost:3000/";
const outDir = process.argv[3] || "./shots";
fs.mkdirSync(outDir, { recursive: true });

/** [name, selector, ms to wait after it is scrolled into view, hover?] */
const SHOTS = [
  ["01-hero-cta", "[data-hero-cta]", 400, "[data-hero-cta]"],
  ["02-hero-mock", "#top .relative.mx-auto", 2500, null],
  ["03-flight-paths", ".arch", 2600, null],
  ["04-flight-paths-midflight", ".arch > div:nth-child(2)", 4200, null],
  ["05-solutions-glow", "#solutions .reveal-group", 1200, "#solutions [data-spotlight]"],
  ["06-why-glow", "#why .reveal-group", 1200, "#why [data-spotlight]"],
  ["07-showcase", "#showcase .relative.mx-auto", 1800, null],
  ["08-boarding-pass", "#customers .reveal-group", 1600, ".boarding-pass"],
  ["09-roi", "#roi .surface", 900, null],
  ["10-footer", "footer .mt-14", 1200, "footer .font-mono"],
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});

for (const [name, selector, wait, hoverSelector] of SHOTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: "networkidle0" });

  const el = await page.$(selector);
  if (!el) {
    console.log(`MISSING  ${name}  (${selector})`);
    await page.close();
    continue;
  }

  await page.evaluate(
    (s) => document.querySelector(s)?.scrollIntoView({ block: "center" }),
    selector,
  );
  await new Promise((r) => setTimeout(r, wait));

  if (hoverSelector) {
    const target = await page.$(hoverSelector);
    if (target) {
      await target.hover();
      await new Promise((r) => setTimeout(r, 1400));
    }
  }

  await el.screenshot({ path: `${outDir}/${name}.png` });
  console.log(`ok       ${name}`);
  await page.close();
}

await browser.close();
