// Kova /features page — QA smoke test (playwright-core + system browser)
// Screenshots at 4 widths + interaction tests for the six feature cards.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = join(ROOT, 'qa-shots', 'features');
mkdirSync(SHOTS, { recursive: true });

const BASE = (process.env.BASE_URL || 'http://localhost:3000') + '/features';
const results = [];
const consoleErrors = [];

function check(name, ok, extra = '') {
  results.push({ name, ok, extra });
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
  await page.waitForTimeout(1400);
  await page.screenshot({ path: join(SHOTS, `top-${w}.png`) });
  await page.evaluate(() => document.getElementById('features')?.scrollIntoView());
  await page.waitForTimeout(1100);
  await page.screenshot({ path: join(SHOTS, `features-${w}.png`) });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);
  await page.screenshot({ path: join(SHOTS, `bottom-${w}.png`) });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check(`no horizontal overflow @${w}`, overflow <= 0, `${overflow}px`);
  await page.close();
}

// ---------- Pass 2: interactions on desktop viewport ----------
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`[demo] ${m.text()}`); });
page.on('pageerror', (e) => consoleErrors.push(`[demo] pageerror: ${e.message}`));
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

// Header + hero
check('header nav pill', await page.isVisible('.nav-pill'));
check('hero heading', (await page.textContent('h1'))?.includes('Live Smarter'));

// Watch How It Works modal
await page.click('.fp-watch');
await page.waitForTimeout(500);
check('how-it-works modal opens', await page.isVisible('.hiw-steps'));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// Card 01 — presence simulation sequence
check('presence idle status', (await page.locator('.presence-status').textContent()).includes('Waiting'));
await page.click('.presence-sim');
await page.waitForTimeout(3000);
check('presence active — Welcome Home scene', (await page.locator('.presence-status').textContent()).includes('Welcome Home'));
check('presence notif shows', await page.isVisible('.fp-notif'));
await page.click('.presence-panel .presence-sim'); // reset
await page.waitForTimeout(300);

// Card 02 — volume controls + real slider
await page.locator('.vol-btn[aria-label="Increase volume"]').click();
await page.waitForTimeout(200);
check('volume +5 works', (await page.locator('.vol-pct').textContent()).includes('75'));
await page.locator('.vol-slider').fill('40');
await page.waitForTimeout(200);
check('slider sets 40%', (await page.locator('.vol-pct').textContent()).includes('40'));

// Card 03 — mode switcher
await page.click('.mode-btn:has-text("Night")');
await page.waitForTimeout(300);
check('night mode class', /mode-night/.test(await page.locator('.modes-scene').getAttribute('class') ?? ''));
await page.click('.mode-btn:has-text("Day")');
await page.waitForTimeout(300);
check('day mode class', /mode-day/.test(await page.locator('.modes-scene').getAttribute('class') ?? ''));

// Card 04 — security alert → dismiss/reset
await page.click('.security-card .fc-cta');
await page.waitForTimeout(400);
check('security alert banner', await page.isVisible('.sec-banner'));
check('security live badge hot', /hot/.test(await page.locator('.sec-live').getAttribute('class') ?? ''));
await page.click('.sec-actions button:has-text("Dismiss")');
await page.waitForTimeout(300);
check('dismiss clears banner', !(await page.isVisible('.sec-banner')));

// Card 05 — family member select + role switch + add member
await page.click('.fam-avatars li:has-text("Maya") .fam-av');
await page.waitForTimeout(250);
check('member selection shows Maya', (await page.locator('.fam-detail-line').textContent()).includes('Maya'));
await page.click('.fam-role-btn:has-text("Guest")');
await page.waitForTimeout(250);
check('role switch to Guest', (await page.locator('.fam-role').last().textContent()).includes('Guest'));
await page.click('.fam-av.fam-add');
await page.waitForTimeout(200);
check('add member form opens', await page.isVisible('.fam-form input'));
await page.fill('.fam-form input', 'Sam');
await page.click('.fam-form button');
await page.waitForTimeout(250);
check('new member added', (await page.locator('.fam-name').allTextContents()).some((t) => t.includes('Sam')));

// Card 06 — thermostat + air-quality cycle
const before = await page.locator('.thermo-set').textContent();
await page.click('.thermo-btns button[aria-label="Increase temperature"]');
await page.waitForTimeout(300);
check('thermostat +0.5 works', (await page.locator('.thermo-set').textContent()) !== before,
  `${before?.trim()} -> ${(await page.locator('.thermo-set').textContent())?.trim()}`);
await page.click('.energy-chip.aq');
await page.waitForTimeout(200);
check('air quality cycles', (await page.locator('.energy-chip.aq').textContent()).includes('Fair'));

// CTA — Get Started modal
await page.click('.fcta-btn');
await page.waitForTimeout(500);
check('get started modal opens', await page.isVisible('.gs-form input'));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
check('escape closes modal', !(await page.isVisible('.gs-form')));

// Images all loaded
const broken = await page.evaluate(() =>
  [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src)
);
check('no broken images', broken.length === 0, broken.join(', '));

await page.screenshot({ path: join(SHOTS, 'final-state.png'), fullPage: true });
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
