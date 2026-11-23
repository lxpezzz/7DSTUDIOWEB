// Regresión independiente de importes y reglas; nunca modifica los datos.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { webPricing, calculateWebQuote, formatWebPrice, describeWebQuote } from '../src/data/webPricing.ts';
import { loadQATools, createQAContext, qaURL } from './qa-browser.mjs';

const prices = { pages: 9000, catalogo: 15000, idioma: 8000, gallery: 8000, blog: 15000, bookings: 7500, logo: 5000, 'optimization-photos': 5000, 'profesional-photos': 15000 };
const extras = webPricing.extras.filter(extra => !extra.quantity);
let numericCases = 0;
for (const type of webPricing.types) {
  for (let mask = 0; mask < 256; mask++) {
    for (const pages of [-1, 0, 1, 2.7, 20, 21, NaN, Infinity]) {
      const ids = extras.filter((_, i) => mask & (1 << i)).map(extra => extra.id);
      const count = Number.isFinite(pages) ? Math.max(0, Math.min(20, Math.floor(pages))) : 0;
      const expected = type.baseCents === null ? null : type.baseCents + webPricing.extras.filter(extra => extra.compatibleWith.includes(type.id)).reduce((sum, extra) => sum + prices[extra.id] * (extra.quantity ? count : Number(ids.includes(extra.id))), 0);
      assert.equal(calculateWebQuote({ typeId: type.id, extraIds: ids, additionalPages: pages }).totalCents, expected);
      numericCases++;
    }
  }
}
const { chromium } = await loadQATools();
const browser = await chromium.launch();
try {
  const context = await createQAContext(browser, { reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(`${qaURL}/diseno-web/`, { waitUntil: 'networkidle' });
  const root = page.locator('[data-web-calculator]');
  const groups = root.locator('[data-extra-group]');
  const total = root.locator('[data-quote-total]');
  const pages = root.locator('[name="additional-pages"]');
  const choose = id => root.locator(`[name="web-type"][value="${id}"]`).check();
  const open = async group => { if (!await group.evaluate(el => el.open)) await group.locator(':scope > summary').click(); };
  assert.deepEqual(await groups.evaluateAll(els => els.map(el => el.open)), [true, false, false]);
  for (const type of webPricing.types) {
    await choose(type.id);
    assert.equal(await total.textContent(), type.baseCents === null ? 'A medida' : formatWebPrice(type.baseCents));
    for (const extra of webPricing.extras) {
      const group = groups.filter({ has: page.locator(`[data-extra-id="${extra.id}"]`) });
      await open(group);
      const input = group.locator(`[data-extra-id="${extra.id}"] input`);
      const compatible = extra.compatibleWith.includes(type.id);
      assert.equal(await input.isDisabled(), !compatible);
      if (!compatible) continue;
      if (extra.quantity) await input.fill('3'); else await input.check();
      assert.equal(await total.textContent(), formatWebPrice(type.baseCents + extra.unitCents * (extra.quantity ? 3 : 1)));
      await group.locator(':scope > summary').click();
      assert.equal(await groups.locator(':scope[open]').count(), 0);
      await open(group);
      if (extra.quantity) { assert.equal(await input.inputValue(), '3'); await input.fill('0'); }
      else { assert.equal(await input.isChecked(), true); await input.uncheck(); }
    }
  }
  await choose('corporate');
  await open(groups.first());
  await pages.fill('2');
  await root.locator('[value="blog"]').check();
  await root.locator('[value="catalogo"]').check();
  await root.locator('[data-request-quote]').click();
  const quote = calculateWebQuote({ typeId: 'corporate', extraIds: ['blog', 'catalogo'], additionalPages: 2 });
  assert.equal(await page.locator('[name="budget_summary"]').inputValue(), describeWebQuote(quote));
  await choose('one-page');
  assert.equal(await pages.inputValue(), '0');
  assert.equal(await root.locator('[value="blog"]').isChecked(), false);
  await page.locator('[data-clear-budget]').click();
  assert.equal(await page.locator('[name="budget_summary"]').inputValue(), '');
  await context.close();
  await mkdir('.impeccable/review/phase3', { recursive: true });
  await writeFile('.impeccable/review/phase3/calculator.json', JSON.stringify({ numericCases, browser: 'modalities, extras, compatibility, totals, accordions, persistence, budget transfer and reset: pass' }, null, 2));
  console.log(`OK: ${numericCases} casos numéricos y regresión de calculadora en navegador; sin envíos.`);
} finally { await browser.close(); }
