// node scripts/verify-header.mjs <QA node_modules> [URL local]
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { loadQATools, createQAContext, qaURL } from './qa-browser.mjs';

const { chromium } = await loadQATools();
const browser = await chromium.launch();
const output = '.impeccable/review/phase3';
await mkdir(output, { recursive: true });
const results = [];
const routes = ['/', '/diseno-web/', '/seo-local/', '/productos/', '/quienes-somos/', '/preguntas-frecuentes/', '/contacto/', '/ruta-inexistente-fase3/'];
try {
  for (const javaScriptEnabled of [true, false]) {
    for (const width of [1440, 1280, 1024, 768, 430, 390, 375]) {
      const context = await createQAContext(browser, { viewport: { width, height: 960 }, javaScriptEnabled, reducedMotion: 'reduce' });
      for (const route of routes) {
        const page = await context.newPage();
        await page.goto(`${qaURL}${route}`, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        const geometry = await page.evaluate(() => {
          const header = document.querySelector('.header');
          const first = document.querySelector('main nav[aria-label="Ruta de navegación"]') || document.querySelector('h1');
          return { header: header.getBoundingClientRect().toJSON(), first: first.getBoundingClientRect().toJSON(), position: getComputedStyle(header).position, overflow: document.documentElement.scrollWidth > innerWidth };
        });
        assert.equal(geometry.position, !javaScriptEnabled && width < 900 ? 'static' : 'fixed');
        assert.ok(geometry.first.top >= geometry.header.bottom - 1, `${route} ${width} JS=${javaScriptEnabled}: primer contenido tapado`);
        assert.equal(geometry.overflow, false);
        if (width < 900 && javaScriptEnabled) {
          const toggle = page.getByRole('button', { name: 'Abrir navegación', exact: true });
          await toggle.click();
          const dialog = page.getByRole('dialog');
          assert.equal(await dialog.isVisible(), true);
          assert.equal(await dialog.getByRole('link', { name: 'Inicio', exact: true }).count(), 1);
          await page.keyboard.press('Escape');
          await page.waitForFunction(() => document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false');
          assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
          assert.equal(await toggle.evaluate(el => el === document.activeElement), true);
          await toggle.click();
          await dialog.getByRole('link', { name: 'Diseño web', exact: true }).click();
          await page.waitForURL('**/diseno-web/');
          assert.equal(await page.locator('#mobile-menu').getAttribute('open'), null);
          await page.goto(`${qaURL}${route}`, { waitUntil: 'networkidle' });
        } else if (!javaScriptEnabled) {
          assert.equal(await page.locator('#main-nav a').first().isVisible(), true);
          assert.equal(await page.locator('.menu-toggle').isVisible(), false);
        }
        if ([375, 390, 430, 1440].includes(width) && ['/diseno-web/', '/seo-local/'].includes(route)) {
          await page.screenshot({ path: `${output}/header-${route.split('/')[1]}-${width}-js-${javaScriptEnabled}.png` });
        }
        // Skip link: comprobar el destino del ancla y la compensación del header.
        await page.locator('.skip-link').focus();
        await page.keyboard.press('Enter');
        const anchor = await page.evaluate(() => ({ top: (document.querySelector('main nav[aria-label="Ruta de navegación"]') || document.querySelector('h1')).getBoundingClientRect().top, headerBottom: getComputedStyle(document.querySelector('.header')).position === 'fixed' ? document.querySelector('.header').getBoundingClientRect().bottom : 0 }));
        assert.ok(anchor.top >= anchor.headerBottom - 1, `${route} ${width}: ancla tapada`);
        results.push({ route, width, javaScriptEnabled, ...geometry });
        await page.close();
      }
      // Ancla de sección profunda en la home, además del primer contenido.
      const page = await context.newPage();
      await page.goto(`${qaURL}/#contacto`, { waitUntil: 'networkidle' });
      const visible = await page.locator('#contact-title').evaluate(el => {
        const header = document.querySelector('.header');
        const bottom = getComputedStyle(header).position === 'fixed' ? header.getBoundingClientRect().bottom : 0;
        return el.getBoundingClientRect().top >= bottom - 1;
      });
      assert.ok(visible, `Contacto ${width} JS=${javaScriptEnabled}`);
      await context.close();
    }
  }
  await writeFile(`${output}/header.json`, JSON.stringify(results, null, 2));
  console.log(`OK: ${results.length} vistas con/sin JS, menú, Escape/foco, migas, skip link y ancla Contacto.`);
} finally { await browser.close(); }
