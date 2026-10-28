// node scripts/verify-section-headings.mjs <QA node_modules> [URL]
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(pathToFileURL(join(resolve(process.argv[2]), 'playwright/index.mjs')));
const browser = await chromium.launch();
const output = '.impeccable/review/section-headings';
await mkdir(output, { recursive: true });
try {
  for (const width of [360, 390, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.argv[3] || 'http://127.0.0.1:4330', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.section-label, .cinematic-hero__eyebrow').count(), 0);
    for (const id of ['services-title', 'projects-title', 'process-title', 'about-title', 'contact-title']) {
      const heading = page.locator(`#${id}`);
      const layout = await heading.evaluate(el => {
        const box = el.getBoundingClientRect();
        return { align: getComputedStyle(el).textAlign, delta: Math.abs(box.x + box.width / 2 - innerWidth / 2) };
      });
      assert.equal(layout.align, 'center');
      assert.ok(layout.delta < 1, `${id} no está centrado a ${width}px`);
      if (width === 390 || width === 1440) {
        await heading.evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - document.querySelector('.header').getBoundingClientRect().height - 24, behavior: 'instant' }));
        await page.screenshot({ path: `${output}/${width}-${id}.png` });
      }
    }
    for (const selector of ['.projects__heading .body-copy', '.about__statement > p', '.contact__heading > p']) {
      assert.ok(await page.locator(selector).evaluate(el => {
        const box = el.getBoundingClientRect();
        return getComputedStyle(el).textAlign === 'center' && Math.abs(box.x + box.width / 2 - innerWidth / 2) < 1;
      }));
    }
    assert.equal(await page.locator('.contact__field label').count(), 3);
    assert.deepEqual(errors, []);
    console.log(`${width}px: cinco H2 y sus descripciones centrados; sin etiquetas de sección; formulario conservado.`);
    await page.close();
  }
} finally { await browser.close(); }
