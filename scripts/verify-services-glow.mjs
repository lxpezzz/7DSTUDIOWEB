// node scripts/verify-services-glow.mjs <QA node_modules> [URL]
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(pathToFileURL(join(resolve(process.argv[2]), 'playwright/index.mjs')));
const url = process.argv[3] || 'http://127.0.0.1:4330';
const output = '.impeccable/review/services-glow';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
const state = card => card.evaluate(el => {
  const style = getComputedStyle(el), arrow = getComputedStyle(el.querySelector('.service-card__arrow'));
  return { rect: el.getBoundingClientRect().toJSON(), shadow: style.boxShadow, border: style.borderColor,
    background: style.backgroundColor, radius: style.borderRadius, transform: style.transform,
    transition: style.transitionDuration, arrow: arrow.color, arrowOpacity: arrow.opacity, arrowTransform: arrow.transform,
    focus: el.matches(':focus-visible'), accent: style.getPropertyValue('--card-accent').trim(), href: el.getAttribute('href') };
});
try {
  for (const [width, touch] of [[1440, false], [1024, false], [390, true], [360, true]]) {
    const page = await browser.newPage({ viewport: { width, height: 1100 }, hasTouch: touch, isMobile: touch });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    if (!touch) {
      await page.waitForSelector('.cinematic-ready');
      await page.evaluate(() => scrollTo({ top: innerHeight * 1.5, behavior: 'instant' }));
      await page.waitForTimeout(300);
    }
    const cards = page.locator('#servicios a.service-card');
    for (let index = 0; index < 3; index++) {
      const card = cards.nth(index);
      await card.scrollIntoViewIfNeeded();
      await page.mouse.move(1, 1);
      await page.waitForTimeout(300);
      const before = await state(card);
      if (!touch) {
        // Hover the padding, not an image or CTA.
        await card.hover({ position: { x: 12, y: 12 } });
        await page.waitForTimeout(300);
        const hover = await state(card);
        assert.notEqual(hover.shadow, before.shadow);
        assert.notEqual(hover.border, before.border);
        assert.notEqual(hover.arrow, before.arrow);
        assert.equal(hover.arrowOpacity, '1');
        assert.equal(hover.background, 'rgb(255, 255, 255)');
        assert.equal(hover.transform, 'none');
        assert.equal(hover.arrowTransform, 'none');
        assert.equal(hover.radius, before.radius);
        assert.deepEqual(hover.rect, before.rect, 'Sin desplazamientos ni cambios de tamaño');
        assert.ok(await card.evaluate(el => {
          const r = el.getBoundingClientRect();
          return document.elementFromPoint(r.x + 12, Math.max(120, r.y + 12))?.closest('a.service-card') === el;
        }), 'El halo no intercepta eventos');
        await page.screenshot({ path: `${output}/${width}-${index}-hover.png` });
        await page.mouse.move(1, 1);
        await page.waitForTimeout(300);
        assert.equal((await state(card)).shadow, before.shadow, 'Retorno suave al reposo');
      } else {
        assert.equal(await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches), false);
        await card.tap({ position: { x: 12, y: 12 } });
        await page.waitForTimeout(900);
        if (new URL(page.url()).pathname === '/seo-local/') {
          await page.goto(url, { waitUntil: 'networkidle' });
        } else assert.equal(new URL(page.url()).hash, '#contacto');
        assert.equal((await state(card)).shadow, before.shadow, 'Sin hover permanente en pantalla táctil');
      }
      results.push({ width, service: index, touch, accent: before.accent, unchangedGeometry: true });
    }
    // Enter via keyboard so :focus-visible is native, not a forced selector.
    if (!touch) await page.evaluate(() => scrollTo({ top: innerHeight * 1.5, behavior: 'instant' }));
    await page.waitForTimeout(300);
    await page.locator('#servicios .section-cta a').focus();
    for (const index of [2, 1, 0]) {
      await page.keyboard.press('Shift+Tab');
      await page.waitForTimeout(300);
      const focused = await state(cards.nth(index));
      assert.ok(focused.focus);
      assert.equal(focused.arrowOpacity, '1');
      assert.equal(focused.background, 'rgb(255, 255, 255)');
      assert.match(focused.shadow, /0\.34/);
      assert.equal(focused.transform, 'none');
    }
    await page.screenshot({ path: `${output}/${width}-keyboard.png` });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    assert.deepEqual(errors, []);
    await page.close();
  }
  const reduced = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await reduced.goto(url, { waitUntil: 'networkidle' });
  const card = reduced.locator('#servicios .service-card').first();
  await card.hover();
  assert.equal((await state(card)).transition, '0s');
  assert.equal((await state(card)).transform, 'none');
  await reduced.close();
  await writeFile(`${output}/qa.json`, JSON.stringify({ results, keyboard: 'pass', reducedMotion: 'pass', errors: [] }, null, 2));
  console.log(JSON.stringify({ results, keyboard: 'pass', reducedMotion: 'pass', errors: [] }, null, 2));
} finally { await browser.close(); }
