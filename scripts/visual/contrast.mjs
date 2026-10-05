/**
 * Page-wide text contrast against the PAINTED backdrop.
 *
 *   CHROME_WS=ws://... node scripts/visual/contrast.mjs http://localhost:3000/ 1440
 *
 * Every section tint, glow and gradient panel on this site is a stack of
 * translucent layers, so the only honest way to check a text run is to look
 * at the pixels behind it. This walks every visible text run in the page,
 * screenshots the section twice — once normally, once with that section's
 * text hidden — and measures the run's colour against the darkest backdrop
 * pixel under its own box.
 *
 * WCAG floor: 4.5:1, or 3:1 for large text (>=24px, or >=18.66px bold).
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import puppeteer from "puppeteer-core";
import { readPNG, lum, contrast } from "./png.mjs";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = process.argv[2] || "http://localhost:3000/";
const width = Number(process.argv[3] || 1440);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "contrast-"));

const browser = process.env.CHROME_WS
  ? await puppeteer.connect({ browserWSEndpoint: process.env.CHROME_WS })
  : await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });

const page = await browser.newPage();
await page.setViewport({ width, height: 900 });
await page.goto(url, { waitUntil: "load", timeout: 90_000 });
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 110));
  }
  window.scrollTo(0, 0);
});
/* Freeze the entrance animations. Every reveal starts at opacity 0 and
   animates in; a backdrop frame taken while a stats band or a button is at
   40% opacity samples a half-painted pixel and reports white-on-gradient as
   white-on-near-white. This is the single biggest source of false failures
   in a check like this. */
await page.addStyleTag({
  content: `.reveal, .reveal-item, .rise, .rise-shot, .shot-reveal, [data-replay] {
    opacity: 1 !important; transform: none !important;
    animation: none !important; transition: none !important;
  }`,
});
/* Hide the floating overlays — the mobile sticky CTA bar, the WhatsApp
   bubble, the back-to-top ring, the scroll progress line. They are fixed to
   the viewport, so in any screenshot they sit ON TOP of whatever section is
   being measured and a run behind the bar samples the bar's own purple
   button as its backdrop. They are solid controls checked on their own
   terms; the header is left alone because its links are page text.

   This is why every failure at 375 was a paragraph "on rgb(125,93,247)". */
await page.evaluate(() => {
  for (const el of document.querySelectorAll("body *")) {
    if (getComputedStyle(el).position === "fixed" && !el.closest("header")) {
      el.style.visibility = "hidden";
    }
  }
});
await new Promise((r) => setTimeout(r, 800));

const sectionIds = await page.evaluate(() =>
  [...document.querySelectorAll("main > section, footer")].map((el, i) => {
    el.dataset.cIndex = String(i);
    return i;
  }),
);

const failures = [];
let checked = 0;

for (const i of sectionIds) {
  const sel = `[data-c-index="${i}"]`;
  await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: "center" }), sel);
  await new Promise((r) => setTimeout(r, 700));

  const runs = await page.evaluate((s) => {
    const root = document.querySelector(s);
    const out = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const text = n.nodeValue.trim();
      if (!text) continue;
      const el = n.parentElement;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity < 0.15) continue;
      /* The simulated product screenshots are decorative renderings of an
         app UI, drawn at design size and scaled to ~0.35 by FitScreen. Their
         micro-labels are not page copy and their CSS font-size is not the
         size anyone reads them at, so an AA judgement on them is meaningless
         either way. Excluded deliberately, not accidentally. */
      if (el.closest(".screen-ui, .fit-inner")) continue;
      /* Gradient-clipped text (.grad-text) paints the gradient THROUGH the
         glyphs, so its computed colour is transparent and there is nothing
         to measure a ratio against. It is display-size decoration and is
         checked by eye, not here. */
      if (cs.webkitBackgroundClip === "text" || cs.backgroundClip === "text") continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height || r.bottom < 0 || r.top > window.innerHeight) continue;
      /* A run scrolled under the fixed header is not visible there — what is
         painted at those coordinates is the header, and at 375 that includes
         its purple CTA. Measuring the run against it reports a body
         paragraph as 1.05:1 on rgb(80,94,161), which is the button. */
      const hr = document.querySelector("header")?.getBoundingClientRect();
      if (hr && r.top < hr.bottom + 4) continue;
      const size = parseFloat(cs.fontSize);
      const weight = Number(cs.fontWeight) || 400;
      out.push({
        text: text.slice(0, 42),
        fg: cs.color.match(/[\d.]+/g).slice(0, 3).map(Number),
        alpha: cs.color.startsWith("rgba") ? parseFloat(cs.color.split(",")[3]) : 1,
        large: size >= 24 || (size >= 18.66 && weight >= 700),
        x: Math.round(r.x), y: Math.round(r.y),
        w: Math.round(r.width), h: Math.round(r.height),
        sectionId: root.id || root.tagName.toLowerCase(),
      });
    }
    return out;
  }, sel);

  if (!runs.length) continue;

  // Backdrop frame: this section's text hidden, everything else untouched.
  await page.evaluate((s) => {
    const st = document.createElement("style");
    st.id = "contrast-hide";
    st.textContent = `${s}, ${s} * { color: transparent !important; -webkit-text-fill-color: transparent !important; }`;
    document.head.appendChild(st);
  }, sel);
  await new Promise((r) => setTimeout(r, 220));
  const shot = `${tmp}/s${i}.png`;
  await page.screenshot({ path: shot });
  await page.evaluate(() => document.getElementById("contrast-hide")?.remove());

  const img = readPNG(fs.readFileSync(shot));
  const at = (x, y) => {
    const xi = Math.min(Math.max(Math.round(x), 0), img.w - 1);
    const yi = Math.min(Math.max(Math.round(y), 0), img.h - 1);
    const k = (yi * img.w + xi) * img.ch;
    return [img.px[k], img.px[k + 1], img.px[k + 2]];
  };

  for (const run of runs) {
    // Darkest backdrop pixel under the run's own box — the one the ratio
    // has to survive.
    /* Sampled over the middle band of the box, never its corners. A pill or
       a rounded button is not painted in the corners of its own border box,
       so a corner sample returns whatever is behind the control — which is
       how every chip label in the hero first reported as failing against the
       wash it floats over rather than against its own white glass. */
    let worst = null;
    const y0 = run.y + run.h * 0.3, y1 = run.y + run.h * 0.7;
    const x0 = run.x + run.w * 0.12, x1 = run.x + run.w * 0.88;
    for (let y = y0; y <= y1; y += Math.max(1, (y1 - y0) / 4))
      for (let x = x0; x <= x1; x += Math.max(2, (x1 - x0) / 14)) {
        const c = at(x, y);
        if (!worst || lum(c) < lum(worst)) worst = c;
      }
    if (!worst) continue;
    // Text drawn at partial alpha composites onto that backdrop.
    const fg = run.alpha < 1
      ? run.fg.map((v, k) => v * run.alpha + worst[k] * (1 - run.alpha))
      : run.fg;
    const ratio = contrast(fg, worst);
    const floor = run.large ? 3 : 4.5;
    checked++;
    if (ratio < floor)
      failures.push({
        section: run.sectionId,
        text: run.text,
        ratio: +ratio.toFixed(2),
        floor,
        fg: `rgb(${run.fg.map(Math.round).join(",")})`,
        bg: `rgb(${worst.join(",")})`,
      });
  }
}

console.log(`\n${url} @ ${width}px — ${checked} text runs measured against painted pixels`);
if (!failures.length) console.log("PASS  every run clears its WCAG floor\n");
else {
  console.log(`FAIL  ${failures.length} run(s) under floor\n`);
  for (const f of failures)
    console.log(`  ${String(f.ratio).padStart(5)}:1 (needs ${f.floor})  [${f.section}] "${f.text}"  ${f.fg} on ${f.bg}`);
}

fs.rmSync(tmp, { recursive: true, force: true });
if (process.env.CHROME_WS) await browser.disconnect();
else await browser.close();
process.exit(failures.length ? 1 : 0);
