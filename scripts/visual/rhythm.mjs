/**
 * Vertical rhythm audit — where the page is empty and by how much.
 *
 *   CHROME_WS=ws://... node scripts/visual/rhythm.mjs http://localhost:3000/ 1440
 *
 * For every section it reports the section's own top and bottom padding, and
 * the largest EMPTY BAND inside it: a run of vertical pixels crossed by no
 * text, image or drawn box. It also reports the dead space BETWEEN adjacent
 * sections, which is the pair of paddings that meet plus whatever margin the
 * content leaves — the number the "no two sections may combine to more than
 * ~200px" rule is actually about.
 *
 * Content is measured from TEXT RANGES, not element boxes. An element box
 * says a 700px-tall section is "full" when it holds one line of text at the
 * top; a range says where the ink is.
 *
 * Sections carry content-visibility: auto, so each one is scrolled into view
 * before it is measured — otherwise its subtree is never laid out and it
 * reports as one big hole.
 */
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = process.argv[2] || "http://localhost:3000/";
const width = Number(process.argv[3] || 1440);
const height = Number(process.argv[4] || 900);
const BAND_LIMIT = 120; // the brief's "no empty band taller than ~120px"

const browser = process.env.CHROME_WS
  ? await puppeteer.connect({ browserWSEndpoint: process.env.CHROME_WS })
  : await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });

const page = await browser.newPage();
await page.setViewport({ width, height });
await page.goto(url, { waitUntil: "load", timeout: 90_000 });
await new Promise((r) => setTimeout(r, 1200));

// Walk the page once so every content-visibility subtree has been rendered
// and every reveal has fired.
await page.evaluate(async () => {
  const step = Math.round(window.innerHeight * 0.6);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 400));
});

const report = await page.evaluate(async (BAND_LIMIT) => {
  const docTop = (r) => r.top + window.scrollY;

  /* Every painted thing, as a document-space vertical interval. */
  let intervals = [];
  let merged = [];
  const push = (top, bottom) => {
    if (bottom - top > 0.5) intervals.push([top, bottom]);
  };

  function rescan() {
    intervals = [];
    collect();
    intervals.sort((a, b) => a[0] - b[0]);
    merged = [];
    for (const iv of intervals) {
      const last = merged[merged.length - 1];
      if (last && iv[0] <= last[1] + 1) last[1] = Math.max(last[1], iv[1]);
      else merged.push([...iv]);
    }
  }

  function collect() {

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.nodeValue.trim()) continue;
    const p = n.parentElement;
    if (!p || p.closest("script, style, head")) continue;
    /* Deliberately NOT skipping opacity 0: reveal-on-scroll starts every
       block transparent, and a block mid-reveal still occupies its box.
       Skipping it reports a laid-out section as one 800px hole. */
    const cs = getComputedStyle(p);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) if (r.height) push(docTop(r), docTop(r) + r.height);
  }

  // Non-text ink: media and drawn shapes.
  for (const el of document.querySelectorAll("img, svg, canvas, video, hr, input, textarea")) {
    const r = el.getBoundingClientRect();
    if (r.height && r.width) push(docTop(r), docTop(r) + r.height);
  }

  /* Anything with its OWN visible box counts as ink for its full height:
     a card's internal padding is space inside a drawn object, not dead
     page. Without this, a bordered panel with 56px of padding reports as
     a 56px hole at each end and a section that is visually full reads as
     half empty.

     Excluded: sections themselves and decorative layers, both of which
     span their whole container and would mark everything as ink. Also
     anything taller than 80% of the viewport, which is the same problem
     one level down. */
  for (const el of document.querySelectorAll("main div, main article, main li, main a, main ul, footer div")) {
    if (el.closest('[aria-hidden="true"]')) continue;
    const cs = getComputedStyle(el);
    const bg = cs.backgroundColor;
    const alpha = bg.startsWith("rgba") ? parseFloat(bg.split(",")[3]) : bg === "transparent" ? 0 : 1;
    const bordered = ["borderTopWidth", "borderBottomWidth", "borderLeftWidth", "borderRightWidth"].some(
      (p) => parseFloat(cs[p]) > 0,
    );
    if (alpha < 0.03 && cs.backgroundImage === "none" && !bordered) continue;
    const r = el.getBoundingClientRect();
    if (!r.height || !r.width || r.height > window.innerHeight * 0.8) continue;
    push(docTop(r), docTop(r) + r.height);
  }

  }
  rescan();

  const holesIn = (top, bottom) => {
    const out = [];
    let cursor = top;
    for (const [a, b] of merged) {
      if (b <= top) continue;
      if (a >= bottom) break;
      if (a > cursor) out.push([cursor, Math.min(a, bottom)]);
      cursor = Math.max(cursor, b);
    }
    if (cursor < bottom) out.push([cursor, bottom]);
    return out.map(([a, b]) => ({ top: Math.round(a), height: Math.round(b - a) }));
  };

  /* Each section is measured WHILE IT IS ON SCREEN. Sections carry
     content-visibility: auto with contain-intrinsic-size: auto 900px, so an
     off-screen one collapses back to a 900px placeholder with no laid-out
     children — it reports as a 900px-tall section containing one 862px hole,
     which is a measurement artefact and not a gap anyone can see. */
  const sectionEls = [...document.querySelectorAll("main > section, main > div > section, footer")];
  const sections = [];
  for (const el of sectionEls) {
    el.scrollIntoView({ block: "center" });
    await new Promise((r) => setTimeout(r, 220));
    rescan();
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const top = docTop(r);
    const bottom = top + r.height;
    /* Bands are measured between the section's FIRST and LAST ink, not
       across its whole box. A section's own top padding is boundary space
       shared with the section above it, and the seam report below is what
       governs that; counting it here reports every correctly-padded section
       as having a 160px hole in it. */
    const spans = merged.filter((m) => m[1] > top && m[0] < bottom);
    const inkTop = spans.length ? Math.max(top, spans[0][0]) : top;
    const inkBottom = spans.length ? Math.min(bottom, spans[spans.length - 1][1]) : bottom;
    const inner = holesIn(inkTop, inkBottom).filter((h) => h.height > BAND_LIMIT);
    sections.push({
      id: el.id || el.tagName.toLowerCase(),
      top: Math.round(top),
      height: Math.round(r.height),
      padTop: Math.round(parseFloat(cs.paddingTop)),
      padBottom: Math.round(parseFloat(cs.paddingBottom)),
      bg: cs.backgroundColor,
      holes: inner,
      worstHole: inner.reduce((m, h) => Math.max(m, h.height), 0),
    });
  }

  // Dead space where two sections meet: the hole that straddles the boundary.
  const seams = [];
  for (let i = 0; i < sections.length - 1; i++) {
    const edge = sections[i].top + sections[i].height;
    const hole = holesIn(edge - 400, edge + 400).find((h) => h.top <= edge && h.top + h.height >= edge);
    seams.push({ between: `${sections[i].id} → ${sections[i + 1].id}`, gap: hole ? hole.height : 0 });
  }

  return { sections, seams, pageHeight: Math.round(document.body.scrollHeight) };
}, BAND_LIMIT);

console.log(`\n${url} @ ${width}px — page ${report.pageHeight}px\n`);
console.log("SECTION            height   padT  padB   worst empty band");
for (const s of report.sections) {
  const flag = s.worstHole > BAND_LIMIT ? "  <<<" : "";
  console.log(
    `  ${s.id.padEnd(16)} ${String(s.height).padStart(5)}  ${String(s.padTop).padStart(5)} ${String(s.padBottom).padStart(5)}   ${String(s.worstHole).padStart(4)}px${flag}`,
  );
  for (const h of s.holes) console.log(`      band ${String(h.height).padStart(4)}px at y=${h.top}`);
}
console.log("\nSEAMS (dead space where two sections meet)");
for (const s of report.seams)
  console.log(`  ${s.between.padEnd(34)} ${String(s.gap).padStart(4)}px${s.gap > 200 ? "  <<<" : ""}`);

if (process.env.CHROME_WS) await browser.disconnect();
else await browser.close();
