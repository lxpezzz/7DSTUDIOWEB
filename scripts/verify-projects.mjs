// node scripts/verify-projects.mjs <QA node_modules> [URL local]
// Prueba los proyectos publicados; no inyecta un catálogo vacío de fases antiguas.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { loadQATools, createQAContext, qaURL } from './qa-browser.mjs';

const { chromium, AxeBuilder } = await loadQATools();
const browser = await chromium.launch();
const output = '.impeccable/review/projects';
await mkdir(output, { recursive: true });
const results = [];
try {
  for (const width of [1440, 1280, 1024, 768, 430, 390, 375]) {
    const context = await createQAContext(browser, { viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(qaURL, { waitUntil: 'networkidle' });
    const section = page.locator('#proyectos');
    await section.scrollIntoViewIfNeeded();
    assert.equal(await section.locator('.project').count(), 5);
    assert.equal(await section.locator('.projects__empty').count(), 0);
    assert.equal(await section.locator('a.project[href="https://peluqueria.7dstudio.es/"]').count(), 1);
    assert.equal(await section.locator('a.project[href="https://asesoria.7dstudio.es/"]').count(), 1);
    assert.equal(await section.locator('a.project[href="/demos/huella/"]').count(), 1);
    for (const image of await section.locator('img').all()) {
      await image.evaluate(el => el.decode());
      assert.ok(await image.getAttribute('srcset'));
      assert.ok(await image.getAttribute('alt'));
    }
    const track = section.locator('.catalogue__track');
    await track.focus();
    await page.keyboard.press('End');
    await page.waitForFunction(() => {
      const track = document.querySelector('.catalogue__track');
      return track.scrollLeft >= track.scrollWidth - track.clientWidth - 3 && document.querySelector('.catalogue__next').disabled;
    });
    assert.equal(await section.locator('.catalogue__next').isDisabled(), true);
    await page.keyboard.press('Home');
    await page.waitForFunction(() => document.querySelector('.catalogue__track').scrollLeft < 3 && document.querySelector('.catalogue__previous').disabled);
    assert.equal(await section.locator('.catalogue__previous').isDisabled(), true);
    const axe = await new AxeBuilder({ page }).include('#proyectos').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
    assert.deepEqual(axe.violations.map(v => v.id), []);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    results.push({ width, projects: 5, keyboard: 'pass', axe: 0, overflow: false });
    await context.close();
  }
  await writeFile(`${output}/qa.json`, JSON.stringify(results, null, 2));
  console.log('Portfolio actual: 7 anchos, imágenes responsivas, Huella, Home/End y axe: OK.');
} finally { await browser.close(); }
