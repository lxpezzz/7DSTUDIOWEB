// Prueba aislada con respuestas simuladas, sin enviar información a Web3Forms.
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { createQAContext } from './qa-browser.mjs';

const { chromium } = await import(pathToFileURL(join(resolve(process.argv[2]), 'playwright/index.mjs')));
const browser = await chromium.launch();
try {
  const context = await createQAContext(browser);
  const page = await context.newPage();
  let mode = 'error';
  await page.route('https://api.web3forms.com/**', route => route.fulfill({
    status: mode === 'error' ? 500 : 200, contentType: 'application/json', body: JSON.stringify({ success: mode === 'success' }),
  }));
  await page.goto(process.argv[3] || 'http://127.0.0.1:4330');
  await page.evaluate(() => {
    const form = document.querySelector('.contact__form');
    form.dataset.configured = 'true';
    form.action = 'https://api.web3forms.com/submit';
  });
  await page.locator('[name="service"][type="radio"]').first().check();
  await page.locator('#name').fill('Prueba local');
  await page.locator('#email').fill('prueba@example.com');
  await page.locator('#message').fill('Solo una prueba interceptada, sin envío externo.');
  await page.locator('[name="privacy"]').check();
  await page.locator('.contact__submit').click();
  await page.getByRole('status').filter({ hasText: 'No hemos podido' }).waitFor();
  assert.equal(await page.locator('#name').inputValue(), 'Prueba local');
  assert.equal(await page.locator('.contact__submit').isEnabled(), true);
  mode = 'success';
  await page.locator('.contact__submit').click();
  await page.getByRole('status').filter({ hasText: 'Tu consulta se ha enviado' }).waitFor();
  assert.equal(await page.locator('#name').inputValue(), '');
  assert.equal(await page.locator('.contact__submit').isEnabled(), true);
  console.log('Estados de error, conservación de datos, reintento, éxito y reset: OK (API simulada, no envío real).');
} finally {
  await browser.close();
}
