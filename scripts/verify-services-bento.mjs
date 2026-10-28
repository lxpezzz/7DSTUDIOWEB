// node scripts/verify-services-bento.mjs <QA node_modules> [URL]
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { services, getServiceHref } from '../src/data/services.ts';
const modules = resolve(process.argv[2]);
const { chromium } = await import(pathToFileURL(join(modules, 'playwright/index.mjs')));
const { default: AxeBuilder } = await import(pathToFileURL(join(modules, '@axe-core/playwright/dist/index.mjs')));
const output = '.impeccable/review/services-bento';
await mkdir(output, { recursive: true });
const results = [];
const failures = [];
function check(test, message) { if (!test) failures.push(message); }
for (const service of services) {
  const files = [`../../pages/${service.route.replace(/^\/|\/$/g, '')}/index.astro`];
  assert.equal(getServiceHref(service, files), service.published ? service.route : undefined);
  assert.equal(getServiceHref({ ...service, published: true }, []), undefined);
  assert.equal(getServiceHref({ ...service, published: true }, files), service.route);
}
const browser = await chromium.launch();
try {
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.argv[3] || 'http://127.0.0.1:4330', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#servicios').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - document.querySelector('.header').getBoundingClientRect().height - 20, behavior: 'instant' }));
    const layout = await page.locator('#servicios').evaluate(section => {
      const box = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }; };
      const cards = [...section.querySelectorAll('.service-card')];
      const scene = section.querySelector('.web-scene').getBoundingClientRect();
      const browser = section.querySelector('.web-scene__browser').getBoundingClientRect();
      return { width: innerWidth, documentWidth: document.documentElement.scrollWidth,
        background: getComputedStyle(section.parentElement).backgroundColor,
        cards: cards.map(card => ({ ...box(card), title: card.querySelector('h3').textContent, tag: card.tagName, href: card.getAttribute('href'),
          links: card.querySelectorAll('a,button,input,[tabindex]').length, cursor: getComputedStyle(card).cursor,
          clippedText: card.querySelector('.service-card__copy').scrollWidth > card.querySelector('.service-card__copy').clientWidth + 1 })),
        images: [...section.querySelectorAll('img')].map(image => ({ src: image.currentSrc, loaded: image.complete && image.naturalWidth > 0 })),
        browserContained: browser.left >= scene.left - 1 && browser.right <= scene.right + 1 && browser.top >= scene.top - 1 && browser.bottom <= scene.bottom + 1,
        illustrationMarked: section.querySelector('.local-scene__caption')?.textContent ?? null,
        ctas: cards.map(card => card.querySelector('.service-card__cta')?.textContent.trim()),
        reducedMotion: getComputedStyle(cards[0]).transitionDuration,
      };
    });
    check(layout.documentWidth === width, `Overflow documento a ${width}`);
    check(layout.background === 'rgb(244, 241, 235)', `Fondo incorrecto a ${width}`);
    check(layout.cards.length === 3, `Número de tarjetas a ${width}`);
    check(layout.ctas.every(Boolean), `CTA visible por tarjeta a ${width}`);
    check(layout.cards.every(card => card.x >= 0 && card.right <= width + 1 && !card.clippedText), `Recorte de tarjeta/texto a ${width}`);
    check(layout.cards.every((card, index) => card.tag === 'A' && card.href === (services[index].published ? services[index].route : '#contacto') && card.links === 0 && card.cursor === 'pointer'), `Destino temporal/publicado o enlace único incorrecto a ${width}`);
    check(layout.images.every(image => image.loaded), `Imagen no cargada a ${width}`);
    check(layout.browserContained, `Navegador cortado a ${width}`);
    if (width < 960) check(layout.cards[0].bottom <= layout.cards[1].y + 1 && layout.cards[1].bottom <= layout.cards[2].y + 1, `Orden vertical a ${width}`);
    else {
      check(Math.abs(layout.cards[0].y - layout.cards[1].y) < 2 && Math.abs(layout.cards[0].bottom - layout.cards[2].bottom) < 2, `Bento desalineado a ${width}`);
      check(Math.abs(layout.cards[0].width / (layout.cards[0].width + layout.cards[1].width) - .55) < .01, `Proporción de columnas a ${width}`);
    }
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    const violations = axe.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }));
    check(violations.length === 0, `Axe a ${width}: ${JSON.stringify(violations)}`);
    check(errors.length === 0, `Errores JS a ${width}: ${errors.join(',')}`);
    await page.screenshot({ path: `${output}/${width}-viewport.png` });
    await page.locator('#servicios').screenshot({ path: `${output}/${width}-section.png` });
    results.push({ ...layout, accessibilityViolations: violations, errors });
    await context.close();
  }
  // Prueba del contenido real tras el pin y de los enlaces temporales a Contacto.
  const interactive = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  await interactive.goto(process.argv[3] || 'http://127.0.0.1:4330', { waitUntil: 'networkidle' });
  await interactive.waitForSelector('.cinematic-ready');
  await interactive.evaluate(() => scrollTo({ top: innerHeight * 1.5, behavior: 'instant' }));
  await interactive.waitForTimeout(1500);
  await interactive.locator('#services-title').dblclick();
  check(await interactive.evaluate(() => getSelection().toString().length > 0), 'Selección de texto tras completar el zoom');
  await interactive.evaluate(() => getSelection().removeAllRanges());
  const linked = interactive.locator('#servicios a.service-card').first();
  check(await linked.locator('a, button, input, [tabindex]').count() === 0, 'Sin controles anidados en tarjeta enlazada');
  await linked.hover();
  await interactive.waitForTimeout(400);
  check(await linked.evaluate(el => getComputedStyle(el).cursor === 'pointer' && getComputedStyle(el).transform === 'none' && getComputedStyle(el).boxShadow.includes('0.34')), 'Halo y cursor sin desplazamiento de tarjeta');
  await interactive.locator('#servicios .section-cta a').focus();
  for (let index = 0; index < 3; index++) await interactive.keyboard.press('Shift+Tab');
  check(await linked.evaluate(el => el.matches(':focus-visible') && getComputedStyle(el).outlineStyle === 'solid'), 'Foco visible de tarjeta futura');
  await linked.locator('h3').click();
  await interactive.waitForTimeout(900);
  check(new URL(interactive.url()).hash === '#contacto', 'Click en contenido de la tarjeta futura');
  await interactive.evaluate(() => scrollTo({ top: innerHeight * 1.5, behavior: 'instant' }));
  await interactive.waitForTimeout(1400);
  await interactive.locator('#servicios .section-cta a').click();
  check(new URL(interactive.url()).hash === '#contacto', 'CTA real accesible tras el pin');
  await interactive.close();
  await writeFile(`${output}/qa.json`, JSON.stringify({ results, failures, realSectionInteraction: 'checked', routeState: 'SEO local published; other services use contact fallback' }, null, 2));
  console.log(JSON.stringify({ results, failures }, null, 2));
  assert.deepEqual(failures, []);
} finally { await browser.close(); }
