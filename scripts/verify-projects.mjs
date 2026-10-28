// node scripts/verify-projects.mjs <QA node_modules> [URL]
// Los datos sintéticos se inyectan SOLO en el navegador de QA, nunca en projects.ts ni dist/.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { getHomeProjects, getDemoUrl, projects } from '../src/data/projects.ts';
const modules = resolve(process.argv[2]);
const { chromium } = await import(pathToFileURL(join(modules, 'playwright/index.mjs')));
const { default: AxeBuilder } = await import(pathToFileURL(join(modules, '@axe-core/playwright/dist/index.mjs')));
const browser = await chromium.launch();
const output = '.impeccable/review/projects';
await mkdir(output, { recursive: true });
assert.deepEqual(projects, [], 'Actualizar el QA cuando se incorporen proyectos reales.');
assert.equal(getHomeProjects(Array.from({ length: 7 }, (_, id) => ({ id, featured: id > 0 }))).length, 4);
for (const value of ['', '/ruta-inexistente', 'javascript:alert(1)', 'mailto:a@example.test', 'https://user:pass@example.test']) assert.equal(getDemoUrl(value), undefined);
assert.equal(getDemoUrl('https://example.test/demo'), 'https://example.test/demo');
const source = await readFile('src/scripts/project-catalogue.ts', 'utf8');
const client = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const results = [];
async function settle(page) { await page.waitForTimeout(700); }
try {
  for (const width of [360, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, hasTouch: width < 768, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.argv[3] || 'http://127.0.0.1:4330', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#proyectos').evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await settle(page);
    assert.equal(await page.locator('#proyectos h2').textContent(), 'Diseñamos webs que hablan por sí solas.');
    assert.ok(await page.locator('.projects__empty').isVisible());
    assert.equal(await page.locator('#proyectos a[href="/proyectos/"]').count(), 0);
    assert.equal(await page.locator('#proyectos .project').count(), 0);
    assert.equal(await page.locator('.catalogue__controls').isVisible(), false);
    const baselineDocumentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(await page.locator('#proyectos').evaluate(el => el.getBoundingClientRect().right <= innerWidth + 1));
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    assert.deepEqual(axe.violations.map(v => v.id), []);
    await page.screenshot({ path: `${output}/published-empty-${width}.png` });

    await page.evaluate(() => {
      const catalogue = document.querySelector('[data-project-catalogue]');
      const scopes = [...catalogue.attributes].filter(attr => attr.name.startsWith('data-astro-cid-')).map(attr => attr.name);
      const track = catalogue.querySelector('.catalogue__track');
      catalogue.hidden = false;
      document.querySelector('.projects__empty').hidden = true;
      track.innerHTML = Array.from({ length: 4 }, (_, i) => `<article class="project" data-project-id="qa-${i}"><div class="project__image"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="1600" height="1000" alt="Superficie vacía de prueba QA; no es una captura de proyecto" /></div><div class="project__meta"><span>Datos de prueba</span><span class="project__type">Demostración</span></div><h3>Prueba QA ${i + 1} · no publicada</h3><p class="project__description">Datos sintéticos para comprobar la navegación. No representan proyectos reales.</p>${i === 1 ? '' : `<a class="text-link project__link" href="https://example.test/qa-${i}" target="_blank" rel="noopener noreferrer">Explorar demo de prueba<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg></a>`}</article>`).join('');
      track.querySelectorAll('*').forEach(el => scopes.forEach(scope => el.setAttribute(scope, '')));
    });
    await page.addScriptTag({ type: 'module', content: `${client}\ninitProjectCatalogues();` });
    await page.waitForSelector('[data-project-catalogue][data-enhanced="true"]');
    const track = page.locator('.catalogue__track');
    await track.scrollIntoViewIfNeeded();
    const dimensions = await track.evaluate(track => ({ width: track.clientWidth, scrollWidth: track.scrollWidth,
      cardWidth: track.querySelector('.project').getBoundingClientRect().width,
      ratio: track.querySelector('.project__image').getBoundingClientRect().width / track.querySelector('.project__image').getBoundingClientRect().height,
      documentWidth: document.documentElement.scrollWidth,
      snap: getComputedStyle(track).scrollSnapType }));
    assert.equal(dimensions.documentWidth, baselineDocumentWidth, 'El catálogo no debe añadir overflow al documento');
    assert.ok(dimensions.scrollWidth > dimensions.width);
    assert.equal(dimensions.snap, 'x mandatory');
    assert.ok(Math.abs(dimensions.ratio - 1.6) < .01);
    assert.ok(dimensions.cardWidth < dimensions.width);
    if (width >= 1024) assert.ok(dimensions.cardWidth * 2 < dimensions.width);
    assert.equal(await page.locator('.catalogue__previous').isDisabled(), true);
    await page.locator('.catalogue__next').click();
    await settle(page);
    assert.ok(await track.evaluate(el => el.scrollLeft > 0));
    await track.focus();
    await page.keyboard.press('End');
    await settle(page);
    assert.equal(await page.locator('.catalogue__next').isDisabled(), true);
    await page.keyboard.press('Home');
    await settle(page);
    assert.ok(await track.evaluate(el => el.scrollLeft < 3));
    await page.keyboard.press('ArrowRight');
    await settle(page);
    assert.ok(await track.evaluate(el => el.scrollLeft > 0));
    await page.keyboard.press('ArrowLeft');
    await settle(page);
    assert.ok(await track.evaluate(el => el.scrollLeft < 3));

    if (width < 768) {
      const box = await track.boundingBox();
      const cdp = await context.newCDPSession(page);
      const y = Math.max(120, Math.min(850, box.y + 80));
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width * .85, y }] });
      for (let i = 1; i <= 6; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x + box.width * (.85 - .1 * i), y }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await settle(page);
      assert.ok(await track.evaluate(el => el.scrollLeft > 0), 'Swipe táctil');
    } else {
      await track.hover();
      await page.mouse.wheel(650, 0);
      await settle(page);
      assert.ok(await track.evaluate(el => el.scrollLeft > 0), 'Scroll horizontal con trackpad');
    }

    await track.evaluate(el => el.scrollTo({ left: 0, behavior: 'instant' }));
    await settle(page);
    await page.screenshot({ path: `${output}/qa-fixture-not-published-${width}.png` });
    if (width >= 768) {
      await page.locator('.project__image').first().hover();
      await settle(page);
      const transform = await page.locator('.project__image img').first().evaluate(el => getComputedStyle(el).transform);
      assert.ok(transform.startsWith('matrix(1.03'), `Ampliación: ${transform}`);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await track.evaluate(el => getComputedStyle(el).scrollBehavior), 'auto');
    assert.equal(await page.locator('.project__image img').first().evaluate(el => getComputedStyle(el).transform), 'none');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), baselineDocumentWidth);
    assert.deepEqual(errors, []);
    results.push({ width, baselineDocumentWidth, preexistingOverflow: baselineDocumentWidth > width ? 'services__symbol right: -400px; fuera del alcance' : false, published: 'empty, no fabricated projects or routes', fixture: 'browser-only QA', dimensions, arrows: 'pass', keyboard: 'pass', pointer: 'pass', reducedMotion: 'pass', accessibilityViolations: 0, errors });
    await context.close();
  }
  // Regresión acotada: el nuevo catálogo no crea pins ni altera la cámara existente.
  const cinematic = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  await cinematic.goto(process.argv[3] || 'http://127.0.0.1:4330', { waitUntil: 'networkidle' });
  await cinematic.waitForSelector('.cinematic-ready');
  assert.equal(await cinematic.locator('.pin-spacer').count(), 1);
  assert.equal(await cinematic.locator('#proyectos .pin-spacer').count(), 0);
  for (const progress of [.45, .75, 1, 1.1, .3]) {
    await cinematic.evaluate(progress => scrollTo({ top: 1800 * progress, behavior: 'instant' }), progress);
    await cinematic.waitForTimeout(1400);
    if (progress === .75) {
      const projection = await cinematic.locator('.cinematic-hero__projection').boundingBox();
      assert.ok(Math.abs(projection.width - 1440) < 2 && Math.abs(projection.height - 900) < 2);
    }
    if (progress >= 1) assert.ok(await cinematic.locator('.cinematic-hero').evaluate(el => el.classList.contains('cinematic-complete')));
    else assert.equal(await cinematic.locator('.cinematic-hero').evaluate(el => el.classList.contains('cinematic-complete')), false);
  }
  await cinematic.close();
  await writeFile(`${output}/qa.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
