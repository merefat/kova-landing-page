// Kova landing page — QA smoke test (playwright-core + system browser)
// Screenshots at 4 widths + interaction tests for the new homepage sections.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = join(ROOT, 'qa-shots');
mkdirSync(SHOTS, { recursive: true });

const BASE = process.env.BASE_URL || 'http://localhost:3000';
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
  await page.evaluate(() => document.getElementById('how')?.scrollIntoView());
  await page.waitForTimeout(1100);
  await page.screenshot({ path: join(SHOTS, `mid-${w}.png`) });
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
check('hero heading', (await page.textContent('h1'))?.includes('Simpler Life'));
check('hero trust chips', (await page.locator('.hero-trust li').count()) === 3);
check('hero floaters removed', (await page.locator('.hero-floater').count()) === 0);
check('meet kova removed', (await page.locator('.pm-meet, #meet-kova, .hub-visual').count()) === 0);

// Hero phone — light control drives the villa brightness
check('hero phone visible', await page.isVisible('.hp-slider'));
const filterOf = () => page.evaluate(() => getComputedStyle(document.querySelector('.hero-img')).filter);
const lvlOf = () => page.evaluate(() => document.querySelector('.hero').style.getPropertyValue('--lvl').trim());
await page.click('.hp-steps button[aria-label="Increase brightness"]');
await page.waitForTimeout(350);
check('plus raises --lvl', parseFloat(await lvlOf()) > 0.7, await lvlOf());
const brightFilter = await filterOf();
await page.click('.hp-sw');
await page.waitForTimeout(400);
check('power off dims hero', (await lvlOf()) === '0' && (await filterOf()) !== brightFilter);
await page.click('.hp-sw');
await page.waitForTimeout(300);

// Every concept has its own section
const ids = ['problem', 'how', 'rhythm', 'connectivity', 'family', 'automations', 'sage', 'local-first', 'scenarios', 'why', 'get-started'];
const missing = [];
for (const id of ids) if (!(await page.$(`#${id}`))) missing.push(id);
check('all section anchors present', missing.length === 0, missing.join(','));

// Watch Demo -> How It Works modal -> CTA scrolls
await page.click('.hero-watch');
await page.waitForTimeout(500);
check('watch demo modal opens', await page.isVisible('.hiw-steps'));
await page.click('.hiw-cta');
await page.waitForTimeout(900);
check('hiw cta scrolls to demos', (await page.evaluate(() => window.scrollY)) > 200);

// Daily rhythm mode switcher + lighting follows the mode
const brightOf = () => page.evaluate(() => {
  const f = getComputedStyle(document.querySelector('.rhythm-photo')).filter;
  return parseFloat(/brightness\(([\d.]+)\)/.exec(f)?.[1] ?? '1');
});
await page.click('.rhythm-tab:has-text("Night")');
await page.waitForTimeout(950);
check('night tab active', /active/.test(await page.locator('.rhythm-tab:has-text("Night")').getAttribute('class') ?? ''));
check('night state text', (await page.locator('.rhythm-state').textContent()).includes('Security mode'));
const nightB = await brightOf();
await page.click('.rhythm-tab:has-text("Morning")');
await page.waitForTimeout(950);
check('morning state text', (await page.locator('.rhythm-state').textContent()).includes('Morning routine'));
const mornB = await brightOf();
await page.click('.rhythm-tab:has-text("Evening")');
await page.waitForTimeout(950);
const eveB = await brightOf();
check('mode lighting order', mornB > eveB && eveB > nightB, `m${mornB} e${eveB} n${nightB}`);

// Connectivity — 22 adapter nodes orbit the centre hub
const nodes = await page.locator('.cn-node').allTextContents();
check('22 adapter nodes', nodes.length === 22);
check('hub default text', (await page.locator('.cn-hub').textContent()).includes('local'));

// Connectivity — hover shows the adapter in the hub
await page.locator('.cn-node:has-text("Sonos")').hover();
await page.waitForTimeout(250);
check('eco node hover', (await page.locator('.cn-hub').textContent()).includes('Sonos'));

// Connectivity — internet switch dims the cloud ring
await page.click('.cn-sw');
await page.waitForTimeout(300);
check('internet off dims cloud', /net-off/.test(await page.locator('.cn-orb').getAttribute('class') ?? ''));
check('internet off hub text', (await page.locator('.cn-hub').textContent()).includes('still run'));
await page.click('.cn-sw'); // restore

// Connectivity — search with no match shows the fallback message in the hub
await page.fill('.cn-q input', 'xyzzynotreal');
await page.waitForTimeout(300);
check('search no-match hub text', (await page.locator('.cn-hub').textContent()).includes('Not built in'));
await page.fill('.cn-q input', '');

// Automations — toggle a rule, status updates
const statusBefore = await page.locator('.auto-status').textContent();
await page.locator('.auto-row').nth(2).locator('.toggle').click();
await page.waitForTimeout(350);
check('toggle flips row', /on/.test(await page.locator('.auto-row').nth(2).getAttribute('class') ?? ''));
const statusAfter = await page.locator('.auto-status').textContent();
check('automation status updates', statusAfter !== statusBefore, `${statusBefore?.trim()} -> ${statusAfter?.trim()}`);
await page.locator('.auto-row').nth(2).locator('.toggle').click(); // restore

// Sage — static demo: fixed conversation, no interactive controls
check('sage messages render', (await page.locator('.sg-msg').count()) === 4);
check('sage chips are static', (await page.locator('.sg-chips span').count()) === 3 && (await page.locator('.sg-chips button').count()) === 0);
check('sage input is visual only', (await page.locator('.sg-input input, .sg-input button').count()) === 0);

// Scenario cards — click switches detail
await page.click('.scen-card:has-text("Bedtime Mode")');
await page.waitForTimeout(300);
check('scenario card activates', /active/.test(await page.locator('.scen-card:has-text("Bedtime Mode")').getAttribute('class') ?? ''));
check('scenario detail text', (await page.locator('.scen-detail').textContent()).includes('Wind-down'));

// Get Started modal + Escape
await page.click('.close-cta .gold-button');
await page.waitForTimeout(500);
check('get started modal opens', await page.isVisible('.gs-form input'));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
check('escape closes modal', !(await page.isVisible('.gs-form')));

// Mobile menu
await page.setViewportSize({ width: 390, height: 850 });
await page.waitForTimeout(400);
await page.click('.mobile-toggle');
await page.waitForTimeout(300);
check('mobile menu opens', await page.isVisible('.mobile-menu.open'));
await page.click('.mobile-toggle');

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
