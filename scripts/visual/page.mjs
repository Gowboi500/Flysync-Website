/**
 * Whole-page screenshots, for looking at a route end to end.
 *
 *   node scripts/visual/page.mjs http://localhost:3000/ ./shots
 *   node scripts/visual/page.mjs http://localhost:3000/products ./shots 1440 6
 *
 * `fullPage: true` does not work on this site. Sections carry
 * `content-visibility: auto`, and Chrome's fullPage stitcher does not render
 * the subtrees it has skipped — the capture comes back with a blank band
 * where the middle of the page should be and a second copy of the hero
 * pasted at the bottom. That is why shots.mjs captures elements instead.
 *
 * The way around it is to make the viewport as tall as the document, so every
 * section is genuinely in view and a plain viewport screenshot is correct.
 * The catch is that the height you measure BEFORE doing that is wrong: with
 * the sections still collapsed the home page reports 11170px, and once they
 * render it is 9546px. Measure once to size the viewport, wait for the
 * relayout, then measure again and clip to the real content bottom —
 * otherwise every shot carries ~1.6k px of blank tail.
 *
 * The optional band count splits the result into equal horizontal slices.
 * A 9.5k px page is one unreadable strip when scaled to fit; six slices are
 * legible, and they come from one capture so they cannot disagree.
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const url = process.argv[2] || "http://localhost:3000/";
const outDir = process.argv[3] || "./shots";
const width = Number(process.argv[4] || 1440);
const bands = Number(process.argv[5] || 0);
const scale = Number(process.env.SCALE || 2);
fs.mkdirSync(outDir, { recursive: true });

/** `/` -> `home`, `/products/b2b-portal` -> `products-b2b-portal`. */
const name =
  new URL(url).pathname.replace(/^\/|\/$/g, "").replace(/\//g, "-") || "home";

/* Same CHROME_WS escape hatch as gates.mjs: Chrome 151 does not start under
   the `--headless=new` flag puppeteer 25 passes, so launch() hangs until its
   timeout. Attach to a browser started with the plain flag instead:

     chrome --headless --disable-gpu --remote-debugging-port=9333 about:blank
     CHROME_WS=$(curl -s 127.0.0.1:9333/json/version | jq -r .webSocketDebuggerUrl) \
       node scripts/visual/page.mjs http://localhost:3000/ ./shots

   An attached browser is DISCONNECTED rather than closed — it is not ours
   to kill. */
const browser = process.env.CHROME_WS
  ? await puppeteer.connect({ browserWSEndpoint: process.env.CHROME_WS })
  : await puppeteer.launch({
      executablePath: CHROME,
      headless: "new",
      args: ["--no-sandbox"],
    });

const page = await browser.newPage();
const problems = [];
page.on("console", (m) => m.type() === "error" && problems.push(m.text()));
page.on("pageerror", (e) => problems.push(String(e)));

await page.setViewport({ width, height: 900, deviceScaleFactor: scale });
await page.goto(url, { waitUntil: "networkidle0" });

/* Sized from the collapsed height, which overshoots — that is fine and in
   fact wanted here. The viewport only has to be AT LEAST as tall as the
   rendered page for everything to count as in view. */
const collapsed = await page.evaluate(() => document.body.scrollHeight);
await page.setViewport({ width, height: collapsed, deviceScaleFactor: scale });
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 4000)); // reveals + the hero mock settle

const rendered = await page.evaluate(() => document.body.scrollHeight);
if (rendered > collapsed) {
  // Never seen, but a page that GREW past the viewport would be cropped
  // rather than padded, and a silently cropped shot is worse than a loud one.
  console.log(`WARN     page grew ${collapsed} -> ${rendered}, capture is short`);
}
const height = Math.min(rendered, collapsed);

await page.screenshot({
  path: `${outDir}/${name}-full.png`,
  clip: { x: 0, y: 0, width, height },
});
console.log(`ok       ${name}-full.png  ${width}x${height} css px @${scale}x`);

const band = Math.ceil(height / bands);
for (let i = 0; i < bands; i++) {
  const y = i * band;
  await page.screenshot({
    path: `${outDir}/${name}-band-${i + 1}.png`,
    clip: { x: 0, y, width, height: Math.min(band, height - y) },
  });
  console.log(`ok       ${name}-band-${i + 1}.png  y=${y}`);
}

if (problems.length) console.log(`\nCONSOLE\n${problems.join("\n")}`);

if (process.env.CHROME_WS) await browser.disconnect();
else await browser.close();
