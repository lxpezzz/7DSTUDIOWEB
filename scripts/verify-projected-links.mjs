// node scripts/verify-projected-links.mjs <QA node_modules> [URL]
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const modules = resolve(process.argv[2]);
const { chromium } = await import(pathToFileURL(join(modules, 'playwright/index.mjs')));
const { default: AxeBuilder } = await import(pathToFileURL(join(modules, '@axe-core/playwright/dist/index.mjs')));
const url = process.argv[3] || 'http://127.0.0.1:4330';
const output = '.impeccable/review/projected-links';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
const settle = page => page.waitForTimeout(350);
async function at(page, progress) {
  await page.evaluate(progress => {
    history.replaceState(null, '', location.pathname);
    scrollTo({ top: innerHeight * 1.5 * progress, behavior: 'instant' });
  }, progress);
  await settle(page);
}
async function point(page, index, fx = .5, fy = .5) {
  return page.locator('.cinematic-hero__interaction a').nth(index).evaluate((el, { fx, fy }) => {
    const plane = el.parentElement;
    const x = parseFloat(el.style.left), y = parseFloat(el.style.top);
    const w = parseFloat(el.style.width), h = Math.min(parseFloat(el.style.height), plane.clientHeight - y);
    const p = new DOMPoint(x + w * fx, y + h * fy).matrixTransform(new DOMMatrix(getComputedStyle(plane).transform));
    const bounds = document.querySelector('.cinematic-hero__stage').getBoundingClientRect();
    let inside = true;
    if (plane.style.clipPath.startsWith('polygon(')) {
      const polygon = plane.style.clipPath.slice(8, -1).split(',').map(pair => pair.trim().split(/\s+/).map(parseFloat));
      const path = new Path2D();
      polygon.forEach(([x, y], index) => index ? path.lineTo(x, y) : path.moveTo(x, y));
      path.closePath();
      inside = document.createElement('canvas').getContext('2d').isPointInPath(path, x + w * fx, y + h * fy);
    }
    return { x: p.x / p.w + bounds.x, y: p.y / p.w + bounds.y, inside };
  }, { fx, fy });
}
try {
  for (const [width, height] of [[1440, 900], [1920, 1080], [1024, 768], [768, 1024], [390, 844], [360, 800]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      window.serviceEvents = [];
      document.addEventListener('click', event => {
        const card = event.target.closest('a[data-service]');
        if (card) window.serviceEvents.push({ service: card.dataset.service, projected: !!card.closest('.cinematic-hero__interaction'), trusted: event.isTrusted });
        // Keep this lifecycle test on the home. Real SEO navigation is covered by verify-seo-local.mjs.
        if (card?.getAttribute('href') === '/seo-local/') {
          window.seoDestination = card.getAttribute('href');
          event.preventDefault();
        }
      });
    });
    await page.goto(url, { waitUntil: 'networkidle' });
    if (width >= 768) await page.waitForSelector('.cinematic-ready');
    await settle(page);
    const links = page.locator('.cinematic-hero__interaction a');
    const real = page.locator('#servicios a.service-card');
    if (width >= 1024) {
      assert.equal(await links.count(), 3);
      assert.equal(await links.first().evaluate(el => !!el.closest('[aria-hidden="true"], [inert]')), false);
      assert.equal(await real.first().evaluate(el => !!el.closest('[inert]')), true);
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      assert.deepEqual(axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), []);
      for (const [progress, index] of [[0, 0], [.25, 1], [.5, 2], [.9, 0]]) {
        await at(page, progress);
        assert.equal(await page.locator('.cinematic-hero__interaction').evaluate(el => el.style.transform === document.querySelector('.cinematic-hero__projection').style.transform), true);
        // Native hit-testing across the surface, not an artificial dispatchEvent.
        for (const [fx, fy] of [[.05, .05], [.95, .05], [.5, .5], [.05, .95], [.95, .95]]) {
          const p = await point(page, index, fx, fy);
          assert.equal(await links.nth(index).evaluate((el, p) => document.elementFromPoint(p.x, p.y) === el, p), p.inside, `Intercepción o máscara ${width}px, progreso ${progress}, tarjeta ${index}, punto ${fx}/${fy}`);
        }
        const p = await point(page, index);
        if (width === 1440) await page.screenshot({ path: `${output}/${width}-${Math.round(progress * 100)}.png` });
        await page.mouse.click(p.x, p.y);
        await page.waitForTimeout(1000);
        const events = await page.evaluate(() => window.serviceEvents);
        assert.deepEqual(events.at(-1), { service: ['diseno-web', 'seo-local', 'productos-fisicos'][index], projected: true, trusted: true });
        if (index === 1) assert.equal(await page.evaluate(() => window.seoDestination), '/seo-local/');
        else {
          assert.equal(new URL(page.url()).hash, '#contacto');
          assert.ok(await page.locator('#contact-title').evaluate(el => el.getBoundingClientRect().top < innerHeight && el.getBoundingClientRect().bottom > 0));
        }
      }
      await at(page, .5); // Reverse after navigating to Contacto.
      assert.equal(await links.first().isVisible(), true);
      await links.first().focus();
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      for (const index of [0, 1, 2]) {
        if (index) await page.keyboard.press('Tab');
        assert.ok(await links.nth(index).evaluate(el => document.activeElement === el && el.matches(':focus-visible')));
      }
      await page.screenshot({ path: `${output}/${width}-focus.png` });
      // Completion and reverse must move focus to the equivalent active link.
      await at(page, 1);
      assert.ok(await real.nth(2).evaluate(el => document.activeElement === el && !el.closest('[inert]')));
      assert.equal(await links.first().isVisible(), false);
      assert.equal(await page.locator('.cinematic-hero__projection').evaluate(el => el.hidden && getComputedStyle(el).display === 'none'), true);
      await at(page, .5);
      assert.ok(await links.nth(2).evaluate(el => document.activeElement === el && !el.closest('[inert]')));
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      assert.equal(new URL(page.url()).hash, '#contacto');
      await at(page, .25);
      const before = await page.evaluate(() => scrollY);
      const p = await point(page, 1);
      await page.mouse.move(p.x, p.y);
      await page.mouse.wheel(0, 90);
      await settle(page);
      assert.ok(await page.evaluate(y => scrollY > y, before), 'El enlace no bloquea wheel');
      await at(page, 1.1);
      await page.reload({ waitUntil: 'networkidle' });
      await settle(page);
      assert.equal(await links.first().isVisible(), await page.evaluate(() => scrollY < innerHeight * 1.5), 'Tras recargar la capa activa debe seguir el scroll restaurado por el navegador');
      await at(page, 1.1);
      await page.setViewportSize({ width: width - 24, height: height - 20 });
      await settle(page);
      await at(page, .5);
      assert.equal(await links.first().isVisible(), width - 24 >= 1024);
      await page.setViewportSize({ width, height });
      await settle(page);
      await at(page, 1);
    } else {
      assert.equal(await page.locator('.cinematic-hero__interaction').isVisible(), false);
      if (width < 768) {
        assert.equal(await links.count(), 0);
        assert.equal(await page.locator('.cinematic-hero__photo').isVisible(), false);
      }
      assert.equal(await real.first().evaluate(el => !!el.closest('[inert]')), false);
      if (width >= 768) await at(page, 1);
    }
    for (let index = 0; index < 3; index++) {
      if (width >= 768) await at(page, 1);
      await real.nth(index).scrollIntoViewIfNeeded();
      await real.nth(index).locator('h3').click();
      await page.waitForTimeout(1000);
      if (index === 1) assert.equal(await page.evaluate(() => window.seoDestination), '/seo-local/');
      else assert.equal(new URL(page.url()).hash, '#contacto');
    }
    await page.goto(`${url}/#servicios`, { waitUntil: 'networkidle' });
    await settle(page);
    if (width >= 768) assert.equal(await page.locator('.cinematic-hero').evaluate(el => el.classList.contains('cinematic-complete')), true, 'Ancla directa entrega HTML real');
    assert.equal(await real.first().evaluate(el => !!el.closest('[inert]')), false);
    if (width === 390) await page.screenshot({ path: `${output}/390-native.png` });
    assert.deepEqual(errors, []);
    results.push({ width, height, projected: width >= 1024, realLinks: 'pass', errors });
    await context.close();
  }
  for (const options of [{ reducedMotion: 'reduce' }, { javaScriptEnabled: false }]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, ...options });
    await page.goto(url, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.cinematic-hero__interaction a').count(), 0);
    await page.locator('#servicios a.service-card').first().click();
    assert.equal(new URL(page.url()).hash, '#contacto');
    await page.close();
  }
  const page = await browser.newPage();
  const routes = [];
  for (const route of ['/diseno-web/', '/seo-local/', '/productos/']) routes.push({ route, status: (await page.request.get(`${url}${route}`)).status() });
  await page.close();
  await writeFile(`${output}/qa.json`, JSON.stringify({ results, routes, reducedMotion: 'native links', noJS: 'native links' }, null, 2));
  console.log(JSON.stringify({ results, routes }, null, 2));
} finally { await browser.close(); }
