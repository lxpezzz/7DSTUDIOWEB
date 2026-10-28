// node scripts/verify-contact.mjs <QA node_modules> [URL]
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const modules = resolve(process.argv[2]);
const { chromium } = await import(pathToFileURL(join(modules, 'playwright/index.mjs')));
const { default: AxeBuilder } = await import(pathToFileURL(join(modules, '@axe-core/playwright/dist/index.mjs')));
const url = process.argv[3] || 'http://127.0.0.1:4330';
const output = '.impeccable/review/contact';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${url}/#contacto`, { waitUntil: 'networkidle' });
    await page.locator('.contact__symbol img').evaluate(el => el.decode());
    await page.waitForTimeout(250);
    const layout = await page.locator('#contacto').evaluate(el => {
      const box = selector => el.querySelector(selector).getBoundingClientRect().toJSON();
      return { width: innerWidth, documentWidth: document.documentElement.scrollWidth,
        left: box('.contact__identity'), right: box('.contact__form-panel'),
        image: box('img'), loaded: el.querySelector('img').naturalWidth > 0,
        ready: el.querySelector('form').dataset.configured === 'true', policyReady: el.querySelector('form').dataset.privacyReady === 'true',
        animations: el.getAnimations({ subtree: true }).length };
    });
    assert.equal(layout.documentWidth, width);
    assert.ok(layout.loaded);
    assert.ok(Math.abs(layout.image.width / layout.image.height - 1024 / 1145) < .002, 'Proporción original con redondeo de derivados WebP');
    if (width >= 768) {
      assert.ok(Math.abs(layout.left.height - layout.right.height) < 1);
      assert.ok(Math.abs(layout.left.width / (layout.left.width + layout.right.width) - .4) < .001);
    } else assert.ok(layout.left.bottom <= layout.right.top + 1);
    assert.equal(layout.animations, 0);
    assert.equal(await page.locator('form').count(), 1);
    assert.equal(await page.locator('.final-cta').count(), 0);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.contact__whatsapp').getAttribute('href'), 'https://wa.me/34621200800');
    assert.equal(await page.locator('[name="privacy"]').getAttribute('required'), '');
    if (!layout.policyReady) {
      assert.ok(await page.locator('.contact__submit').isDisabled());
      assert.equal(await page.locator('.contact__privacy a').count(), 0);
    }
    const colors = ['rgb(233, 223, 209)', 'rgb(220, 226, 213)', 'rgb(233, 222, 229)', 'rgb(232, 230, 226)'];
    for (let index = 0; index < 4; index++) {
      await page.locator('.contact__chip').nth(index).click();
      await page.waitForTimeout(200);
      assert.equal(await page.locator('[name="service"]:checked').count(), 1);
      const chips = await page.locator('.contact__chip > span').evaluateAll(els => els.map(el => ({ background: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color })));
      assert.equal(chips[index].background, colors[index]);
      assert.ok(chips.every((chip, i) => chip.color === 'rgb(27, 27, 27)' && (i === index || chip.background === 'rgb(255, 255, 255)')));
    }
    await page.locator('[name="service"]').first().focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('[name="service"]:checked').inputValue(), 'SEO local');
    assert.equal(await page.locator('[name="service"]:checked').evaluate(el => el.matches(':focus-visible')), true);
    const axe = await new AxeBuilder({ page }).include('#contacto').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    assert.deepEqual(axe.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), []);
    await page.locator('#contacto').screenshot({ path: `${output}/${width}.png` });
    assert.deepEqual(errors, []);
    results.push({ ...layout, axe: 0, errors });
    await context.close();
  }

  // QA fixture only: use a dummy public key and intercept every provider request.
  // This validates the real submit handler, not real email delivery.
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  let requests = 0, payload = '', mode = 'success', release;
  let gate = Promise.resolve();
  await page.route('https://api.web3forms.com/submit', async route => {
    requests++;
    payload = route.request().postDataBuffer().toString();
    await gate;
    if (mode === 'network') return route.abort('failed');
    await route.fulfill({ status: mode === 'error' ? 500 : 200, contentType: 'application/json', body: JSON.stringify({ success: mode === 'success' }) });
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  const form = page.locator('.contact__form');
  const privacy = page.locator('[name="privacy"]');
  const button = page.locator('.contact__submit');
  if (!(await form.getAttribute('data-privacy-ready') === 'true')) {
    await form.evaluate(el => el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    assert.equal(requests, 0, 'Nunca enviar sin política publicada');
  }
  await form.evaluate(el => {
    el.dataset.privacyReady = 'true';
    el.dataset.configured = 'true';
    el.action = 'https://api.web3forms.com/submit';
    el.querySelector('[name="privacy"]').disabled = false;
    el.querySelector('button[type="submit"]').disabled = false;
    let key = el.querySelector('[name="access_key"]');
    if (!key) { key = document.createElement('input'); key.type = 'hidden'; key.name = 'access_key'; el.append(key); }
    key.value = 'qa-only-not-a-real-key';
  });
  const fill = async () => {
    await page.locator('[name="service"][value="Productos QR/NFC"]').check();
    await page.locator('#name').fill('Prueba de contacto');
    await page.locator('#email').fill('qa@example.invalid');
    await page.locator('#message').fill('Prueba local de selección de servicio y consentimiento.');
  };
  await fill();
  await button.click();
  assert.equal(requests, 0, 'Consentimiento obligatorio');
  await privacy.check();
  await page.locator('#email').fill('email-invalido');
  await button.click();
  assert.equal(requests, 0, 'Validación de correo');
  await page.locator('#email').fill('qa@example.invalid');
  await page.locator('[name="botcheck"]').evaluate(el => el.value = 'spam');
  await form.evaluate(el => el.requestSubmit());
  assert.equal(requests, 0, 'Honeypot preservado');
  await page.locator('[name="botcheck"]').evaluate(el => el.value = '');
  gate = new Promise(resolve => release = resolve);
  const request = page.waitForRequest('https://api.web3forms.com/submit');
  await button.click();
  await request;
  assert.ok(await button.isDisabled());
  assert.equal(await button.getAttribute('aria-busy'), 'true');
  await form.evaluate(el => el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  assert.equal(requests, 1, 'Sin envíos duplicados');
  assert.match(payload, /name="service"\r\n\r\nProductos QR\/NFC/);
  assert.match(payload, /name="privacy"\r\n\r\naccepted/);
  release();
  await page.locator('.contact__feedback').filter({ hasText: 'Tu consulta se ha enviado.' }).waitFor();
  assert.equal(await page.locator('#name').inputValue(), '');
  assert.equal(await privacy.isChecked(), false);
  gate = Promise.resolve();
  for (const failure of ['error', 'network']) {
    mode = failure;
    await fill();
    await privacy.check();
    await button.click();
    await page.locator('.contact__feedback').filter({ hasText: 'No hemos podido enviar' }).waitFor();
    assert.equal(await page.locator('#name').inputValue(), 'Prueba de contacto');
    assert.equal(await button.isDisabled(), false);
  }
  // Existing WhatsApp fallback must include the new service field.
  await form.evaluate(el => { el.dataset.configured = 'false'; el.action = 'https://wa.me/34621200800'; });
  await button.click();
  await page.locator('.contact__continue').waitFor({ state: 'visible' });
  assert.match(new URL(await page.locator('.contact__continue').getAttribute('href')).searchParams.get('text'), /Servicio: Productos QR\/NFC/);
  await page.close();
  const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await noJS.goto(`${url}/#contacto`, { waitUntil: 'networkidle' });
  assert.ok(await noJS.locator('.contact__whatsapp').isVisible());
  assert.ok(await noJS.locator('.contact__submit').isDisabled());
  await noJS.close();
  const report = { results, simulatedWeb3Forms: 'success, HTTP error, network error, validation, consent, antispam, duplicate prevention', fallback: 'service included', realDelivery: 'not tested: requires published privacy policy and configured key' };
  await writeFile(`${output}/qa.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ widths: results.map(r => r.width), ...report, results: undefined }, null, 2));
} finally { await browser.close(); }
