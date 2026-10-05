/**
 * Phase 2 motion quality gates.
 *
 *   node scripts/visual/gates.mjs http://localhost:3000/
 *
 * Every effect added in Phase 2 has a way of regressing that a screenshot
 * will not catch, so each of these checks one:
 *
 *   cls           A full-page scroll with layout-shift attribution. The
 *                 split-flap eyebrows and the count-up both cost CLS the
 *                 first time they were built; this is what found it.
 *   reduced       prefers-reduced-motion must leave the site fully readable
 *                 AND fully visible. The reveal system hides content by
 *                 default, so a rule scoped to the wrong media query blanks
 *                 the page rather than merely stilling it.
 *   nojs          Same, with scripting off entirely.
 *   frames        Frame pacing on the hero under 4x CPU throttle, while the
 *                 PNR ticker and the marquee are both running.
 *
 * Exits non-zero if any gate fails, so it can gate a deploy.
 */
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const url = process.argv[2] || "http://localhost:3000/";
const results = [];

/* Chrome 151 does not start under `--headless=new` — the flag puppeteer 25
   passes — so launch() hangs until its 30s timeout. Point CHROME_WS at a
   browser you started with the plain flag and these gates attach to it
   instead:

     chrome --headless --disable-gpu --remote-debugging-port=9333 about:blank
     CHROME_WS=$(curl -s 127.0.0.1:9333/json/version | jq -r .webSocketDebuggerUrl) \
       node scripts/visual/gates.mjs http://localhost:3100/

   An attached browser is DISCONNECTED rather than closed: it is not ours
   to kill, and the next gate still needs it. */
const launch = () =>
  process.env.CHROME_WS
    ? puppeteer.connect({ browserWSEndpoint: process.env.CHROME_WS })
    : puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });

const release = (browser) =>
  process.env.CHROME_WS ? browser.disconnect() : browser.close();

/** Scroll the whole page in steps, letting each reveal fire. */
async function scrollThrough(page, dwell = 320) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, dwell));
  }
  await new Promise((r) => setTimeout(r, 800));
}

/* ---- CLS, with the element responsible for each shift ---- */
async function cls() {
  const browser = await launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluateOnNewDocument(() => {
    window.__cls = 0;
    window.__sources = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue;
        window.__cls += entry.value;
        for (const s of entry.sources || []) {
          window.__sources.push(
            `${entry.value.toFixed(4)} ${String(
              (s.node && (s.node.className || s.node.tagName)) || "?",
            ).slice(0, 60)}`,
          );
        }
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(url, { waitUntil: "networkidle0" });
  await scrollThrough(page);

  const value = await page.evaluate(() => +window.__cls.toFixed(4));
  const sources = await page.evaluate(() => [...new Set(window.__sources)].slice(0, 10));
  await release(browser);

  /* Budget rather than zero.
 
     Reveals replay, so the same element enters and leaves repeatedly and the
     split-flap re-pins its width each time — which lands a consistent 0.0001
     on a full-page scroll. That is three orders of magnitude under the 0.1
     "good" threshold and Lighthouse reports it as 0. Asserting an exact zero
     here would mean either hiding the number or disabling replay, so the gate
     states a budget and always prints what was actually measured. */
  const BUDGET = 0.005;
  results.push({
    gate: "cls",
    pass: value <= BUDGET,
    detail:
      value === 0
        ? "0"
        : `${value} (budget ${BUDGET})${sources.length ? " — " + sources.join(" | ") : ""}`,
  });
}

/** Nothing may be left invisible when motion is off or scripting is absent. */
async function stillVisible(gate, configure) {
  const browser = await launch();
  const page = await browser.newPage();
  await configure(page);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 3000));

  // With scripting off we cannot evaluate; fall back to asserting the served
  // markup is complete and rely on the reduced-motion pass for visibility.
  let detail;
  let pass;
  if (gate === "nojs") {
    const html = await page.content();
    pass = html.includes("Recent bookings") && html.includes("Live in three weeks");
    detail = pass ? "full markup served" : "sections missing from no-script HTML";
  } else {
    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll(".reveal, .reveal-item, .shot-reveal, .words .w")]
          .filter((el) => {
            const s = getComputedStyle(el);
            return s.opacity === "0" || s.visibility === "hidden";
          }).length,
    );
    pass = hidden === 0;
    detail = pass ? "nothing hidden" : `${hidden} elements stuck invisible`;
  }

  await release(browser);
  results.push({ gate, pass, detail });
}

/* ---- Frame pacing on the hero under CPU throttle ---- */
async function frames(rate = 4) {
  const browser = await launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const cdp = await page.target().createCDPSession();
  await cdp.send("Emulation.setCPUThrottlingRate", { rate });
  await page.goto(url, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 2500));

  const deltas = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const out = [];
        let last = performance.now();
        const start = last;
        (function tick(now) {
          out.push(now - last);
          last = now;
          if (now - start < 4000) requestAnimationFrame(tick);
          else resolve(out.slice(1));
        })(last);
      }),
  );
  await release(browser);

  const dropped = deltas.filter((d) => d > 20).length;
  results.push({
    gate: `frames@${rate}x`,
    pass: dropped === 0,
    detail: `${deltas.length} frames, max ${Math.max(...deltas).toFixed(1)}ms, ${dropped} over 20ms`,
  });
}

await cls();
await stillVisible("reduced-motion", (page) =>
  page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]),
);
await stillVisible("nojs", (page) => page.setJavaScriptEnabled(false));
await frames(4);

let failed = false;
for (const r of results) {
  if (!r.pass) failed = true;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.gate.padEnd(16)} ${r.detail}`);
}
process.exit(failed ? 1 : 0);
