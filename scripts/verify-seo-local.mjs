// node scripts/verify-seo-local.mjs <QA node_modules> [URL]
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const modules = resolve(process.argv[2]);
const { chromium } = await import(pathToFileURL(join(modules, 'playwright/index.mjs')));
const { default: AxeBuilder } = await import(pathToFileURL(join(modules, '@axe-core/playwright/dist/index.mjs')));
const url = process.argv[3] || 'http://127.0.0.1:4330';
const output = '.impeccable/review/seo-local';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

try {
  for (const width of [1440, 1280, 1024, 768, 430, 390, 375]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      window.seoVitals = { cls: 0, lcp: 0 };
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.seoVitals.cls += entry.value;
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) window.seoVitals.lcp = entry.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    const response = await page.goto(`${url}/seo-local/`, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const info = await page.evaluate(() => {
      const box = el => el.getBoundingClientRect().toJSON();
      return {
        width: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        overflow: [...document.querySelectorAll('main *')].filter(el => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1) && getComputedStyle(el).position !== 'absolute';
        }).map(el => el.tagName + '.' + el.className),
        planBoxes: [...document.querySelectorAll('.plan')].map(box),
        profileBoxes: [...document.querySelectorAll('.profile')].map(box),
        vitals: window.seoVitals,
        resources: performance.getEntriesByType('resource').map(entry => entry.name),
      };
    });
    check(info.documentWidth === width, `Overflow documento ${width}: ${info.documentWidth}`);
    check(info.overflow.length === 0, `Overflow contenido ${width}: ${info.overflow.join(', ')}`);
    check(!info.resources.some(resource => /gsap|ScrollTrigger/.test(resource)), `GSAP descargado en SEO ${width}`);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('form, canvas, iframe').count(), 0);
    assert.match(await page.title(), /SEO local en Castellón/);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://7dstudio.es/seo-local/');
    assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), 'https://7dstudio.es/seo-local/');
    assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 80);
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    assert.ok(schemas.map(JSON.parse).some(schema => schema['@type'] === 'BreadcrumbList'));
    assert.equal(await page.locator('.faq details').count(), 6);
    assert.equal(await page.locator('.plan__features, .plan__badge').count(), 0, 'Sin prestaciones ni etiquetas ficticias');
    assert.match(await page.locator('[data-plan="seo-estandar"] .plan__price').textContent(), /129\s*€/);
    assert.match(await page.locator('[data-plan="seo-premium"] .plan__price').textContent(), /179\s*€/);
    assert.match(await page.locator('.plans__note').textContent(), /gratuito/);
    assert.match(await page.locator('.comparison__disclaimer').textContent(), /no garantiza/);
    assert.match(await page.locator('figcaption').textContent(), /ficticios/);
    if (width < 768) {
      assert.ok(info.planBoxes[0].bottom <= info.planBoxes[1].top + 1);
      assert.ok(info.profileBoxes[0].bottom <= info.profileBoxes[1].top + 1);
    } else {
      assert.ok(Math.abs(info.planBoxes[0].top - info.planBoxes[1].top) < 1);
      assert.ok(Math.abs(info.profileBoxes[0].top - info.profileBoxes[1].top) < 1);
    }
    await page.screenshot({ path: `${output}/${width}-hero.png` });
    const summary = page.locator('.faq summary').first();
    await summary.focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.faq details').first().getAttribute('open'), '');
    assert.equal(await summary.evaluate(el => el.matches(':focus-visible')), true);
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.faq details').first().getAttribute('open'), null);
    for (let index = 0; index < 6; index++) await page.locator('.faq summary').nth(index).click();
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    check(axe.violations.length === 0, `Axe ${width}: ${JSON.stringify(axe.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })))}`);
    if ([1440, 768, 390].includes(width)) {
      await page.locator('.comparison').screenshot({ path: `${output}/${width}-comparison.png`, style: '.header { visibility: hidden; }' });
      await page.locator('.plans').screenshot({ path: `${output}/${width}-plans.png`, style: '.header { visibility: hidden; }' });
    }
    if ([1440, 390].includes(width)) {
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: `${output}/${width}-full.png`, fullPage: true });
    }
    // Intercept navigation only; never send a WhatsApp message or contact a real provider.
    await context.route('https://wa.me/**', route => route.fulfill({ body: '<title>Consulta preparada · QA</title>' }));
    for (const name of ['SEO Estándar', 'SEO Premium']) {
      const link = page.getByRole('link', { name: `Consultar ${name}`, exact: false });
      await link.focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      assert.equal(await link.evaluate(el => el.matches(':focus-visible')), true);
      const [popup] = await Promise.all([page.waitForEvent('popup'), page.keyboard.press('Enter')]);
      await popup.waitForLoadState();
      const destination = new URL(popup.url());
      assert.equal(destination.hostname, 'wa.me');
      assert.equal(destination.pathname, '/34621200800');
      assert.ok(destination.searchParams.get('text').includes(name));
      await popup.close();
    }
    assert.deepEqual(errors, []);
    results.push({ width, overflow: info.documentWidth !== width, axeViolations: axe.violations.length, vitalsLocalLab: info.vitals, errors });
    await context.close();
  }
  for (const options of [{ javaScriptEnabled: false }, { reducedMotion: 'reduce' }]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, ...options });
    await page.goto(`${url}/seo-local/`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').count(), 1);
    await page.locator('.faq summary').first().click();
    assert.equal(await page.locator('.faq details').first().getAttribute('open'), '');
    assert.equal(await page.locator('.plan__button').count(), 2);
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  assert.equal(await page.title(), '7D Studio | Diseño web, SEO local y soluciones digitales');
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://7dstudio.es/');
  assert.equal(await page.locator('.header .nav a[href="/seo-local/"]').count(), 1);
  await page.evaluate(() => scrollTo({ top: innerHeight * 1.5, behavior: 'instant' }));
  await page.waitForTimeout(300);
  const seoCard = page.locator('#servicios [data-service="seo-local"]');
  assert.equal(await seoCard.getAttribute('href'), '/seo-local/');
  await seoCard.locator('h3').click();
  await page.waitForURL('**/seo-local/');
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => scrollTo({ top: innerHeight * 1.5 * .25, behavior: 'instant' }));
  await page.waitForTimeout(300);
  const projected = page.locator('.cinematic-hero__interaction [data-service="seo-local"]');
  assert.equal(await projected.getAttribute('href'), '/seo-local/');
  await projected.click();
  await page.waitForURL('**/seo-local/');
  await page.close();
  const source = await readFile('src/data/seoPlans.ts', 'utf8');
  for (const field of ['id', 'name', 'price', 'period', 'description', 'included', 'excluded', 'badge', 'cta', 'order']) assert.match(source, new RegExp(`\\b${field}:`));
  assert.equal((source.match(/included: \[\]/g) || []).length, 2);
  assert.equal((source.match(/excluded: \[\]/g) || []).length, 2);
  const protectedFiles = JSON.parse(await readFile(`${output}/protected-before.json`, 'utf8'));
  for (const [file, before] of Object.entries(protectedFiles)) {
    assert.equal(createHash('sha256').update(await readFile(file)).digest('hex'), before, `Archivo protegido alterado: ${file}`);
  }
  const report = { results, failures, planLinks: 'native keyboard + WhatsApp URL verified; no messages sent', homeLinks: 'real and projected cards', protectedFiles: 'SHA-256 unchanged', noJS: 'pass', reducedMotion: 'pass', featureLists: 'empty and not rendered' };
  await writeFile(`${output}/qa.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  assert.deepEqual(failures, []);
} finally {
  await browser.close();
}
