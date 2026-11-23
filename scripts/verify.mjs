// node scripts/verify.mjs <QA node_modules> [URL local]
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { loadQATools, createQAContext, qaURL } from './qa-browser.mjs';

const { chromium, AxeBuilder } = await loadQATools();
const browser = await chromium.launch();
const output = '.impeccable/review/phase3';
await mkdir(output, { recursive: true });
const results = [];
const advisories = [];
const routes = ['/', '/diseno-web/', '/seo-local/', '/productos/', '/quienes-somos/', '/preguntas-frecuentes/', '/contacto/', '/ruta-inexistente-fase3/'];

try {
  for (const width of [1440, 1280, 1024, 768, 430, 390, 375]) {
    const context = await createQAContext(browser, { viewport: { width, height: 960 }, reducedMotion: 'reduce' });
    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(`${qaURL}${route}`, { waitUntil: 'networkidle' });
      assert.equal(response.status(), route.includes('inexistente') ? 404 : 200);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, `${route} ${width}: overflow`);
      if ([390, 1440].includes(width)) {
        if (route === '/') await page.locator('#servicios').scrollIntoViewIfNeeded();
        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
        const blocking = axe.violations.filter(v => ['label-content-name-mismatch', 'region'].includes(v.id) || v.tags.some(tag => /^wcag/.test(tag)));
        advisories.push(...axe.violations.filter(v => !blocking.includes(v)).map(v => ({ route, width, id: v.id, nodes: v.nodes.map(n => n.target) })));
        assert.deepEqual(blocking.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], `${route} ${width}`);
        if (route === '/') {
          await page.locator('#servicios').screenshot({ path: `${output}/services-${width}.png` });
          await page.locator('#proyectos').scrollIntoViewIfNeeded();
          const portfolioAxe = await new AxeBuilder({ page }).include('#proyectos').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
          assert.deepEqual(portfolioAxe.violations.map(v => v.id), []);
        }
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({ path: `${output}/${route === '/' ? 'home' : route.split('/')[1]}-${width}.png` });
      }
      if (route.includes('inexistente')) {
        assert.match(await page.locator('h1').textContent(), /404.*No encontramos/);
        assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /noindex/);
        for (const href of ['/', '/#servicios', '/contacto/']) assert.equal(await page.locator(`.not-found__links a[href="${href}"]`).count(), 1);
      }
      assert.deepEqual(errors, [], `${route} ${width}`);
      results.push({ route, width, status: response.status(), overflow: false, axe: [390, 1440].includes(width) ? 'pass' : 'not run', errors });
      await page.close();
    }
    await context.close();
  }
  // URLs anidadas y con extensión: ni soft-404 ni redirección a Inicio.
  const context = await createQAContext(browser);
  for (const route of ['/carpeta-inexistente-fase3/otra-pagina', '/inexistente-fase3.html']) {
    const page = await context.newPage();
    const response = await page.goto(`${qaURL}${route}`, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 404);
    assert.equal(new URL(page.url()).pathname, route);
    assert.match(await page.locator('h1').textContent(), /No encontramos/);
    await page.close();
  }
  await context.close();
  await writeFile(`${output}/ui.json`, JSON.stringify({ results, advisories }, null, 2));
  if (advisories.length) console.log('Avisos best-practice fuera del alcance:', JSON.stringify(advisories));
  console.log(`OK: ${results.length} vistas, axe móvil/escritorio, Servicios y portfolio tras scroll, recuperación 404 local.`);
} finally {
  await browser.close();
}
