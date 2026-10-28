// node scripts/verify-service-links.mjs <QA node_modules> [URL]
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { services, getServiceHref } from '../src/data/services.ts';
const { chromium } = await import(pathToFileURL(join(resolve(process.argv[2]), 'playwright/index.mjs')));
const url = process.argv[3] || 'http://127.0.0.1:4330';
const output = '.impeccable/review/service-links';
await mkdir(output, { recursive: true });
assert.deepEqual(services.map(service => service.route), ['/diseno-web/', '/seo-local/', '/productos/']);
for (const service of services) {
  const page = `../../pages/${service.route.slice(1, -1)}.astro`;
  assert.equal(getServiceHref(service, [page]), service.published ? service.route : undefined);
  assert.equal(getServiceHref({ ...service, published: true }, []), undefined);
  assert.equal(getServiceHref({ ...service, published: true }, [page]), service.route);
}
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    if (width >= 768) await page.waitForSelector('.cinematic-ready');
    if (width >= 768) {
      await page.evaluate(() => scrollTo({ top: innerHeight * 1.5, behavior: 'instant' }));
      await page.waitForTimeout(350);
    }
    const cards = page.locator('#servicios .service-card');
    assert.equal(await cards.count(), 3);
    for (let index = 0; index < 3; index++) {
      const card = cards.nth(index);
      assert.equal(await card.evaluate(el => el.tagName), 'A');
      assert.equal(await card.getAttribute('href'), services[index].published ? services[index].route : '#contacto');
      assert.equal(await card.locator('a, button, input, [tabindex]').count(), 0);
      assert.equal(await card.locator('.service-card__cta').textContent().then(text => text.trim()), ['Consultar diseño web', 'Ver SEO local', 'Consultar productos'][index]);
      assert.equal(await card.evaluate(el => getComputedStyle(el).cursor), 'pointer');
      assert.equal(await card.evaluate(el => !!el.closest('[inert]')), false);
      for (const selector of ['.service-card__scene', 'h3', '.service-card__description', '.service-card__tags', '.service-card__cta', null]) {
        if (width >= 768) {
          await page.evaluate(() => scrollTo({ top: innerHeight * 1.5, behavior: 'instant' }));
          await page.waitForTimeout(1200);
        }
        await card.scrollIntoViewIfNeeded();
        if (selector) await card.locator(selector).click();
        else await card.click({ position: { x: 12, y: 12 } });
        await page.waitForTimeout(1000);
        if (services[index].published) {
          assert.equal(new URL(page.url()).pathname, services[index].route);
          await page.goto(url, { waitUntil: 'networkidle' });
          if (width >= 768) {
            await page.evaluate(() => scrollTo({ top: innerHeight * 1.5, behavior: 'instant' }));
            await page.waitForTimeout(350);
          }
          continue;
        }
        assert.equal(new URL(page.url()).hash, '#contacto');
        assert.ok(await page.locator('#contact-title').evaluate(el => {
          const r = el.getBoundingClientRect();
          return r.top >= document.querySelector('.header').getBoundingClientRect().bottom - 1 && r.top < innerHeight;
        }), 'El enlace debe desplazar al contacto real');
      }
    }
    if (width >= 768) {
      await page.evaluate(() => scrollTo({ top: innerHeight * 1.5, behavior: 'instant' }));
      await page.waitForTimeout(1200);
    }
    await page.locator('#servicios .section-cta a').focus();
    for (const index of [2, 1, 0]) {
      await page.keyboard.press('Shift+Tab');
      assert.ok(await cards.nth(index).evaluate(el => document.activeElement === el && el.matches(':focus-visible')));
      assert.equal(await cards.nth(index).evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
    }
    await page.waitForTimeout(1000);
    assert.ok(await cards.first().evaluate(el => {
      const r = el.getBoundingClientRect();
      const header = document.querySelector('.header').getBoundingClientRect();
      const y = Math.max(header.bottom + 8, r.top + 8);
      return y < Math.min(innerHeight, r.bottom) && document.elementFromPoint(r.x + r.width / 2, y)?.closest('#servicios .service-card') === el;
    }), 'El foco de la tarjeta debe verse en la sección real, no detrás de la proyección');
    await page.screenshot({ path: `${output}/${width}-focus.png` });
    await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash, '#contacto');
    assert.equal(await page.locator('.cinematic-hero__projection a, .cinematic-hero__projection button').count(), 0);
    assert.deepEqual(errors, []);
    results.push({ width, wholeCardZones: 'scene, title, description, tags, CTA, padding', keyboard: 'pass', nestedControls: 0, errors });
    await page.close();
  }
  await writeFile(`${output}/qa.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
