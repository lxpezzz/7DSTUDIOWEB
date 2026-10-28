// node scripts/verify-header.mjs <QA node_modules> [URL]
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(pathToFileURL(join(resolve(process.argv[2]), 'playwright/index.mjs')));
const browser = await chromium.launch();
const url = process.argv[3] || 'http://127.0.0.1:4330';
const output = '.impeccable/review/header';
await mkdir(output, { recursive: true });
const results = [];
try {
  for (const width of [360, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const snapshots = [];
    for (const y of width >= 768 ? [0, 540, 1080, 1620, 2000, 3600] : [0, 600, 1600, 3000]) {
      await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y);
      await page.waitForTimeout(1250);
      const result = await page.locator('.header').evaluate(header => {
        const rect = header.getBoundingClientRect();
        const brand = header.querySelector('.brand').getBoundingClientRect();
        const ancestors = [];
        for (let node = header.parentElement; node; node = node.parentElement) {
          const style = getComputedStyle(node);
          if (style.transform !== 'none' || style.perspective !== 'none' || style.filter !== 'none') ancestors.push(node.tagName);
        }
        return { top: rect.top, height: rect.height, position: getComputedStyle(header).position,
          opacity: getComputedStyle(header).opacity, background: getComputedStyle(header).backgroundColor,
          above: header.contains(document.elementFromPoint(brand.x + 10, brand.y + 10)),
          insideScene: !!header.closest('.cinematic-hero, .pin-spacer'), ancestors,
          overflow: document.documentElement.scrollWidth > innerWidth };
      });
      assert.equal(result.position, 'fixed');
      assert.equal(result.top, 0);
      assert.equal(result.opacity, '1');
      assert.ok(result.above);
      assert.equal(result.insideScene, false);
      assert.deepEqual(result.ancestors, []);
      assert.equal(result.overflow, false);
      snapshots.push({ y, ...result });
      if (y === 1080 || y === 600 || y === 3600) await page.screenshot({ path: `${output}/${width}-${y}.png` });
    }
    for (const href of ['#servicios', '#proyectos', '#estudio', '#contacto']) {
      if (width <= 640) await page.locator('.menu-toggle').click();
      await page.locator(`.header .nav a[href$="${href}"]`).click();
      await page.waitForTimeout(1600);
      const target = await page.locator(href).evaluate(section => {
        const heading = section.querySelector('h2') || section;
        return { headingTop: heading.getBoundingClientRect().top,
          headerBottom: document.querySelector('.header').getBoundingClientRect().bottom };
      });
      assert.ok(target.headingTop >= target.headerBottom - 1, `${width}px ${href}: título tapado`);
      if (width <= 640) assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    }
    if (width <= 640) {
      await page.locator('.menu-toggle').click();
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      assert.ok(await page.locator('.menu-toggle').evaluate(el => el === document.activeElement));
    }
    assert.deepEqual(errors, []);
    results.push({ width, snapshots, anchors: 'visible', errors });
    await context.close();
  }
  await writeFile(`${output}/qa.json`, JSON.stringify(results, null, 2));
  console.log('Header fijo, superposición, ancestros, menú y anclas: OK en 360, 390, 768 y 1440 px.');
} finally { await browser.close(); }
