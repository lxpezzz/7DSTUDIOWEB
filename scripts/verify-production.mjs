// QA local de preparación: NO ejecuta .htaccess ni contacta con producción.
import assert from 'node:assert/strict';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { loadQATools, createQAContext, qaURL } from './qa-browser.mjs';
import { webCare, webCareTerms, webOwnership } from '../src/data/webPricing.ts';

const output = '.impeccable/review/phase4';
await mkdir(output, { recursive: true });
const { chromium, AxeBuilder } = await loadQATools();
const browser = await chromium.launch();
const legalRoutes = ['/aviso-legal/', '/politica-de-privacidad/', '/politica-de-cookies/', '/condiciones-de-contratacion/'];
const routes = ['/', '/diseno-web/', '/seo-local/', '/productos/', '/quienes-somos/', '/preguntas-frecuentes/', '/contacto/', ...legalRoutes, '/demos/huella/', '/404.html'];
const results = [];
const responsive = [];
const resourceCache = new Set();

try {
  const context = await createQAContext(browser, { reducedMotion: 'reduce', viewport: { width: 1440, height: 960 } });
  const page = await context.newPage();
  const titles = new Set();
  const descriptions = new Set();
  for (const route of routes) {
    const response = await page.goto(`${qaURL}${route}`, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200, route);
    const metadata = await page.evaluate(() => {
      const meta = selector => document.querySelector(selector)?.getAttribute('content');
      return {
        title: document.title,
        description: meta('meta[name="description"]'),
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        robots: meta('meta[name="robots"]') || '',
        ogTitle: meta('meta[property="og:title"]'),
        ogDescription: meta('meta[property="og:description"]'),
        ogUrl: meta('meta[property="og:url"]'),
        ogImage: meta('meta[property="og:image"]'),
        twitterTitle: meta('meta[name="twitter:title"]'),
        twitterDescription: meta('meta[name="twitter:description"]'),
        twitterImage: meta('meta[name="twitter:image"]'),
        schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent)),
        resources: [...document.querySelectorAll('img[src], script[src], link[rel="stylesheet"], link[rel="icon"], link[rel="preload"]')].map(el => el.src || el.href),
        forms: [...document.querySelectorAll('form')].map(form => ({ action: form.action, method: form.method, honeypots: form.querySelectorAll('[name="botcheck"]').length, consent: form.querySelector('[name="privacy"]')?.required, keys: form.querySelectorAll('[name="access_key"]').length })),
      };
    });
    assert.ok(metadata.title && metadata.description, route);
    assert.ok(!titles.has(metadata.title), `Título duplicado: ${route}`);
    assert.ok(!descriptions.has(metadata.description), `Descripción duplicada: ${route}`);
    titles.add(metadata.title);
    descriptions.add(metadata.description);
    assert.equal(await page.locator('h1').count(), 1, route);
    assert.equal(metadata.canonical, `https://7dstudio.es${route}`);
    assert.equal(metadata.ogUrl, metadata.canonical);
    assert.equal(metadata.ogTitle, metadata.title);
    assert.equal(metadata.ogDescription, metadata.description);
    assert.equal(metadata.twitterTitle, metadata.title);
    assert.equal(metadata.twitterDescription, metadata.description);
    assert.equal(new URL(metadata.twitterImage).origin, 'https://7dstudio.es');
    assert.equal(/noindex/.test(metadata.robots), legalRoutes.includes(route) || route.startsWith('/demos/') || route === '/404.html');
    assert.ok(metadata.schema.every(schema => schema['@type'] && schema['@context']));
    for (const form of metadata.forms) {
      assert.equal(form.action, 'https://api.web3forms.com/submit');
      assert.equal(form.method, 'post');
      assert.equal(form.honeypots, 1);
      assert.equal(form.consent, true);
      assert.equal(form.keys, 1);
    }
    assert.equal(new URL(metadata.ogImage).origin, 'https://7dstudio.es');
    for (const resource of [...metadata.resources, new URL(metadata.ogImage).pathname, new URL(metadata.twitterImage).pathname]) {
      const url = new URL(resource, qaURL);
      if (!['https://7dstudio.es', new URL(qaURL).origin].includes(url.origin)) continue;
      const localURL = new URL(url.pathname, qaURL).href;
      if (resourceCache.has(localURL)) continue;
      const asset = await page.request.get(localURL);
      assert.equal(asset.status(), 200, `Recurso: ${localURL}`);
      const mime = asset.headers()['content-type'] || '';
      if (/\.css$/.test(url.pathname)) assert.match(mime, /^text\/css/);
      if (/\.m?js$/.test(url.pathname)) assert.match(mime, /^(text|application)\/javascript/);
      if (/\.woff2$/.test(url.pathname)) assert.match(mime, /^(font\/woff2|application\/font-woff2)/);
      if (/\.svg$/.test(url.pathname)) assert.match(mime, /^image\/svg\+xml/);
      resourceCache.add(localURL);
    }
    if (route === '/condiciones-de-contratacion/') {
      const text = await page.locator('main').innerText();
      for (const value of [webCare.maintenance.priceLabel, webOwnership.domain, webOwnership.continuity, webOwnership.handover]) assert.ok(text.includes(value), value);
      assert.ok(!/Falta confirmar.*IVA|pendientes de confirmar el inicio/s.test(text));
    }
    if (['/diseno-web/', '/preguntas-frecuentes/'].includes(route)) {
      const text = await page.locator('main').textContent();
      for (const value of ['19 €/mes + IVA', 'Desde la publicación de tu web', 'no acumulable', 'No existe permanencia obligatoria', 'a nombre del cliente']) assert.ok(text.includes(value), `${route}: ${value}`);
    }
    results.push({ route, status: 200, title: metadata.title, canonical: metadata.canonical, noindex: /noindex/.test(metadata.robots), schemaTypes: metadata.schema.map(schema => schema['@type']), forms: metadata.forms.length });
  }
  assert.equal(results.reduce((sum, page) => sum + page.forms, 0), 6);
  await context.close();

  for (const width of [1440, 1280, 1024, 768, 430, 390, 375]) {
    const context = await createQAContext(browser, { viewport: { width, height: 960 }, reducedMotion: 'reduce' });
    // Único destino de prueba: respuesta local, nunca WhatsApp real.
    await context.route('https://wa.me/**', route => route.fulfill({ contentType: 'text/html', body: '<title>QA interceptado</title>' }));
    const page = await context.newPage();
    for (const route of ['/', '/diseno-web/', '/preguntas-frecuentes/', '/condiciones-de-contratacion/']) {
      await page.goto(`${qaURL}${route}`, { waitUntil: 'networkidle' });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, `${route} ${width}`);
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
      assert.deepEqual(axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], `${route} ${width}`);
      const widget = page.locator('.whatsapp-widget');
      assert.equal(await widget.isVisible(), width >= 1024);
      if (width >= 1024) {
        assert.equal(await page.getByRole('complementary', { name: 'Contacto por WhatsApp', exact: true }).count(), 1);
        assert.equal(await widget.getAttribute('target'), '_blank');
        assert.equal(await widget.getAttribute('rel'), 'noopener noreferrer');
      }
      if ([390, 1440].includes(width)) {
        if (route === '/diseno-web/') await page.locator('.calculator__recurring').scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${output}/${route === '/' ? 'home' : route.split('/')[1]}-${width}.png` });
      }
      responsive.push({ route, width, axe: 0, overflow: false });
    }
    if (width >= 1024) {
      const widget = page.locator('.whatsapp-widget');
      await widget.focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      assert.ok(await widget.evaluate(el => el.matches(':focus-visible')));
      const popupPromise = context.waitForEvent('page');
      await page.keyboard.press('Enter');
      const popup = await popupPromise;
      await popup.waitForLoadState();
      assert.equal(popup.url(), 'https://wa.me/34621200800');
      await popup.close();
    }
    await context.close();
  }

  const files = [];
  async function walk(dir) {
    for (const item of await readdir(dir, { withFileTypes: true })) {
      const file = join(dir, item.name);
      if (item.isDirectory()) await walk(file); else files.push(file.replaceAll('\\', '/'));
    }
  }
  await walk('dist');
  assert.ok(files.includes('dist/.htaccess'));
  assert.deepEqual(files.filter(file => /\.(map|md|bak|log|sql)$|\/(\.env[^/]*|package(-lock)?\.json)$|\/(src|node_modules|scripts|docs|\.git|\.agents|\.impeccable)\//i.test(file)), []);
  const htaccess = await readFile('dist/.htaccess', 'utf8');
  assert.equal(htaccess, await readFile('public/.htaccess', 'utf8'));
  const directives = htaccess.split('\n').filter(line => !line.trim().startsWith('#')).join('\n');
  assert.ok(!/Strict-Transport-Security|Content-Security-Policy/i.test(directives));
  assert.match(directives, /ErrorDocument 404 \/404\.html/);
  assert.match(directives, /https:\/\/7dstudio\.es%\{REQUEST_URI\}/);
   const home = await readFile('dist/index.html', 'utf8');
   const socialPath = new URL(home.match(/property="og:image" content="([^"]+)"/)[1]).pathname;
   assert.ok(socialPath.endsWith('.webp'));
   const webp = await readFile(`dist${socialPath}`);
   assert.equal(webp.toString('ascii', 0, 4), 'RIFF');
   assert.equal(webp.toString('ascii', 8, 12), 'WEBP');
  const hash = data => createHash('sha256').update(data).digest('hex');
  assert.equal(hash(await readFile('dist/manrope-OFL.txt')), hash(await readFile('node_modules/@fontsource-variable/manrope/LICENSE')));
  assert.match(await readFile('dist/robots.txt', 'utf8'), /Sitemap: https:\/\/7dstudio\.es\/sitemap-index\.xml/);
  assert.match(await readFile('src/data/legal.ts', 'utf8'), /publicationReady: false/);
  assert.ok(webCareTerms.includes('19 €/mes + IVA'));
  await writeFile(`${output}/production.json`, JSON.stringify({ results, responsive, localResources: resourceCache.size, artifactFiles: files.length, privateFiles: 0, ogSize: '1200x630', fontLicense: 'exact copy', apacheLiteSpeedRuntime: 'NOT TESTED: no server access', realSubmissions: 0 }, null, 2));
  console.log(`OK: ${results.length} rutas SEO, ${responsive.length} vistas axe/responsive, ${resourceCache.size} recursos locales, condiciones compartidas y artefacto limpio. .htaccess pendiente de validar en hosting.`);
} finally { await browser.close(); }
