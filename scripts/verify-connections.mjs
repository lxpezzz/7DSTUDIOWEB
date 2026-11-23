// node scripts/verify-connections.mjs <QA node_modules> [URL local]
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { loadQATools, createQAContext, qaURL } from './qa-browser.mjs';

const { chromium, AxeBuilder } = await loadQATools();
const output = '.impeccable/review/connections';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
const errors = [];

try {
  for (const width of [1440, 1280, 1024, 768, 430, 390, 375]) {
    const context = await createQAContext(browser, {
      viewport: { width, height: 1000 },
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(qaURL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    if (width >= 768) await page.waitForSelector('.cinematic-ready');
    const section = page.locator('.connections');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);

    const layout = await section.evaluate(element => {
      const scenes = [...element.querySelectorAll('.connections__scene')];
      return {
        columns: getComputedStyle(element.querySelector('.connections__grid')).gridTemplateColumns.split(' ').length,
        overflow: document.documentElement.scrollWidth > innerWidth,
        heights: scenes.map(scene => scene.getBoundingClientRect().height),
        decorative: scenes.every(scene => scene.getAttribute('aria-hidden') === 'true' && !scene.querySelector('a, button, input, [tabindex]')),
        animations: element.getAnimations({ subtree: true }).length,
      };
    });
    assert.equal(layout.columns, width >= 1100 ? 4 : width >= 600 ? 2 : 1);
    assert.equal(layout.overflow, false);
    assert.equal(layout.decorative, true);
    assert.ok(layout.animations > 0);
    assert.equal(await section.locator('.section-cta a').getAttribute('href'), '/contacto/');
    assert.equal(await section.evaluate(element =>
      element.previousElementSibling.classList.contains('services-surface')
      && element.compareDocumentPosition(document.querySelector('.projects')) === Node.DOCUMENT_POSITION_FOLLOWING,
    ), true);

    // Entrada única y dos bucles de detalles, también en el viewport móvil.
    if (width === 1440 || width === 390) {
      const timeline = await section.evaluate(element => {
        const animations = element.getAnimations({ subtree: true });
        const entries = animations.filter(animation => animation.animationName === 'connection-enter');
        const details = animations.filter(animation => animation.animationName !== 'connection-enter');
        if (!entries.every(animation => animation.effect.getTiming().iterations === 1)
          || !details.every(animation => animation.effect.getTiming().iterations === Infinity)) {
          throw new Error('Solo los detalles internos pueden repetirse');
        }
        const samples = [];
        for (const time of [0, 800, 2000, 3800, 5600, 7599, 7600, 13200]) {
          for (const animation of animations) {
            animation.currentTime = time;
          }
          samples.push({
            time,
            early: getComputedStyle(element.querySelector('.connections__early')).opacity,
            late: getComputedStyle(element.querySelector('.connections__late')).opacity,
            phone: getComputedStyle(element.querySelector('.connections__phone')).transform,
            details: details.map(animation => {
              const style = getComputedStyle(animation.effect.target);
              return { name: animation.animationName, opacity: style.opacity, transform: style.transform };
            }),
            scenes: [...element.querySelectorAll('.connections__scene')].map(scene => ({
              scene: scene.className,
              content: [...scene.querySelectorAll(
                '.connections__early, .connections__middle, .connections__visual, .connections__late, .connections__feedback, .connections__phone',
              )].map(part => Number(getComputedStyle(part).opacity)),
            })),
          });
        }
        return samples;
      });
      assert.equal(Number(timeline[0].early), 0);
      assert.ok(Number(timeline[1].early) > .99);
      for (const sample of timeline.filter(sample => sample.time >= 2000)) {
        assert.ok(sample.scenes.every(scene => scene.content.every(opacity => opacity === 1)),
          `Las cuatro escenas deben mostrar su resultado a ${sample.time} ms`);
      }
      assert.deepEqual(timeline[2].details, timeline[6].details);
      assert.deepEqual(timeline[6].details, timeline[7].details);
      results.push({ width, timeline });

      await section.evaluate(element => {
        for (const animation of element.getAnimations({ subtree: true })) animation.currentTime = 2000;
      });
      if (width === 1440) {
        await page.waitForFunction(() =>
          [...document.querySelectorAll('.connections__scene')].every(scene =>
            scene.getAnimations({ subtree: true })
              .filter(animation => animation.effect.getTiming().iterations === Infinity)
              .every(animation => animation.effect.getComputedTiming().currentIteration >= 1),
          ),
          null, { timeout: 8000 });
        results.push({ allFourScenesCompletedLiveCycle: true });
      }

      const accessibility = await new AxeBuilder({ page }).include('.connections').analyze();
      assert.deepEqual(accessibility.violations, []);
      await page.locator('#contacto').scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      const paused = await section.evaluate(element =>
        element.getAnimations({ subtree: true })
          .filter(animation => animation.effect.getTiming().iterations === Infinity)
          .every(animation => animation.playState === 'paused'),
      );
      assert.equal(paused, true);
      results.push({ offscreenPaused: paused });
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      assert.equal(await section.evaluate(element =>
        [...element.querySelectorAll(
          '.connections__early, .connections__middle, .connections__visual, .connections__late, .connections__feedback, .connections__phone',
        )].every(part => getComputedStyle(part).opacity === '1'),
      ), true, 'Volver al viewport no debe repetir la entrada');
      results.push({ width, scrollDoesNotReplayEntrance: true });
    }

    // Las capturas estáticas muestran el estado informativo final en todos los tamaños.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    assert.equal(await section.evaluate(element => element.getAnimations({ subtree: true }).length), 0);
    assert.equal(await section.evaluate(element =>
      [...element.querySelectorAll(
        '.connections__early, .connections__middle, .connections__visual, .connections__late, .connections__feedback, .connections__phone',
      )].every(part => getComputedStyle(part).opacity === '1'),
    ), true);
    await section.screenshot({
      path: `${output}/${width}.png`,
      // Aislar la sección en la evidencia, sin cambiar el CSS de la web.
      style: '.header, .mobile-sticky-cta, .whatsapp-widget, astro-dev-toolbar { visibility: hidden !important; }',
    });
    results.push({ width, ...layout, reducedMotion: 'static final' });
    await context.close();
  }
  assert.deepEqual(errors, []);
  await writeFile(`${output}/qa.json`, JSON.stringify({ results, errors }, null, 2));
  console.log(JSON.stringify({ results, errors }, null, 2));
} finally {
  await browser.close();
}
