// Comprueba la identidad publicada tras npm run build, sin servidor ni red.
import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';

const read = path => readFile(path, 'utf8');
const brandRoot = 'brand-v2/brand';
for (const [source, target] of [
  [`${brandRoot}/svg/favicon.svg`, 'dist/favicon.svg'],
  [`${brandRoot}/favicons/favicon.ico`, 'dist/favicon.ico'],
]) assert.deepEqual(await readFile(target), await readFile(source), target);

// Comprobar todas las páginas de 7DStudio; Huella conserva su propia identidad.
const pages = (await readdir('dist', { recursive: true }))
  .map(path => path.replaceAll('\\', '/'))
  .filter(path => path.endsWith('.html') && !path.startsWith('demos/'));
for (const page of pages) {
  const html = await read(`dist/${page}`);
  assert.ok(!/logo-7dstudio|simbolo-7dstudio|simbolometal-7d/.test(html), page);
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
// No basta con que exista una URL: debe contener exactamente el recurso nuevo.
for (const [folder, file] of [
  ['svg', '7dstudio-logo-horizontal.svg'],
  ['svg', '7dstudio-logo-horizontal-white.svg'],
  ['svg', '7dstudio-isotipo.svg'],
  ['social', 'og-image.webp'],
  ['social', 'twitter-card.webp'],
]) {
  const extension = file.slice(file.lastIndexOf('.'));
  const stem = file.slice(0, -extension.length);
  const built = assets.filter(name => name.startsWith(`${stem}.`) && name.endsWith(extension));
  assert.equal(built.length, 1, `Recurso único de brand-v2: ${file}`);
  assert.deepEqual(
    await readFile(`dist/_astro/${built[0]}`),
    await readFile(`${brandRoot}/${folder}/${file}`),
    `El recurso publicado debe proceder de brand-v2: ${file}`,
  );
}
assert.ok(assets.some(name => /^7dstudio-isotipo\..*\.svg$/.test(name)));
assert.ok(assets.some(name => /^7dstudio-logo-horizontal-white\..*\.svg$/.test(name)));
await assert.rejects(access('dist/apple-touch-icon.png'));
await assert.rejects(access('dist/og.png'));
console.log(`OK: brand-v2 en ${pages.length} páginas, logos e isotipos SVG, favicon SVG/ICO y tarjetas sociales WebP.`);
