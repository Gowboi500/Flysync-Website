/**
 * Hero refinement audit — every item on the acceptance checklist that can be
 * measured rather than eyeballed.
 *
 *   node audit.mjs http://localhost:3000/ <outDir>
 *
 * Checks, per width:
 *   overflow      document.body.scrollWidth vs innerWidth
 *   collisions    logo/badge, nav/dashboard, nav/chips, chips/dashboard data
 *   clipping      any chip past the viewport edge
 *   balance       purple / white / pink pixel share across the hero
 *   contrast      body paragraph + secondary button label vs PAINTED backdrop
 *   blur          any element with filter: blur() over 100px
 *   decorative    pointer-events + aria-hidden on light/ray/grid layers
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import { readPNG, lum, contrast } from "./png.mjs";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = process.argv[2] || "http://localhost:3000/";
const outDir = process.argv[3] || "./audit";
const label = process.argv[4] || "shot";
fs.mkdirSync(outDir, { recursive: true });

const WIDTHS = [
  [1440, 900],
  [1024, 800],
  [768, 900],
  [375, 812],
];

/* Chrome 151 no longer starts under `--headless=new`, which is the flag
   puppeteer-core 25 passes: the process comes up and never prints a WS
   endpoint, so launch() times out at 30s. Start the browser yourself with the
   plain flag and hand this script the endpoint:

     chrome --headless --disable-gpu --remote-debugging-port=9333 about:blank
     CHROME_WS=$(curl -s 127.0.0.1:9333/json/version | jq -r .webSocketDebuggerUrl) \
       node scripts/visual/hero-audit.mjs http://localhost:3000/ ./audit before

   launch() is still the path when the local Chrome supports it. */
const browser = process.env.CHROME_WS
  ? await puppeteer.connect({ browserWSEndpoint: process.env.CHROME_WS })
  : await puppeteer.launch({
      executablePath: CHROME,
      headless: true,
      userDataDir: `${outDir}/.chrome-profile`,
      args: ["--no-sandbox", "--force-color-profile=srgb"],
    });

const report = {};

for (const [w, h] of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  // NOT networkidle0: `next dev` holds an HMR websocket open for the life of
  // the page, so the idle condition never fires and every goto times out.
  await page.goto(url, { waitUntil: "load", timeout: 90_000 });
  // Entrance animations are CSS; let them settle so nothing is mid-transform.
  await new Promise((r) => setTimeout(r, 2000));

  const data = await page.evaluate(() => {
    const rect = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height, r: r.right, b: r.bottom };
    };
    const overlap = (a, b) => {
      if (!a || !b) return null;
      const ox = Math.min(a.r, b.r) - Math.max(a.x, b.x);
      const oy = Math.min(a.b, b.b) - Math.max(a.y, b.y);
      return ox > 0 && oy > 0 ? { x: Math.round(ox), y: Math.round(oy) } : null;
    };

    const nav = rect("header nav");
    const logo = rect('header a[aria-label*="home"]');
    const badge = rect("#top .glass-chip");
    const panel = rect("#top .glass-panel");
    const para = rect("#top p");
    const secondary = document.querySelector("#top .btn-secondary");

    // Chips: every floating capability pill in the hero composition.
    const chips = [...document.querySelectorAll("#top .lux-float")].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        label: el.textContent.trim(),
        x: r.x,
        y: r.y,
        r: r.right,
        b: r.bottom,
        w: r.width,
        h: r.height,
      };
    });

    /* Dashboard "data" = the KPI numbers and booking rows inside the panel,
       CLIPPED to the panel's own box. The bookings feed runs past the panel
       bottom and is hidden by overflow + the .pnr-clip mask, but
       getBoundingClientRect reports the unclipped geometry — without this
       intersection a chip sitting cleanly BELOW the panel scores as
       covering rows nobody can see. */
    const dataCells = [...document.querySelectorAll("#top .glass-panel .tnum, #top .glass-panel .lv-row")]
      .map((el) => {
        const r = el.getBoundingClientRect();
        if (!panel) return null;
        const box = {
          x: Math.max(r.x, panel.x),
          y: Math.max(r.y, panel.y),
          r: Math.min(r.right, panel.r),
          b: Math.min(r.bottom, panel.b),
        };
        return box.r > box.x && box.b > box.y ? box : null;
      })
      .filter(Boolean);

    const chipOverData = chips
      .map((c) => {
        const hits = dataCells.filter(
          (d) => Math.min(c.r, d.r) - Math.max(c.x, d.x) > 2 && Math.min(c.b, d.b) - Math.max(c.y, d.y) > 2,
        ).length;
        return hits ? { chip: c.label, cells: hits } : null;
      })
      .filter(Boolean);

    const clipped = chips
      .filter((c) => c.x < 0 || c.r > window.innerWidth)
      .map((c) => ({ chip: c.label, x: Math.round(c.x), r: Math.round(c.r) }));

    // Decorative layers must be inert.
    const decorative = [...document.querySelectorAll(
      ".hero-wash, .ambient-wash, .texture-grid, .texture-noise, .hero-rays, .hero-rays-left",
    )].map((el) => ({
      cls: el.className,
      aria: el.getAttribute("aria-hidden"),
      pe: getComputedStyle(el).pointerEvents,
    }));
    const inertBad = decorative.filter((d) => d.aria !== "true" || d.pe !== "none");

    // Any blur filter over 100px, anywhere.
    const bigBlur = [...document.querySelectorAll("*")]
      .map((el) => {
        const s = getComputedStyle(el);
        const m = /blur\(([\d.]+)px\)/.exec(s.filter + " " + s.backdropFilter);
        return m && Number(m[1]) > 100
          ? { tag: el.tagName + "." + String(el.className).slice(0, 40), px: Number(m[1]) }
          : null;
      })
      .filter(Boolean);

    /* Text runs whose contrast is measured against the painted backdrop.
       Foreground is the computed colour, so the check follows the token
       rather than assuming one. */
    const rgb = (s) => s.match(/\d+/g).slice(0, 3).map(Number);
    const probes = [
      ["hero paragraph", "#top p"],
      ["secondary CTA label", "#top .btn-secondary"],
      ["benefit list item", "#top ul li"],
      ["nav link", "header .nav-link"],
    ]
      .map(([label, sel]) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        if (!r.width) return null;
        /* Candidate backdrop points around the run, filtered by what is
           actually on top at each one. Without this the row 5px above the
           benefit list lands on the primary CTA and the check reports
           white-on-purple-button as a contrast failure of the list. */
        const pts = [];
        for (const y of [r.y - 5, r.bottom + 5])
          for (const f of [0.02, 0.25, 0.5, 0.75, 0.98]) {
            const x = r.x + r.width * f;
            const top = document.elementFromPoint(x, y);
            if (!top) continue;
            if (top.closest("a, button, .glass-panel, .glass-chip, .btn, svg, nextjs-portal")) continue;
            if (top.tagName?.toLowerCase().startsWith("nextjs")) continue;
            pts.push([Math.round(x), Math.round(y)]);
          }
        return { label, fg: rgb(getComputedStyle(el).color), pts, x: r.x, y: r.y, w: r.width, h: r.height, r: r.right, b: r.bottom };
      })
      .filter(Boolean);

    const heroEl = document.querySelector("#top");
    const heroR = heroEl?.getBoundingClientRect();

    // The three runs the brief says pink must never sit behind.
    const textBoxes = ["#top h1", "#top p", "#top [data-hero-cta]"]
      .map((s) => document.querySelector(s))
      .filter(Boolean)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, r: r.right, b: r.bottom };
      });

    return {
      textBoxes,
      heroBox: heroR ? { x: heroR.x, y: Math.max(0, heroR.y), r: heroR.right, b: Math.min(heroR.bottom, window.innerHeight) } : null,
      probes,
      overflowPx: document.body.scrollWidth - window.innerWidth,
      docOverflowPx: document.documentElement.scrollWidth - window.innerWidth,
      nav,
      logo,
      badge,
      panel,
      para,
      logoBadge: overlap(logo, badge),
      navPanel: overlap(nav, panel),
      navChips: chips.map((c) => ({ chip: c.label, hit: overlap(nav, c) })).filter((x) => x.hit),
      panelAboveNav: panel && nav ? Math.round(panel.y - nav.b) : null,
      chips: chips.length,
      chipOverData,
      clipped,
      inertBad,
      bigBlur,
      secondaryRect: secondary ? (() => { const r = secondary.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })() : null,
      // Touch-target floor is a touch concern: only checked at the widths
      // that get a touch layout. Desktop nav links are 36px pointer targets,
      // which clears WCAG 2.2's 24px minimum.
      tapTargets: window.innerWidth > 768 ? [] : [...document.querySelectorAll("header button, header a")]
        .map((el) => { const r = el.getBoundingClientRect(); return r.width && r.height < 44 ? { t: el.getAttribute("aria-label") || el.textContent.trim().slice(0, 20), w: Math.round(r.width), h: Math.round(r.height) } : null; })
        .filter(Boolean),
    };
  });

  // ---- Pixel work: hero balance + real contrast over the painted wash ----
  const shot = `${outDir}/${label}-${w}.png`;
  await page.screenshot({ path: shot });

  const img = readPNG(fs.readFileSync(shot));
  const clamp = (v, hi) => Math.min(Math.max(Math.round(v), 0), hi);

  const at = (x, y) => {
    const i = (Math.round(y) * img.w + Math.round(x)) * img.ch;
    return [img.px[i], img.px[i + 1], img.px[i + 2]];
  };

  /* Balance. Every pixel of the hero that is NOT part of the dashboard
     panel (which is its own opaque object and would otherwise count as
     "white") is classified by which channel the light pulled it toward:
       purple  blue leads and red is not leading
       pink    red leads clearly over green
       white   the two are within a couple of levels of each other

     The threshold is 6 levels, not 1: over white, a light needs roughly
     3.5% alpha to move a channel that far, and below that nobody calls
     the pixel coloured. A threshold of 1-2 counts the faintest edge of
     every ramp and reports a page as ~100% coloured, which is true and
     useless. Counted on a 4px lattice — 60k+ samples at 1440. */
    const T = 6;
  const hero = data.heroBox;
  const panel = data.panel;
  let purple = 0, pink = 0, white = 0, other = 0;
  if (hero) {
    const y1 = Math.min(hero.b, img.h - 1);
    for (let y = Math.max(0, hero.y); y < y1; y += 4) {
      for (let x = 0; x < Math.min(img.w, hero.r); x += 4) {
        if (panel && x >= panel.x - 12 && x <= panel.r + 12 && y >= panel.y - 12 && y <= panel.b + 12)
          continue;
        const [r, g, b] = at(x, y);
        if (r < 210 || g < 210) { other++; continue; } // text, chips, buttons
        const dB = b - g;   // blue over green  -> violet
        const dR = r - g;   // red  over green  -> pink
        if (dB >= T && dB > dR) purple++;
        else if (dR >= T && dR > dB) pink++;
        else white++;
      }
    }
  }
  const tot = purple + pink + white || 1;
  data.balance = {
    purplePct: +((purple / tot) * 100).toFixed(1),
    whitePct: +((white / tot) * 100).toFixed(1),
    pinkPct: +((pink / tot) * 100).toFixed(1),
    sampled: tot,
  };

  /* "No pink behind the headline, paragraph or left CTAs" — measured on a
     second frame with the hero copy hidden, so what gets classified is the
     PAINT behind those boxes. Classifying the normal frame instead scores
     the flourish word's own pink gradient as light spilling onto the copy. */
  await page.addStyleTag({
    id: "audit-hide-copy",
    content: "#top h1, #top p, #top ul, #top .btn, #top .glass-chip { visibility: hidden !important }",
  });
  const bareShot = `${outDir}/${label}-${w}-backdrop.png`;
  await page.screenshot({ path: bareShot });
  const bare = readPNG(fs.readFileSync(bareShot));
  const atBare = (x, y) => {
    const i = (Math.round(y) * bare.w + Math.round(x)) * bare.ch;
    return [bare.px[i], bare.px[i + 1], bare.px[i + 2]];
  };

  /* "No pink behind the headline, paragraph or left CTAs" — checked over
     the union of those three boxes rather than over a guessed left half.
     A pixel counts as pink here at a lower threshold than the balance
     classifier uses (2 instead of 3), so the check is stricter than the
     one the balance number passes. */
  let leftPink = 0, leftSampled = 0, worstPink = 0;
  for (const b of data.textBoxes || []) {
    for (let y = clamp(b.y, img.h - 1); y < clamp(b.b, img.h - 1); y += 3) {
      for (let x = clamp(b.x, img.w - 1); x < clamp(b.r, img.w - 1); x += 3) {
        const [r, g, bl] = atBare(x, y);
        leftSampled++;
        const dR = r - g, dB = bl - g;
        if (dR >= 2 && dR > dB) { leftPink++; worstPink = Math.max(worstPink, dR); }
      }
    }
  }
  data.leftPink = { pixels: leftPink, sampled: leftSampled, worstDelta: worstPink };

  /* Contrast against the PAINTED backdrop, not against an assumed white.
     Sampled just outside each text run's glyphs, on the same row. */
  const probe = (box) => {
    /* Sampled just OUTSIDE the run rather than between glyphs: the lights
       are smooth over that distance, and this can never accidentally
       measure a letter and call it background. Worst (darkest) sample
       wins, since that is the one the ratio has to survive. */
    if (!box || !box.pts.length) return null;
    const samples = box.pts.map(([x, y]) => at(clamp(x, img.w - 1), clamp(y, img.h - 1)));
    const worst = samples.reduce((a, c) => (lum(c) < lum(a) ? c : a));
    return { label: box.label, bg: `rgb(${worst.join(",")})`, ratio: +contrast(box.fg, worst).toFixed(2) };
  };
  data.contrast = (data.probes || []).map(probe).filter(Boolean);

  /* ---- Layout shift, and what reduced motion actually does ----------
     CLS is measured on THIS page after a scroll through the hero, with
     the entrance animations and the marquee both running. The mock
     reserves its box with aspect-ratio, so a non-zero number here means
     something else moved. */
  await page.evaluate(() => {
    window.__cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  for (let y = 0; y < 1600; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 250));
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  data.cls = +(await page.evaluate(() => window.__cls)).toFixed(4);

  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await new Promise((r) => setTimeout(r, 400));
  data.reducedMotion = await page.evaluate(() => {
    const anim = (sel) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el).animationName : "absent";
    };
    return {
      marquee: anim(".marquee-track"),
      chipFloat: anim("#top .lux-float"),
      // The hero must still be VISIBLE, not merely still.
      heroVisible: getComputedStyle(document.querySelector("#top h1")).opacity,
    };
  });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);

  report[w] = data;
  await page.close();
}

if (process.env.CHROME_WS) await browser.disconnect();
else await browser.close();
fs.writeFileSync(`${outDir}/${label}.json`, JSON.stringify(report, null, 2));

for (const [w, d] of Object.entries(report)) {
  console.log(`\n=== ${w}px ===`);
  console.log(`  overflow          body ${d.overflowPx}px / doc ${d.docOverflowPx}px`);
  console.log(`  logo↔badge        ${d.logoBadge ? "OVERLAP " + JSON.stringify(d.logoBadge) : "clear"}`);
  console.log(`  nav↔panel         ${d.navPanel ? "OVERLAP " + JSON.stringify(d.navPanel) : "clear"} (gap ${d.panelAboveNav}px)`);
  console.log(`  nav↔chips         ${d.navChips.length ? JSON.stringify(d.navChips) : "clear"}`);
  console.log(`  chips             ${d.chips} rendered`);
  console.log(`  chips over data   ${d.chipOverData.length ? JSON.stringify(d.chipOverData) : "clear"}`);
  console.log(`  chips clipped     ${d.clipped.length ? JSON.stringify(d.clipped) : "clear"}`);
  console.log(`  blur > 100px      ${d.bigBlur.length ? JSON.stringify(d.bigBlur) : "none"}`);
  console.log(`  decorative inert  ${d.inertBad.length ? "BAD " + JSON.stringify(d.inertBad) : "ok"}`);
  console.log(`  tap < 44px        ${d.tapTargets.length ? JSON.stringify(d.tapTargets) : "ok"}`);
  console.log(`  pink over copy    ${d.leftPink.pixels} px of ${d.leftPink.sampled} (worst r-g delta ${d.leftPink.worstDelta})`);
  console.log(`  CLS               ${d.cls}${d.cls > 0.1 ? "  FAIL" : ""}`);
  console.log(`  reduced motion    marquee ${d.reducedMotion.marquee} / chips ${d.reducedMotion.chipFloat} / h1 opacity ${d.reducedMotion.heroVisible}`);
  console.log(`  hero balance      purple ${d.balance.purplePct}% / white ${d.balance.whitePct}% / pink ${d.balance.pinkPct}%  (${d.balance.sampled} px)`);
  for (const c of d.contrast)
    console.log(`  contrast          ${c.ratio < 4.5 ? "FAIL" : "ok  "} ${c.ratio}:1  ${c.label} on ${c.bg}`);
}
