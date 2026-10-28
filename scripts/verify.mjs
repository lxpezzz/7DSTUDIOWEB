// Herramientas de QA externas al bundle. Uso: node scripts/verify.mjs <carpeta-node_modules-QA> [URL]
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const tooling = resolve(process.argv[2]);
const { chromium } = await import(pathToFileURL(join(tooling, 'playwright/index.mjs')));
const { default: AxeBuilder } = await import(pathToFileURL(join(tooling, '@axe-core/playwright/dist/index.mjs')));
const url = process.argv[3] || 'http://127.0.0.1:4321';
const output = '.impeccable/review';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const errors = [];
const results = [];

try {
  for (const width of [360, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 960 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const layout = await page.evaluate(() => ({
      viewport: innerWidth,
      document: document.documentElement.scrollWidth,
      h1: document.querySelectorAll('h1').length,
      brokenAnchors: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(href => href.startsWith('/#') || href.startsWith('#')).filter(href => !document.getElementById(href.split('#')[1])),
      font: getComputedStyle(document.querySelector('h1')).fontFamily,
    }));
    assert.equal(layout.document, width, `Overflow en ${width}`);
    assert.equal(layout.h1, 1);
    assert.equal(layout.brokenAnchors.length, 0);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    const name = width === 1440 ? 'desktop' : width === 390 ? 'mobile' : `viewport-${width}`;
    await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
    if (width === 1440 || width === 390) {
      await page.screenshot({ path: `${output}/${name}-hero.png` });
    }
    results.push({ width, ...layout, accessibility: axe.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) })) });

    if (width === 390) {
      const toggle = page.getByRole('button', { name: 'Menú' });
      await toggle.click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      await toggle.click();
      await page.locator('#main-nav').getByRole('link', { name: 'Servicios' }).click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      await page.locator('#name').fill('Prueba de formulario');
      await page.locator('#email').fill('prueba@example.com');
      await page.locator('#message').fill('Prueba local, no enviar. Necesitamos una landing page.');
      await page.getByRole('button', { name: 'Hablemos de tu proyecto' }).click();
      await page.locator('.contact__continue').waitFor({ state: 'visible' });
      const destination = new URL(await page.locator('.contact__continue').getAttribute('href'));
      assert.equal(destination.hostname, 'wa.me');
      assert.ok(destination.searchParams.get('text').includes('Prueba de formulario'));
      assert.ok((await page.locator('.contact__feedback').innerText()).includes('todavía no se ha enviado'));
      await page.locator('#email').fill('invalido');
      assert.equal(await page.locator('#email').evaluate(input => input.checkValidity()), false);
    }
    await context.close();
  }

  const nojs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await nojs.goto(url);
  assert.ok(await nojs.locator('#main-nav a').first().isVisible());
  assert.ok(await nojs.locator('h1').isVisible());
  assert.ok(await nojs.locator('.contact__submit').isDisabled());
  await nojs.close();

  // Regenerar explícitamente para conservar los metadatos de procedencia existentes.
  if (process.argv.includes('--generate-og')) {
  // OG tipográfico propio. No es una fotografía ni una captura de proyecto.
  const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const font = await readFile('node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2');
  await og.setContent(`<style>@font-face{font-family:Geist;src:url(data:font/woff2;base64,${font.toString('base64')}) format('woff2');font-weight:100 900}*{box-sizing:border-box}body{margin:0;background:#f8f7f4;color:#171717;font-family:Geist;padding:52px 64px}.header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e3e1dc;padding-bottom:30px}.brand{font-weight:650;font-size:30px;letter-spacing:-1.4px}.meta{font-size:11px;letter-spacing:1px}h1{font-size:79px;font-weight:450;line-height:1.04;letter-spacing:-3px;margin:49px 0 36px}h1 span{color:#686868;font-size:65px}.bottom{border-top:1px solid #e3e1dc;padding-top:23px;display:flex;justify-content:space-between;font-size:13px;color:#686868}</style><div class="header"><span class="brand">7D STUDIO<sup style="font-size:12px">®</sup></span><span class="meta">ESTUDIO DIGITAL INDEPENDIENTE · CASTELLÓN</span></div><h1>Tu negocio,<br>mejor presentado.<br><span>Y más fácil de encontrar.</span></h1><div class="bottom"><span>Diseño web · SEO local · Soluciones digitales</span><span>7dstudio.es</span></div>`);
  await og.evaluate(() => document.fonts.ready);
  await og.screenshot({ path: 'public/og.png' });
  await og.close();
  }

  await writeFile(`${output}/qa.json`, JSON.stringify({ results, errors, interactions: 'Menú, Escape, cierre por enlace, validación email, preparación WhatsApp y fallback sin JavaScript: OK' }, null, 2));
  console.log(JSON.stringify({ results, errors, interactions: 'OK' }, null, 2));
  assert.equal(errors.length, 0, 'Errores de consola');
  assert.ok(results.every(result => result.accessibility.length === 0), 'Violaciones axe');
} finally {
  await browser.close();
}
