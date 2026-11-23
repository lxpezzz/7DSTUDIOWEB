// node scripts/verify-seo-local.mjs <QA node_modules> [URL]
import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createQAContext } from './qa-browser.mjs';

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
    const context = await createQAContext(browser, { viewport: { width, height: 1000 }, reducedMotion: 'no-preference' });
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
    assert.equal(await page.locator('form').count(), 1);
    assert.equal(await page.locator('canvas, iframe').count(), 0);
    assert.match(await page.title(), /SEO local en Castellón/);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://7dstudio.es/seo-local/');
    assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), 'https://7dstudio.es/seo-local/');
    assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 80);
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    assert.ok(schemas.map(JSON.parse).some(schema => schema['@type'] === 'BreadcrumbList'));
    assert.equal(await page.locator('.faq details').count(), 7);
    assert.equal(await page.locator('.plan__features').count(), 2, 'Prestaciones actuales de ambos planes');
    assert.equal(await page.locator('.plan__badge').count(), 0);
    assert.match(await page.locator('[data-plan="seo-estandar"] .plan__price').textContent(), /129\s*€/);
    assert.match(await page.locator('[data-plan="seo-premium"] .plan__price').textContent(), /179\s*€/);
    assert.match((await page.locator('.plans__note').allTextContents()).join(' '), /gratuito/);
    assert.match(await page.locator('.comparison__disclaimer').textContent(), /no garantiza/);
    assert.match(await page.locator('.comparison__disclaimer').textContent(), /Ejemplo ilustrativo/);
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
    for (const summary of await page.locator('.faq summary').all()) await summary.click();
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
    // Los CTA actuales seleccionan el plan en el formulario; no envían datos.
    for (const name of ['SEO Estándar', 'SEO Premium']) {
      const link = page.getByRole('link', { name: `Consultar ${name}`, exact: false });
      await link.focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      assert.equal(await link.evaluate(el => el.matches(':focus-visible')), true);
      await page.keyboard.press('Enter');
      assert.equal(new URL(page.url()).hash, '#contacto-seo');
      assert.equal(await page.locator('form [name="plan"]').inputValue(), name);
    }
    assert.deepEqual(errors, []);
    results.push({ width, overflow: info.documentWidth !== width, axeViolations: axe.violations.length, vitalsLocalLab: info.vitals, errors });
    await context.close();
  }
  for (const options of [{ javaScriptEnabled: false }, { reducedMotion: 'reduce' }]) {
    const context = await createQAContext(browser, { viewport: { width: 390, height: 844 }, ...options });
    const page = await context.newPage();
    await page.goto(`${url}/seo-local/`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').count(), 1);
    await page.locator('.faq summary').first().click();
    assert.equal(await page.locator('.faq details').first().getAttribute('open'), '');
    assert.equal(await page.locator('.plan__button').count(), 2);
    await context.close();
  }
  const context = await createQAContext(browser, { viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  assert.equal(await page.title(), '7DStudio | Diseño web, SEO local y soluciones digitales');
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
  await context.close();
  const report = { results, failures, planLinks: 'native keyboard + selection in form; no submissions', homeLinks: 'real and projected cards', noJS: 'pass', reducedMotion: 'pass', featureLists: 'current lists rendered' };
  await writeFile(`${output}/qa.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  assert.deepEqual(failures, []);
} finally {
  await browser.close();
}
