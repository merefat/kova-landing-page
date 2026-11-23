// /integrations QA — screenshots at 5 widths + interaction tests for the
// workspace, the step-by-step guide drawer, overviews, the docs guide and
// the /integrations/<id> full guide pages.
// Run: BASE_URL=http://localhost:3003 node scripts/qa-integrations.mjs
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = join(ROOT, 'qa-shots');
mkdirSync(SHOTS, { recursive: true });

const BASE = (process.env.BASE_URL || 'http://localhost:3000') + '/integrations';
const results = [];
const consoleErrors = [];

function check(name, ok, extra = '') {
  results.push({ name, ok, extra });
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`);
}

const browser = await chromium.launch({ channel: 'msedge', headless: true });

// ---------- Pass 1: screenshots + overflow at 5 widths ----------
for (const w of [1440, 1280, 1100, 800, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: 950 } });
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`[${w}] ${m.text()}`); });
  page.on('pageerror', (e) => consoleErrors.push(`[${w}] pageerror: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: join(SHOTS, `ni-hero-${w}.png`) });
  await page.evaluate(() => document.getElementById('ni-sec-local')?.scrollIntoView());
  await page.waitForTimeout(1000);
  await page.screenshot({ path: join(SHOTS, `ni-work-${w}.png`) });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);
  await page.screenshot({ path: join(SHOTS, `ni-bot-${w}.png`) });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check(`no horizontal overflow @${w}`, overflow <= 0, `${overflow}px`);
  await page.close();
}

// ---------- Pass 2: structure + guide flow @1440 ----------
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`[demo] ${m.text()}`); });
page.on('pageerror', (e) => consoleErrors.push(`[demo] pageerror: ${e.message}`));
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1400);

// counts + honest statuses
check('18 local tiles', (await page.locator('.ni-tile').count()) === 18);
check('5 cloud cards', (await page.locator('.ni-cloud-card').count()) === 5);
check('7 service cards', (await page.locator('.ni-svc-card').count()) === 7);
const bodyText = await page.textContent('main');
check('no fake connected claims', !/connected\b/i.test(bodyText.replace(/supported connections/gi, '')));
check('count chip is honest', /30 supported connections/.test(bodyText));
check('6 orbit nodes', (await page.locator('.ni-orbit-node').count()) === 6);
check('header marks integrations active',
  /active/.test(await page.locator('.nav-link', { hasText: 'Integrations' }).first().getAttribute('class') ?? ''));

// every tile/cloud/service card rendered an icon glyph
const glyphless = await page.evaluate(() =>
  [...document.querySelectorAll('.ni-tile-icon, .ni-cloud-icon, .ni-svc-icon')]
    .filter((c) => !c.querySelector('svg')).length);
check('all cards show a glyph', glyphless === 0, `${glyphless} missing`);

// guide flow — tuya: 3 methods, step rail, done, back-to-list
await page.locator('.ni-tile[data-integral=tuya]').click();
await page.waitForTimeout(500);
check('guide drawer opens', await page.isVisible('.ni-drawer'));
check('tuya: 3 method tabs', (await page.locator('.ni-tab').count()) === 3);
check('only step 1 expanded', (await page.locator('.ni-step-body').count()) === 1);
for (let i = 0; i < 4; i++) await page.locator('.ni-guide-btns .ni-btn-primary').click();
await page.waitForTimeout(400);
check('done screen shows', await page.isVisible('.ni-done'));
check('done never claims connected', !/you.?re connected|now connected/i.test(await page.textContent('.ni-drawer')));
await page.locator('.ni-done-actions .ni-btn-ghost').click(); // browse all guides
await page.waitForTimeout(400);
check('overview lists all 30', (await page.locator('.ni-ov-row').count()) === 30);
await page.locator('.ni-ov-row', { hasText: 'Warden' }).click();
await page.waitForTimeout(400);
check('warden: 3 methods', (await page.locator('.ni-tab').count()) === 3);
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
check('escape closes drawer', !(await page.isVisible('.ni-drawer')));

// method tab counts on the tricky ones
for (const [id, want] of [['airplay', 2], ['presence', 5], ['notify', 2]]) {
  await page.locator(`[data-integral=${id}]`).first().click();
  await page.waitForTimeout(450);
  check(`${id}: ${want} methods`, (await page.locator('.ni-tab').count()) === want);
  await page.locator('.ni-drawer-close').click();
  await page.waitForTimeout(250);
}

// homekit bridge exclusion disclosure
await page.locator('[data-integral=homekitBridge]').click();
await page.waitForTimeout(450);
check('homekit bridge: locks/alarms banner',
  /never exposed/i.test(await page.textContent('.ni-drawer')));
check('homekit bridge: flag chip on card',
  await page.locator('[data-integral=homekitBridge] .ni-flag').count() === 1);
await page.locator('.ni-drawer-close').click();
await page.waitForTimeout(250);

// nest: the US$5 fee with its source link
await page.locator('[data-integral=nest]').click();
await page.waitForTimeout(450);
check('nest: US$5 disclosed', /US\$5/.test(await page.textContent('.ni-drawer')));
check('nest: fee links to source',
  (await page.locator('.ni-step-link[href*="device-access"]').count()) === 1);
await page.locator('.ni-drawer-close').click();
await page.waitForTimeout(250);

// aggregate actions → overview drawers
await page.locator('.ni-local-head .ni-text-link').click(); // Manage All
await page.waitForTimeout(400);
check('manage all → 30 rows', (await page.locator('.ni-ov-row').count()) === 30);
await page.locator('.ni-ov-search input').fill('hue');
await page.waitForTimeout(250);
check('overview filter works', (await page.locator('.ni-ov-row').count()) === 1);
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

await page.locator('.ni-cloud-intro .ni-text-link').click(); // View Cloud Integrations
await page.waitForTimeout(400);
check('cloud overview → 5 rows', (await page.locator('.ni-ov-row').count()) === 5);
check('cloud overview explains why', /no local api/i.test(await page.textContent('.ni-ov-head')));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

await page.locator('.ni-services-sub + .ni-text-link, .ni-sec-head-row .ni-text-link').first().click(); // Explore Services
await page.waitForTimeout(400);
check('services overview → 7 rows', (await page.locator('.ni-ov-row').count()) === 7);
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// docs guide from the sidebar help card
await page.locator('.ni-help-link').click();
await page.waitForTimeout(450);
check('docs guide opens', /how connections work/i.test(await page.textContent('.ni-drawer')));
check('docs guide has steps', (await page.locator('.ni-step').count()) >= 5);
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// ---------- Pass 2b: /integrations/<id> guide pages ----------
await page.goto(`${BASE}/tuya`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
check('guide page: 3 method panels', (await page.locator('.ni-page-method').count()) === 3);
check('guide page: all steps expanded', (await page.locator('.ni-pstep').count()) === 11);
check('guide page: QR step present', /QR code/i.test(await page.textContent('.ni-page')));
await page.locator('.ni-page-back').click();
await page.waitForTimeout(600);
check('back returns to /integrations', (await page.locator('.ni-tile[data-integral=tuya]').count()) === 1);
await page.locator('.ni-tile[data-integral=tapo]').click();
await page.waitForTimeout(400);
await page.locator('.ni-guide-fulllink').click();
await page.waitForTimeout(600);
check('drawer → guide page', page.url().includes('/integrations/tapo') && (await page.locator('.ni-page-method').count()) === 1);
await page.goto(`${BASE}/nope`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
check('unknown id shows missing view', await page.isVisible('.ni-page-missing'));
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

// orbit node opens its guide
await page.locator('.ni-orbit-node').first().click();
await page.waitForTimeout(450);
check('orbit node opens guide', await page.isVisible('.ni-drawer'));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// get started from a guide closes drawer then opens the modal
await page.locator('.ni-tile[data-integral=tapo]').click();
await page.waitForTimeout(400);
for (let i = 0; i < 4; i++) await page.locator('.ni-guide-btns .ni-btn-primary').click();
await page.waitForTimeout(300);
await page.locator('.ni-done-actions .ni-btn-primary').click();
await page.waitForTimeout(800);
check('get started modal opens', await page.isVisible('.modal, .gs-modal, [role="dialog"]:not(.ni-drawer)'));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// keyboard: tab cycling stays inside an open drawer
await page.locator('.ni-tile[data-integral=mqtt]').click();
await page.waitForTimeout(450);
for (let i = 0; i < 14; i++) await page.keyboard.press('Tab');
check('focus stays inside drawer',
  await page.evaluate(() => document.activeElement?.closest('.ni-drawer') !== null));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
check('focus returns to tile',
  await page.evaluate(() => document.activeElement?.getAttribute('data-integral') === 'mqtt'));

// sidebar jump + aria-current
await page.locator('.ni-side-item', { hasText: 'Services & More' }).click();
await page.waitForTimeout(1200);
check('sidebar click sets aria-current',
  await page.locator('.ni-side-item[aria-current="true"] .ni-side-label').textContent() === 'Services & More');

// ---------- Pass 3: mobile carousel + sheet @390 ----------
const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
m.on('console', (e) => { if (e.type() === 'error') consoleErrors.push(`[m] ${e.text()}`); });
m.on('pageerror', (e) => consoleErrors.push(`[m] pageerror: ${e.message}`));
await m.goto(BASE, { waitUntil: 'networkidle' });
await m.waitForTimeout(1400);

const track = m.locator('.ni-cloud-track');
const canScroll = await track.evaluate((t) => t.scrollWidth > t.clientWidth + 20);
check('cloud row scrolls @390', canScroll);
await m.locator('.ni-cloud-arrow').last().click();
await m.waitForTimeout(600);
check('cloud next arrow scrolls', (await track.evaluate((t) => t.scrollLeft)) > 50);

await m.locator('.ni-tile[data-integral=tapo]').click();
await m.waitForTimeout(500);
check('bottom sheet opens @390', await m.isVisible('.ni-drawer'));
await m.keyboard.press('Escape');
await m.waitForTimeout(300);

await m.locator('.mobile-toggle').click();
await m.waitForTimeout(400);
const mobileMenu = await m.evaluate(() => {
  const menu = document.querySelector('.mobile-menu.open');
  return menu ? [...menu.querySelectorAll('a')].some((a) => a.textContent.trim() === 'Integrations') : false;
});
check('mobile menu lists Integrations', mobileMenu);
await m.locator('.mobile-toggle').click();

// ---------- Pass 4: reduced motion + broken images ----------
const rm = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await rm.emulateMedia({ reducedMotion: 'reduce' });
await rm.goto(BASE, { waitUntil: 'networkidle' });
await rm.waitForTimeout(900);
const looping = await rm.evaluate(() =>
  [...document.querySelectorAll('.ni-orbit-line, .ni-orbit-node, .ni-orbit-hub-ring')]
    .some((el) => {
      const s = getComputedStyle(el);
      return s.animationName !== 'none' && s.animationIterationCount === 'infinite' && parseFloat(s.animationDuration) > 0.02;
    }));
check('reduced motion stops loops', !looping);
await rm.close();

const broken = await page.evaluate(() =>
  [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
check('no broken images', broken.length === 0, broken.join(', '));

await page.close();
await browser.close();

// ---------- summary ----------
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (consoleErrors.length) {
  console.log('\nConsole errors:');
  consoleErrors.slice(0, 20).forEach((e) => console.log('  ' + e));
} else {
  console.log('No console errors.');
}
process.exit(failed.length || consoleErrors.length ? 1 : 0);
