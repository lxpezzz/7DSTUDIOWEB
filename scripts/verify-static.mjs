// Verifica el artefacto generado, sin red ni mutaciones de la aplicación.
import assert from 'node:assert/strict';
import { readFile, readdir, access, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const read = file => readFile(file, 'utf8');
const sitemapFiles = (await readdir('dist')).filter(name => /^sitemap.*\.xml$/.test(name));
const sitemap = (await Promise.all(sitemapFiles.map(name => read(join('dist', name))))).join('\n');
const pending = ['/aviso-legal/', '/politica-de-privacidad/', '/politica-de-cookies/', '/condiciones-de-contratacion/'];
for (const route of pending) {
  const html = await read(`dist${route}index.html`);
  assert.match(html, /name="robots" content="noindex, follow"/);
  assert.ok(!sitemap.includes(`https://7dstudio.es${route}`), `Legal pendiente en sitemap: ${route}`);
}
assert.ok(sitemap.includes('https://7dstudio.es/contacto/'));
assert.ok(!sitemap.includes('/demos/'));
assert.ok(!sitemap.includes('/404'));
await access('dist/404.html');
await assert.rejects(access('public/site.webmanifest'));
await assert.rejects(access('dist/site.webmanifest'));
for (const file of ['dist/index.html', 'dist/404.html']) {
  const html = await read(file);
  assert.ok(!/rel="manifest"|icon-192x192|icon-maskable|serviceWorker/.test(html));
  for (const [, url] of html.matchAll(/(?:href|src)="(\/(?:_astro\/[^"?#]+|favicon\.svg))"/g)) await access(`dist${url}`);
}
await mkdir('.impeccable/review/phase3', { recursive: true });
await writeFile('.impeccable/review/phase3/static.json', JSON.stringify({ legalNoindex: pending, legalExcluded: true, contactIndexed: true, demosExcluded: true, custom404: true, manifestRemoved: true, localResourcesExist: true }, null, 2));
console.log('OK: 404 y recursos, manifest retirado, legales pendientes noindex/fuera de sitemap; Contacto conservado.');
