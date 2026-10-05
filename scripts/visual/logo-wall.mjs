/**
 * Acceptance pass for the customer logo wall: screenshots at 1440 and 375
 * plus the checks a still cannot show.
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = "http://localhost:3000/";
const OUT = process.argv[2] || ".";
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});

const settle = (ms) => new Promise((r) => setTimeout(r, ms));

async function open({ width, height, reduce = false, dpr = 2 }) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: dpr });
  if (reduce) await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.evaluateOnNewDocument(() => {
    window.__cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(URL, { waitUntil: "networkidle0" });
  await page.evaluate(() =>
    document.querySelector("#trusted")?.scrollIntoView({ block: "center" }),
  );
  return page;
}

const report = {};

/* ---- 1440 ---- */
{
  const page = await open({ width: 1440, height: 900 });
  await settle(2600);
  const el = await page.$("#trusted");
  await el.screenshot({ path: `${OUT}/wall-1440.png` });

  report.desktop = await page.evaluate(() => {
    const cells = [...document.querySelectorAll(".logo-cell")];
    const first = cells[0].getBoundingClientRect();
    const imgs = [...document.querySelectorAll(".client-mark")];
    const broken = imgs.filter((i) => !i.complete || i.naturalWidth === 0);
    const dup = [...document.querySelectorAll(".logo-cell-dup .client-mark")];
    const cs = getComputedStyle(imgs[0]);
    const hosts = [...document.querySelectorAll("[data-marquee-gated]")];
    return {
      logoFiles: imgs.length / 2,
      cellSize: [Math.round(first.width), Math.round(first.height)],
      brokenImages: broken.map((i) => i.getAttribute("src")),
      duplicatesHidden: dup.every(
        (i) => i.getAttribute("aria-hidden") === "true" && i.alt === "",
      ),
      namedOnce: [...document.querySelectorAll(".client-mark")].filter(
        (i) => i.alt && i.getAttribute("aria-hidden") !== "true",
      ).length,
      restFilter: cs.filter,
      restOpacity: cs.opacity,
      bobbing: cs.animationName + " " + cs.animationDuration,
      gap: getComputedStyle(document.querySelector(".logo-track")).columnGap,
      bloom: (() => {
        const b = getComputedStyle(document.querySelector(".logo-cell"), "::before");
        return { bg: b.backgroundImage.slice(0, 30), opacity: b.opacity, events: b.pointerEvents, radius: b.borderRadius, border: b.borderStyle };
      })(),
      cellChrome: (() => {
        const c = getComputedStyle(document.querySelector(".logo-cell"));
        const p = getComputedStyle(document.querySelector(".logo-plate"));
        return { cellBg: c.backgroundImage, cellBorder: c.borderStyle, plateBg: p.backgroundImage, plateBorder: p.borderStyle, plateRadius: p.borderRadius };
      })(),
      beams: (() => {
        const el = document.querySelector(".logo-beams");
        const s = getComputedStyle(el);
        return { layers: (s.backgroundImage.match(/linear-gradient/g) || []).length, events: s.pointerEvents, aria: el.getAttribute("aria-hidden") };
      })(),
      rowsLive: hosts.map((h) => h.hasAttribute("data-live")),
      walIsIn: document.querySelector(".logo-wall").classList.contains("is-in"),
      trackPlay: [...document.querySelectorAll(".logo-track")].map(
        (t) => getComputedStyle(t).animationPlayState,
      ),
      trackDirection: [...document.querySelectorAll(".logo-track")].map(
        (t) => getComputedStyle(t).animationDirection,
      ),
      trackDuration: [...document.querySelectorAll(".logo-track")].map(
        (t) => getComputedStyle(t).animationDuration,
      ),
      willChange: [...document.querySelectorAll(".logo-track")].map(
        (t) => getComputedStyle(t).willChange,
      ),
      maskApplied: getComputedStyle(
        document.querySelector(".logo-host"),
      ).maskImage.slice(0, 22),
      hOverflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      cls: window.__cls,
      // A frozen track and a moving one look the same in a still.
      moved: (() => {
        const t = document.querySelector(".logo-track");
        return getComputedStyle(t).transform;
      })(),
    };
  });
  await settle(900);
  report.desktop.movedAfter = await page.evaluate(
    () => getComputedStyle(document.querySelector(".logo-track")).transform,
  );

  /* hover: colour + lift + glow side */
  const cellBox = await page.evaluate(() => {
    const c = [...document.querySelectorAll(".logo-cell")].find((c) => {
      const r = c.getBoundingClientRect();
      return r.left > 40 && r.right < window.innerWidth / 2 - 40;
    });
    c.dataset.probeLeft = "";
    const r = c.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await page.mouse.move(cellBox.x, cellBox.y);
  await settle(500);
  report.hoverLeft = await page.evaluate(() => {
    const c = document.querySelector("[data-probe-left]");
    const img = c.querySelector(".client-mark");
    const plate = c.querySelector(".logo-plate");
    return {
      filter: getComputedStyle(img).filter,
      opacity: getComputedStyle(img).opacity,
      lift: getComputedStyle(plate).transform,
      bloomOpacity: getComputedStyle(c, "::before").opacity,
      bloomScale: getComputedStyle(c, "::before").transform,
      haloOpacity: getComputedStyle(c, "::after").opacity,
      glow: c.style.getPropertyValue("--logo-glow"),
      haloEvents: getComputedStyle(c, "::after").pointerEvents,
      rowPaused: getComputedStyle(c.closest(".logo-track")).animationPlayState,
    };
  });
  await el.screenshot({ path: `${OUT}/wall-1440-hover.png` });

  const rightBox = await page.evaluate(() => {
    const c = [...document.querySelectorAll(".logo-cell")].find((c) => {
      const r = c.getBoundingClientRect();
      return r.left > window.innerWidth / 2 + 40 && r.right < window.innerWidth - 40;
    });
    c.dataset.probeRight = "";
    const r = c.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await page.mouse.move(rightBox.x, rightBox.y);
  await settle(400);
  report.hoverRight = await page.evaluate(() =>
    document.querySelector("[data-probe-right]").style.getPropertyValue("--logo-glow"),
  );

  await page.close();
}

/* ---- 375 ---- */
{
  const page = await open({ width: 375, height: 780, dpr: 3 });
  await settle(2600);
  await (await page.$("#trusted")).screenshot({ path: `${OUT}/wall-375.png` });
  report.mobile = await page.evaluate(() => {
    const r = document.querySelector(".logo-cell").getBoundingClientRect();
    return {
      cellSize: [Math.round(r.width), Math.round(r.height)],
      rows: document.querySelectorAll("[data-marquee-gated]").length,
      plateHeights: [...document.querySelectorAll("[data-plate] .client-mark")].map(
        (i) => [i.alt || "dup", Math.round(i.getBoundingClientRect().height)],
      ),
      hOverflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      bodyOverflow: document.body.scrollWidth - document.body.clientWidth,
      cls: window.__cls,
    };
  });
  await page.close();
}

/* ---- reduced motion ---- */
{
  const page = await open({ width: 1440, height: 900, reduce: true });
  await settle(1200);
  await (await page.$("#trusted")).screenshot({ path: `${OUT}/wall-reduced.png` });
  report.reduced = await page.evaluate(() => {
    const t = document.querySelector(".logo-track");
    const cs = getComputedStyle(t);
    const dup = document.querySelector(".logo-cell-dup");
    return {
      animation: cs.animationName,
      flexWrap: cs.flexWrap,
      dupDisplay: getComputedStyle(dup).display,
      cellOpacity: getComputedStyle(document.querySelector(".logo-cell")).opacity,
      bob: getComputedStyle(document.querySelector(".client-mark")).animationName,
      colourKept: getComputedStyle(document.querySelector(".client-mark")).filter,
      mask: getComputedStyle(document.querySelector(".logo-host")).maskImage,
      hOverflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    };
  });
  await page.close();
}

/* ---- tab hidden ---- */
{
  const page = await open({ width: 1440, height: 900 });
  await settle(2200);
  const cdp = await page.target().createCDPSession();
  await cdp.send("Emulation.setPageVisibilityOverride", { visibility: "hidden" }).catch(() => {});
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { value: true, configurable: true });
    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await settle(200);
  report.tabHidden = await page.evaluate(() => ({
    docAttr: document.documentElement.hasAttribute("data-tab-hidden"),
    play: [...document.querySelectorAll(".marquee-track")].map(
      (t) => getComputedStyle(t).animationPlayState,
    ),
  }));
  await page.close();
}

/* ---- off-screen pause + play-once entrance ---- */
{
  const page = await open({ width: 1440, height: 900 });
  await settle(2200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(700);
  report.offScreen = await page.evaluate(() => ({
    live: [...document.querySelectorAll("[data-marquee-gated]")].map((h) =>
      h.hasAttribute("data-live"),
    ),
    play: [...document.querySelectorAll(".logo-track")].map(
      (t) => getComputedStyle(t).animationPlayState,
    ),
  }));
  await page.evaluate(() =>
    document.querySelector("#trusted").scrollIntoView({ block: "center" }),
  );
  await settle(300);
  report.replayCheck = await page.evaluate(() => ({
    // entrance must not restage: cells stay settled the instant it returns
    cellOpacity: getComputedStyle(document.querySelector(".logo-cell")).opacity,
    transform: getComputedStyle(document.querySelector(".logo-cell")).transform,
  }));
  await page.close();
}

console.log(JSON.stringify(report, null, 1));
await browser.close();
