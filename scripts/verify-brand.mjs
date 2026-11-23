// Comprueba la identidad publicada tras npm run build, sin servidor ni red.
import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';

const read = path => readFile(path, 'utf8');
for (const [source, target] of [
  ['brand/svg/favicon.svg', 'dist/favicon.svg'],
  ['brand/favicons/favicon.ico', 'dist/favicon.ico'],
]) assert.deepEqual(await readFile(target), await readFile(source), target);

for (const route of ['', 'productos/', 'quienes-somos/', 'contacto/']) {
  const html = await read(`dist/${route}index.html`);
  assert.ok(!/logo-7dstudio|simbolo-7dstudio|simbolometal-7d/.test(html), route);
  assert.match(html, /src="\/_astro\/7dstudio-logo-horizontal\.[^" ]+\.svg"/);
  assert.ok(!html.includes('apple-touch-icon.png'));
  for (const property of ['og:image', 'twitter:image']) {
    const url = new URL(html.match(new RegExp(`(?:property|name)="${property}" content="([^"]+)"`))[1]);
    assert.equal(url.origin, 'https://7dstudio.es');
    assert.ok(url.pathname.endsWith('.webp'));
    await access(`dist${url.pathname}`);
  }
  for (const [, resource] of html.matchAll(/(?:src|href)="(\/_astro\/7dstudio-[^"]+\.svg)"/g)) {
    await access(`dist${resource}`);
  }
}
const assets = await readdir('dist/_astro');
assert.ok(assets.some(name => /^7dstudio-isotipo\..*\.svg$/.test(name)));
assert.ok(assets.some(name => /^7dstudio-logo-horizontal-white\..*\.svg$/.test(name)));
await assert.rejects(access('dist/apple-touch-icon.png'));
await assert.rejects(access('dist/og.png'));
console.log('OK: logos e isotipos SVG de brand, favicon SVG/ICO y tarjetas sociales WebP.');
