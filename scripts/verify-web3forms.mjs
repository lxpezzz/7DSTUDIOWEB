// node scripts/verify-web3forms.mjs <QA node_modules> [preview URL]
// All submissions are intercepted. This script never sends a real email.
import assert from 'node:assert/strict';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createQAContext } from './qa-browser.mjs';

const modules = resolve(process.argv[2]);
const { chromium } = await import(pathToFileURL(join(modules, 'playwright/index.mjs')));
const url = process.argv[3] || 'http://127.0.0.1:4330';
const browser = await chromium.launch();

try {
  for (const path of ['/', '/contacto/', '/preguntas-frecuentes/', '/diseno-web/', '/seo-local/', '/productos/']) {
    const context = await createQAContext(browser, { reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let requests = 0;
    let payload = '';
    let mode = 'success';
    let release;
    let gate = Promise.resolve();
    await page.route('https://api.web3forms.com/**', async route => {
      requests++;
      payload = route.request().postDataBuffer()?.toString() || '';
      assert.equal(route.request().method(), 'POST');
      assert.equal(route.request().headers().accept, 'application/json');
      assert.match(route.request().headers()['content-type'], /^multipart\/form-data; boundary=/);
      await gate;
      if (mode === 'network') return route.abort('failed');
      if (mode === 'invalid-json') return route.fulfill({ status: 200, body: 'invalid json' });
      return route.fulfill({
        status: mode === 'http-error' ? 500 : 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: mode === 'success', message: '<img src=x onerror=alert(1)>' }),
      });
    });
    await page.goto(`${url}${path}`, { waitUntil: 'networkidle' });
    const form = page.locator('form');
    assert.equal(await form.count(), 1);
    await page.waitForFunction(() => document.querySelector('form')?.dataset.contactInitialized === 'true');
    const button = form.locator('button[type="submit"]');
    const feedback = form.locator('.contact__feedback');
    assert.equal(await form.getAttribute('data-configured'), 'true');
    assert.equal(await form.getAttribute('data-privacy-ready'), 'true');
    assert.equal(await button.isDisabled(), false, 'Estado activo actual; no acredita aprobación legal ni entrega real');

    // Browser-only fixture: enable a test form, without changing production gates.
    await form.evaluate(el => {
      el.dataset.privacyReady = 'true';
      el.dataset.configured = 'true';
      el.action = 'https://api.web3forms.com/submit';
      el.method = 'POST';
      el.querySelector('[name="privacy"]').disabled = false;
      el.querySelector('button[type="submit"]').disabled = false;
      const key = el.querySelector('[name="access_key"]');
      key.value = 'qa-only-not-a-real-key';
    });
    const fill = async () => {
      await form.locator('[name="name"]').fill('Prueba local de formulario');
      await form.locator('[name="email"]').fill('qa@example.invalid');
      await form.locator('[name="message"]').fill('Prueba interceptada: no enviar mensajes reales.');
      for (const select of await form.locator('select[required]').all()) {
        const value = await select.locator('option').evaluateAll(options => options.find(option => option.value)?.value);
        await select.selectOption(value);
      }
      const service = form.locator('[name="service"][type="radio"]');
      if (await service.count()) await service.first().check();
    };
    await fill();
    for (const gate of ['configured', 'privacyReady']) {
      await form.evaluate((el, gate) => { el.dataset[gate] = 'false'; }, gate);
      await form.evaluate(el => el.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })));
      assert.equal(requests, 0, `Bloqueo del handler: ${gate}`);
      await form.evaluate((el, gate) => { el.dataset[gate] = 'true'; }, gate);
    }
    await button.click();
    assert.equal(requests, 0, 'Consent is required');
    await form.locator('[name="privacy"]').check();
    await form.locator('[name="email"]').fill('invalid');
    await button.click();
    assert.equal(requests, 0, 'Native email validation');
    await form.locator('[name="email"]').fill('qa@example.invalid');
    await form.locator('[name="botcheck"]').evaluate(el => el.value = 'spam');
    await form.evaluate(el => el.requestSubmit());
    assert.equal(requests, 0, 'Honeypot');
    await form.locator('[name="botcheck"]').evaluate(el => el.value = '');

    if (path === '/diseno-web/') {
      await page.locator('[data-request-quote]').click();
      assert.ok(await form.locator('[name="budget_summary"]').inputValue());
    }
    if (path === '/seo-local/') {
      await page.locator('[data-seo-plan]').first().click();
      assert.ok(await form.locator('[name="plan"]').inputValue());
    }

    gate = new Promise(resolve => release = resolve);
    const request = page.waitForRequest('https://api.web3forms.com/submit');
    await button.click();
    await request;
    assert.equal(await button.isDisabled(), true);
    assert.equal(await button.getAttribute('aria-busy'), 'true');
    await form.evaluate(el => el.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })));
    assert.equal(requests, 1, 'Duplicate requests blocked');
    assert.match(payload, /name="access_key"\r\n\r\nqa-only-not-a-real-key/);
    assert.equal((payload.match(/name="access_key"/g) || []).length, 1, 'Una sola clave, nunca duplicar la existente');
    assert.match(payload, /name="privacy"\r\n\r\naccepted/);
    assert.match(payload, /name="source"/);
    assert.match(payload, /name="service"/);
    if (path === '/diseno-web/') assert.match(payload, /name="budget_summary"\r\n\r\nTipo de web:/);
    if (path === '/seo-local/') assert.match(payload, /name="plan"\r\n\r\n[^\r]/);
    if (path === '/productos/') assert.match(payload, /name="product"\r\n\r\n[^\r]/);
    release();
    gate = Promise.resolve();
    await feedback.filter({ hasText: 'Tu consulta se ha enviado.' }).waitFor();
    assert.equal(await form.locator('[name="name"]').inputValue(), '');
    assert.equal(await form.locator('[name="privacy"]').isChecked(), false);
    if (path === '/diseno-web/') assert.equal(await form.locator('[data-budget-selection]').isVisible(), false);

    for (const failure of ['http-error', 'api-error', 'invalid-json', 'network']) {
      mode = failure;
      await fill();
      await form.locator('[name="privacy"]').check();
      await button.click();
      await feedback.filter({ hasText: 'No hemos podido enviar' }).waitFor();
      assert.equal(await form.locator('[name="name"]').inputValue(), 'Prueba local de formulario');
      assert.equal(await button.isDisabled(), false);
      assert.equal(await feedback.locator('img').count(), 0, 'Provider content never inserted as HTML');
      assert.equal(await button.getAttribute('aria-busy'), null);
    }
    assert.deepEqual(errors, []);
    // Fixtures inactivas antes de inicializar: comprobar también el botón real.
    for (const attribute of ['data-configured', 'data-privacy-ready']) {
      const inactive = await context.newPage();
      await inactive.route(`${url}${path}`, async route => {
        const response = await route.fetch();
        const body = (await response.text()).replaceAll(`${attribute}="true"`, `${attribute}="false"`);
        await route.fulfill({ response, body });
      });
      await inactive.goto(`${url}${path}`, { waitUntil: 'networkidle' });
      await inactive.waitForFunction(() => document.querySelector('form')?.dataset.contactInitialized === 'true');
      assert.equal(await inactive.locator('form button[type="submit"]').isDisabled(), true);
      await inactive.locator('form').evaluate(el => el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
      await inactive.close();
    }
    console.log(path, 'OK: activo/inactivo, validación, payload único, éxito, errores, reset, antispam, duplicados');
    await context.close();
  }
  console.log('All six form pages verified. No real submissions or email delivery tests.');
} finally {
  await browser.close();
}
