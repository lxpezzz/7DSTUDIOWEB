// node scripts/verify-cinematic.mjs <QA node_modules> [URL]
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import strictAssert from 'node:assert/strict';
const failures = [];
const check = fn => (...args) => { try { fn(...args); } catch (error) { failures.push(error.message); } };
const assert = new Proxy(strictAssert, { get: (target, key) => typeof target[key] === 'function' ? check(target[key]) : target[key] });
const modules = resolve(process.argv[2]);
const { chromium } = await import(pathToFileURL(join(modules, 'playwright/index.mjs')));
const { default: AxeBuilder } = await import(pathToFileURL(join(modules, '@axe-core/playwright/dist/index.mjs')));
const url = process.argv[3] || 'http://127.0.0.1:4330';
const output = '.impeccable/review/cinematic';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const errors = [];
const results = [];
async function settle(page) {
  await page.waitForTimeout(1450); // scrub de 1s y un frame de margen
}
async function dimensions(page) {
  return page.evaluate(() => {
    const stage = document.querySelector('.cinematic-hero__stage').getBoundingClientRect();
    const services = document.querySelector('main > .services-surface').getBoundingClientRect();
    const projection = document.querySelector('.cinematic-hero__projection').getBoundingClientRect();
    return { width: innerWidth, documentWidth: document.documentElement.scrollWidth,
      y: scrollY, stage: { top: stage.top, width: stage.width, height: stage.height },
      services: { top: services.top, height: services.height },
      projection: { top: projection.top, left: projection.left, width: projection.width, height: projection.height },
      pinned: !!document.querySelector('.pin-spacer'),
      complete: document.querySelector('.cinematic-hero').classList.contains('cinematic-complete') };
  });
}
async function scroll(page, y) {
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
  await settle(page);
}
try {
  for (const [width, height] of [[1440, 900], [1920, 1080], [1024, 768], [768, 1024], [390, 844], [360, 800]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    if (width >= 768) await page.waitForSelector('.cinematic-ready');
    await settle(page);
    const initial = await dimensions(page);
    assert.equal(initial.width, initial.documentWidth);
    assert.equal(await page.locator('h1').count(), 1);
    if (width >= 768) {
      const collisions = await page.evaluate(() => {
        const bounds = document.querySelector('.cinematic-hero__projection').getBoundingClientRect();
        const collisions = [];
        for (const element of document.querySelectorAll('.cinematic-hero__copy h1, .cinematic-hero__copy p, .cinematic-hero__copy .button')) {
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          const range = document.createRange();
          while (walker.nextNode()) {
            if (!walker.currentNode.textContent.trim()) continue;
            range.selectNodeContents(walker.currentNode);
            for (const rect of range.getClientRects()) {
              if (rect.right > bounds.left && rect.left < bounds.right && rect.bottom > bounds.top && rect.top < bounds.bottom) collisions.push(walker.currentNode.textContent);
            }
          }
        }
        return collisions;
      });
      assert.deepEqual(collisions, [], `Textos sobre la pantalla a ${width}px: ${collisions.join(', ')}`);
    }
    const duplicates = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    });
    assert.deepEqual(duplicates, []);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    assert.deepEqual(axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), []);
    await page.screenshot({ path: `${output}/${width}-0.png` });
    const checkpoints = [];
    if (width >= 768) {
      assert.equal(initial.pinned, true);
      assert.ok(Math.abs(initial.services.top - height * 2) < 2, 'Posición semántica de Servicios');
      const percentages = width === 1440 ? [.15, .30, .45, .60, .75, .95, 1, 1.12] : [.60, .95, 1];
      let projected;
      for (const progress of percentages) {
        await scroll(page, height * 2 * progress);
        const result = await dimensions(page);
        result.registrationError = await page.evaluate(() => {
          const photo = document.querySelector('.cinematic-hero__photo');
          const image = photo.querySelector('img');
          const projection = document.querySelector('.cinematic-hero__projection');
          const scale = Math.max(photo.clientWidth / 1672, photo.clientHeight / 941);
          const [px, py] = getComputedStyle(image).objectPosition.split(' ').map(v => parseFloat(v) / 100);
          const offsetX = (photo.clientWidth - 1672 * scale) * px;
          const offsetY = (photo.clientHeight - 941 * scale) * py;
          const source = [[592,382],[1035,374],[1080,676],[632,700]];
          const rect = [[0,0],[projection.clientWidth,0],[projection.clientWidth,projection.clientHeight],[0,projection.clientHeight]];
          const camera = new DOMMatrix(getComputedStyle(photo).transform);
          const screen = new DOMMatrix(getComputedStyle(projection).transform);
          return Math.max(...source.map(([x,y], i) => {
            const a = new DOMPoint(x*scale+offsetX,y*scale+offsetY).matrixTransform(camera);
            const b = new DOMPoint(...rect[i]).matrixTransform(screen);
            return Math.hypot(a.x/a.w+photo.offsetLeft-b.x/b.w, a.y/a.w+photo.offsetTop-b.y/b.w);
          }));
        });
        // getComputedStyle serializa matrix3d con precisión limitada; tolerancia subpíxel.
        assert.ok(result.registrationError < .5, `Registro foto/HTML a ${width}px y ${progress}: ${result.registrationError}`);
        assert.equal(result.width, result.documentWidth);
        if (progress >= .75 && progress < 1) {
          assert.ok(Math.abs(result.projection.width - width) < 2);
          assert.ok(Math.abs(result.projection.height - height) < 2);
          assert.ok(Math.abs(result.projection.top) < 2);
          assert.ok(Math.abs(result.projection.left) < 2);
        }
        const capture = await page.screenshot({ path: `${output}/${width}-${Math.round(progress * 100)}.png` });
        if (progress === .95) projected = capture.toString('base64');
        if (progress === 1) {
          assert.ok(result.complete);
          assert.ok(Math.abs(result.services.top) < 2);
          result.handoff = await page.evaluate(async ({ before, after }) => {
            const load = src => new Promise(resolve => { const img = new Image(); img.onload = () => resolve(img); img.src = `data:image/png;base64,${src}`; });
            const [a, b] = await Promise.all([load(before), load(after)]);
            const canvas = document.createElement('canvas'); canvas.width = a.width; canvas.height = a.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(a, 0, 0); const aa = ctx.getImageData(0, 0, a.width, a.height).data;
            ctx.drawImage(b, 0, 0); const bb = ctx.getImageData(0, 0, a.width, a.height).data;
            let changed = 0, difference = 0;
            for (let i = 0; i < aa.length; i += 4) {
              const delta = Math.abs(aa[i] - bb[i]) + Math.abs(aa[i+1] - bb[i+1]) + Math.abs(aa[i+2] - bb[i+2]);
              difference += delta; if (delta > 15) changed++;
            }
            return { changedRatio: changed / (a.width * a.height), meanChannelDifference: difference / (a.width * a.height * 3) };
          }, { before: projected, after: capture.toString('base64') });
          assert.ok(result.handoff.changedRatio < .01, `Salto visual: ${JSON.stringify(result.handoff)}`);
        }
        checkpoints.push({ progress, ...result });
      }
      await scroll(page, height * 2 + 120);
      assert.ok(Math.abs((await dimensions(page)).services.top + 120) < 2, 'Scroll natural después del pin');
      await scroll(page, height * .9);
      const reverse = await dimensions(page);
      assert.equal(reverse.complete, false);
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForSelector('.cinematic-ready');
      await settle(page);
      const restored = await dimensions(page);
      assert.ok(Math.abs(restored.y - height * .9) < 3, 'Restauración del scroll');
      assert.ok(Math.abs(restored.projection.width - reverse.projection.width) < 3, 'Restauración del encuadre');
      await page.setViewportSize({ width: 390, height: 844 });
      await settle(page);
      assert.equal((await dimensions(page)).pinned, false, 'Limpieza al cambiar a móvil');
    } else {
      assert.equal(initial.pinned, false);
      assert.ok(await page.locator('.cinematic-hero__copy').isVisible());
      assert.ok(await page.locator('.cinematic-hero__photo img').isVisible());
      const requests = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name));
      assert.equal(requests.some(name => /ScrollTrigger|gsap/i.test(name)), false, 'Móvil sin descarga de GSAP');
    }
    results.push({ width, height, initial, checkpoints, accessibilityViolations: 0 });
    await context.close();
  }
  for (const options of [{ reducedMotion: 'reduce' }, { javaScriptEnabled: false }]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, ...options });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await settle(page);
    assert.equal(await page.locator('.pin-spacer').count(), 0);
    assert.ok(await page.locator('h1').isVisible());
    await page.screenshot({ path: `${output}/${options.reducedMotion ? 'reduced' : 'nojs'}-hero.png` });
    await page.locator('#servicios').scrollIntoViewIfNeeded();
    assert.ok(await page.locator('#services-title').isVisible());
    await page.screenshot({ path: `${output}/${options.reducedMotion ? 'reduced' : 'nojs'}.png` });
    await page.close();
  }
  assert.deepEqual(errors, []);
  await writeFile(`${output}/qa.json`, JSON.stringify({ results, errors, failures, reducedMotion: 'static', noJavaScript: 'visible' }, null, 2));
  console.log(JSON.stringify({ viewports: results.map(r => [r.width, r.height]), handoffs: results.flatMap(r => r.checkpoints.filter(c => c.handoff).map(c => ({ width: r.width, ...c.handoff }))), errors, failures }, null, 2));
  strictAssert.deepEqual(failures, []);
} finally { await browser.close(); }
