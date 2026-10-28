// node scripts/verify-services-symbol.mjs <QA node_modules> [URL]
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(pathToFileURL(join(resolve(process.argv[2]), 'playwright/index.mjs')));
const { default: AxeBuilder } = await import(pathToFileURL(join(resolve(process.argv[2]), '@axe-core/playwright/dist/index.mjs')));
const browser = await chromium.launch();
const output = '.impeccable/review/services-symbol';
await mkdir(output, { recursive: true });
const results = [];
try {
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.argv[3] || 'http://127.0.0.1:4330', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#servicios').evaluate(section => {
      scrollTo({ top: section.getBoundingClientRect().top + scrollY - 108, behavior: 'instant' });
    });
    const result = await page.locator('#servicios').evaluate(section => {
      const symbol = section.querySelector('.services__symbol');
      const image = symbol.querySelector('img');
      const rect = symbol.getBoundingClientRect();
      const box = section.getBoundingClientRect();
      const height = section.offsetHeight;
      symbol.style.display = 'none';
      const withoutSymbol = section.offsetHeight;
      symbol.style.removeProperty('display');
      return { width: innerWidth, documentWidth: document.documentElement.scrollWidth,
        height, withoutSymbol, position: getComputedStyle(symbol).position,
        parentPosition: getComputedStyle(section).position,
        symbolZ: getComputedStyle(symbol).zIndex,
        textZ: getComputedStyle(section.querySelector('.services__list')).zIndex,
        transform: getComputedStyle(image).transform,
        opacity: getComputedStyle(symbol).opacity,
        pointerEvents: getComputedStyle(symbol).pointerEvents,
        hidden: symbol.getAttribute('aria-hidden'),
        correctParent: symbol.parentElement === section,
        noteOverlap: rect.bottom > section.querySelector('.services__note').getBoundingClientRect().top,
        contained: rect.left >= box.left && rect.right <= box.right && rect.top >= box.top && rect.bottom <= box.bottom,
        ratio: rect.width / rect.height,
        originalRatio: image.naturalWidth / image.naturalHeight,
        loaded: image.complete && image.naturalWidth > 0,
      };
    });
    assert.equal(result.documentWidth, width);
    assert.equal(result.height, result.withoutSymbol);
    assert.equal(result.position, 'absolute');
    assert.equal(result.parentPosition, 'relative');
    assert.ok(Number(result.textZ) > Number(result.symbolZ));
    assert.equal(result.transform, 'none');
    assert.equal(result.pointerEvents, 'none');
    assert.equal(result.hidden, 'true');
    assert.ok(result.correctParent && result.contained && result.loaded);
    assert.equal(result.noteOverlap, false);
    assert.ok(Math.abs(result.ratio - result.originalRatio) < .001);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    assert.deepEqual(axe.violations.map(v => v.id), []);
    assert.deepEqual(errors, []);
    await page.screenshot({ path: `${output}/${width}.png` });
    results.push(result);
    await context.close();
  }
  await writeFile(`${output}/qa.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
