// Herramientas externas: no se añaden al bundle ni a las dependencias de la web.
import assert from 'node:assert/strict';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function loadQATools() {
  assert.ok(process.argv[2], 'Uso: node scripts/verify*.mjs <QA node_modules> [URL local]');
  const modules = resolve(process.argv[2]);
  const { chromium } = await import(pathToFileURL(join(modules, 'playwright/index.mjs')));
  const { default: AxeBuilder } = await import(pathToFileURL(join(modules, '@axe-core/playwright/dist/index.mjs')));
  return { chromium, AxeBuilder };
}

export const qaURL = process.argv[3] || 'http://127.0.0.1:4330';
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(new URL(qaURL).hostname), 'QA solo contra servidor local');

export async function createQAContext(browser, options = {}) {
  const context = await browser.newContext({ ...options, serviceWorkers: 'block' });
  // Red cerrada por defecto, antes de abrir páginas. Los mocks explícitos de
  // page.route tienen prioridad. Nunca dejar pasar un POST si falta un mock.
  await context.route('**/*', route => {
    const request = route.request();
    if (!['GET', 'HEAD'].includes(request.method()) || new URL(request.url()).origin !== new URL(qaURL).origin) {
      return route.abort('blockedbyclient');
    }
    return route.continue();
  });
  return context;
}
