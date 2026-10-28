// node scripts/verify-project-links.mjs <QA node_modules> [URL]
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(pathToFileURL(join(resolve(process.argv[2]), 'playwright/index.mjs')));
const browser = await chromium.launch();
await mkdir('.impeccable/review/project-links', { recursive: true });
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, hasTouch: width < 768 });
    // Intercepta los destinos: comprueba el enlace, sin visitar ni enviar datos a las demos.
    await context.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, route => route.fulfill({ contentType: 'text/html', body: '<title>Destino de prueba QA</title>' }));
    const page = await context.newPage();
    await page.goto(process.argv[3] || 'http://127.0.0.1:4330', { waitUntil: 'networkidle' });
    const track = page.locator('.catalogue__track');
    await track.scrollIntoViewIfNeeded();
    const linked = page.locator('a.project');
    assert.ok(await linked.count() > 0);
    assert.equal(await page.locator('.project a, .project button').count(), 0);
    for (const card of await linked.all()) {
      assert.equal(await card.getAttribute('target'), '_blank');
      assert.equal(await card.getAttribute('rel'), 'noopener noreferrer');
      assert.equal(await card.evaluate(el => getComputedStyle(el).cursor), 'pointer');
      assert.ok(await card.locator('.project__image, h3, .project__description, span.project__link').count() === 4);
    }
    const staticCard = page.locator('article.project').first();
    if (await staticCard.count()) {
      assert.equal(await staticCard.getAttribute('href'), null);
      assert.equal(await staticCard.locator('.project__link').count(), 0);
      assert.notEqual(await staticCard.evaluate(el => getComputedStyle(el).cursor), 'pointer');
    }
    const before = await linked.first().evaluate(card => {
      const box = card.getBoundingClientRect();
      const article = document.createElement('article');
      for (const attr of card.attributes) article.setAttribute(attr.name, attr.value);
      article.innerHTML = card.innerHTML;
      card.replaceWith(article);
      const after = article.getBoundingClientRect();
      article.replaceWith(card);
      return { widthDifference: box.width - after.width, heightDifference: box.height - after.height };
    });
    assert.equal(before.widthDifference, 0);
    assert.equal(before.heightDifference, 0);

    for (const selector of ['.project__image', 'h3', '.project__description', '.project__link']) {
      const popupPromise = context.waitForEvent('page');
      await linked.first().locator(selector).click();
      const popup = await popupPromise;
      await popup.waitForLoadState();
      assert.equal(popup.url(), await linked.first().getAttribute('href'));
      assert.equal(await popup.evaluate(() => window.opener), null);
      await popup.close();
    }
    await track.focus();
    await page.keyboard.press('Tab');
    assert.ok(await linked.first().evaluate(el => el === document.activeElement && el.matches(':focus-visible')));
    assert.equal(await linked.first().evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
    await page.screenshot({ path: `.impeccable/review/project-links/${width}-focus.png` });
    await track.focus();
    await page.keyboard.press('End');
    await page.waitForTimeout(700);
    assert.ok(await track.evaluate(el => el.scrollLeft > 0));
    await page.keyboard.press('Home');
    await page.waitForTimeout(700);
    assert.ok(await track.evaluate(el => el.scrollLeft < 3));
    if (width < 768) {
      const box = await track.boundingBox();
      const cdp = await context.newCDPSession(page);
      const y = Math.max(120, Math.min(850, box.y + 80));
      const pages = context.pages().length;
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width * .85, y }] });
      for (let i = 1; i <= 6; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x + box.width * (.85 - .1 * i), y }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForTimeout(700);
      assert.ok(await track.evaluate(el => el.scrollLeft > 0));
      assert.equal(context.pages().length, pages, 'Swipe no debe abrir la demo');
    }
    console.log(`${width}px: enlace único, cuatro zonas clicables, nueva pestaña, foco, dimensiones y scroll correctos.`);
    await context.close();
  }
} finally { await browser.close(); }
