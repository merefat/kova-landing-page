// Kova /how-it-works — QA smoke test (playwright-core + system Edge)
// Screenshots at 4 widths + interaction tests for the page demos.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = join(ROOT, 'qa-shots', 'how');
mkdirSync(SHOTS, { recursive: true });

const BASE = (process.env.BASE_URL || 'http://localhost:3000') + '/how-it-works';
const results = [];
const consoleErrors = [];

function check(name, ok, extra = '') {
  results.push({ name, ok });
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`);
}

const browser = await chromium.launch({ channel: 'msedge', headless: true });

// ---------- Pass 1: screenshots at 4 widths ----------
const widths = [1440, 1100, 800, 390];
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 950 } });
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`[${w}] ${m.text()}`); });
  page.on('pageerror', (e) => consoleErrors.push(`[${w}] pageerror: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(SHOTS, `hiw-top-${w}.png`) });
  for (const [i, id] of ['journey', 'modes', 'automations', 'sage', 'integrations', 'local-first', 'how-cta'].entries()) {
    await page.evaluate((el) => document.getElementById(el)?.scrollIntoView({ block: 'center' }), id);
    await page.waitForTimeout(950);
    await page.screenshot({ path: join(SHOTS, `hiw-${id}-${w}.png`) });
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check(`no horizontal overflow @${w}`, overflow <= 0, `${overflow}px`);
  await page.close();
}

// ---------- Pass 2: interactions on desktop ----------
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`[demo] ${m.text()}`); });
page.on('pageerror', (e) => consoleErrors.push(`[demo] pageerror: ${e.message}`));
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1300);

check('hero heading', (await page.textContent('h1'))?.includes('Kova'));

// Journey — click a step reveals detail
await page.evaluate(() => document.getElementById('journey').scrollIntoView());
await page.locator('.jt-step').nth(3).click();
await page.waitForTimeout(350);
check('journey detail opens', await page.isVisible('.jt-detail'));
check('journey detail text', (await page.locator('.jt-detail').textContent()).includes('Automations'));

// Modes — switch to Night updates state
await page.evaluate(() => document.getElementById('modes').scrollIntoView({ block: 'center' }));
await page.click('.modes-tab:has-text("Night")');
await page.waitForTimeout(300);
check('night mode active', /active/.test(await page.locator('.modes-tab:has-text("Night")').getAttribute('class') ?? ''));
check('night rows', (await page.locator('.modes-rows').textContent()).includes('Night mode'));
check('night tint', /tint-night/.test(await page.locator('.modes-tint').getAttribute('class') ?? ''));

// Overlay — Movie activates on top of mode
await page.click('.overlay-btn:has-text("Movie")');
await page.waitForTimeout(300);
check('movie overlay shown', (await page.locator('.modes-state').textContent()).includes('Movie Overlay'));
check('base mode preserved', (await page.locator('.modes-state').textContent()).includes('Night'));
await page.click('.overlay-end');
await page.waitForTimeout(300);
check('overlay ends back to mode', (await page.locator('.modes-state').textContent()).includes('Night Mode'));

// Automations — toggle + add rule
await page.evaluate(() => document.getElementById('automations').scrollIntoView({ block: 'center' }));
const status0 = await page.locator('.auto-status').textContent();
await page.locator('.auto-rule').first().locator('.toggle').click();
await page.waitForTimeout(300);
check('rule toggles off', (await page.locator('.auto-status').textContent()) !== status0);
await page.click('.auto-add');
await page.click('.auto-pick:has-text("11 PM")');
await page.waitForTimeout(300);
check('second rule added', (await page.locator('.auto-rule').count()) === 2);

// Sage — chip + typed command
await page.evaluate(() => document.getElementById('sage').scrollIntoView({ block: 'center' }));
const msgs0 = await page.locator('.sage-msg').count();
await page.click('.sage-chips button:has-text("Who is home")');
await page.waitForTimeout(300);
check('sage chip responds', (await page.locator('.sage-msg').count()) === msgs0 + 2);
await page.fill('.sage-input input', 'turn off the lights');
await page.press('.sage-input input', 'Enter');
await page.waitForTimeout(300);
check('sage typed reply', (await page.locator('.sage-msg.sage').last().textContent()).includes('off'));

// Integrations — hover/select node updates info
await page.evaluate(() => document.getElementById('integrations').scrollIntoView({ block: 'center' }));
await page.waitForTimeout(900); // let the reveal transition finish before hovering
await page.locator('.eco-node:has-text("Sonos")').hover();
await page.waitForTimeout(300);
check('integration info', (await page.locator('.eco-info').textContent()).includes('Sonos'));
await page.locator('.eco-node:has-text("Matter")').click();
await page.waitForTimeout(300);
check('matter info', (await page.locator('.eco-info').textContent()).includes('Matter'));

// CTA opens get-started modal
await page.click('.hiw-cta-body .gold-button');
await page.waitForTimeout(500);
check('get started modal', await page.isVisible('.gs-form'));
await page.keyboard.press('Escape');

// Images all loaded
const broken = await page.evaluate(() =>
  [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src)
);
check('no broken images', broken.length === 0, broken.join(', '));

await page.screenshot({ path: join(SHOTS, 'hiw-final.png'), fullPage: true });
await browser.close();

const fails = results.filter((r) => !r.ok);
console.log(`\n${results.length - fails.length}/${results.length} checks passed`);
if (consoleErrors.length) {
  console.log('\nCONSOLE ERRORS:');
  consoleErrors.forEach((e) => console.log('  ' + e));
} else {
  console.log('No console errors.');
}
process.exit(fails.length || consoleErrors.length ? 1 : 0);
