// Uso: node scripts/verify-seal.mjs <node_modules-QA> [URL]
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const { chromium } = await import(pathToFileURL(join(resolve(process.argv[2]), 'playwright/index.mjs')));
const { default: AxeBuilder } = await import(pathToFileURL(join(resolve(process.argv[2]), '@axe-core/playwright/dist/index.mjs')));
const browser = await chromium.launch();
const output = '.impeccable/review/seal';
await mkdir(output, { recursive: true });
const results = [];
const errors = [];
try {
  for (const width of [360, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 940 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(process.argv[3] || 'http://127.0.0.1:4331', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => {
      const seal = document.querySelector('.hero__seal');
      const bounds = seal.getBoundingClientRect();
      const range = document.createRange();
      const walker = document.createTreeWalker(document.querySelector('h1'), NodeFilter.SHOW_TEXT);
      const collisions = [];
      while (walker.nextNode()) {
        if (!walker.currentNode.textContent.trim()) continue;
        range.selectNodeContents(walker.currentNode);
        for (const rect of range.getClientRects()) {
          if (rect.left < bounds.right && rect.right > bounds.left && rect.top < bounds.bottom && rect.bottom > bounds.top) collisions.push(walker.currentNode.textContent);
        }
      }
      return {
        width: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        seal: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height },
        collisions,
        reducedMotion: getComputedStyle(document.querySelector('.studio-seal__turn')).animationName,
        circularText: document.querySelector('textPath').textContent.trim(),
      };
    });
    assert.equal(result.documentWidth, width);
    assert.equal(result.collisions.length, 0, `Solapamiento con texto a ${width}px`);
    assert.equal(result.seal.width, result.seal.height);
    assert.equal(result.reducedMotion, 'none');
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    result.accessibilityViolations = axe.violations.map(violation => violation.id);
    assert.equal(result.accessibilityViolations.length, 0);
    await page.screenshot({ path: `${output}/hero-${width}.png` });
    if (width === 1440) await page.locator('.hero__seal').screenshot({ path: `${output}/detail.png`, scale: 'css' });
    results.push(result);
    await context.close();
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 940 } });
  await page.goto(process.argv[3] || 'http://127.0.0.1:4331', { waitUntil: 'networkidle' });
  const animation = await page.locator('.studio-seal__turn').evaluate(element => {
    const effect = element.getAnimations()[0];
    const timing = effect.effect.getTiming();
    effect.pause();
    effect.currentTime = 15000;
    const halfway = getComputedStyle(element).transform;
    effect.currentTime = 45000;
    return { duration: timing.duration, iterations: String(timing.iterations), easing: timing.easing, halfway, nextLap: getComputedStyle(element).transform };
  });
  assert.equal(animation.duration, 30000);
  assert.equal(animation.iterations, 'Infinity');
  assert.equal(animation.easing, 'linear');
  assert.equal(animation.halfway, 'matrix(-1, 0, 0, -1, 0, 0)');
  assert.equal(animation.nextLap, animation.halfway);
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.studio-seal').getAttribute('data-paused') === 'true');
  assert.equal(await page.locator('.studio-seal__turn').evaluate(element => getComputedStyle(element).animationPlayState), 'paused');
  await page.locator('.studio-seal').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.studio-seal').getAttribute('data-paused') === 'false');
  await page.close();

  const nojs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await nojs.goto(process.argv[3] || 'http://127.0.0.1:4331');
  assert.ok(await nojs.locator('.studio-seal').isVisible());
  await nojs.close();
  assert.equal(errors.length, 0);
  const report = { results, animation, noJavaScript: 'visible', errors };
  await writeFile(`${output}/qa.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
