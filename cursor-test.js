const { chromium } = require('playwright');
const URL = 'file:///home/user/triangles/index.html';
let failures = 0;
function check(name, cond) {
  console.log((cond ? 'PASS' : 'FAIL') + '  ' + name);
  if (!cond) failures++;
}
const cssCursor = (page, sel) => page.evaluate(s => {
  const el = document.querySelector(s);
  return el ? getComputedStyle(el).cursor : null;
}, sel);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(URL);
  await page.evaluate(() => {
    localStorage.clear();
    // Suppress all spotlight feature tours so they don't intercept events
    ['board','sorting','setup','workspace','artifact'].forEach(s =>
      localStorage.setItem('olos.tour.done.' + s, '1'));
  });
  await page.reload();
  await page.waitForTimeout(700);
  // Decline tutorial offer, build a small real board
  await page.click('#tutorial-offer-modal .btn-outline');
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    loadSampleSignals();
    appState.items = appState.items.slice(0, 3);
    appState.sorting = { currentIndex: 3, decisions: {} };
    appState.items.forEach(i => appState.sorting.decisions[i.id] = 'signal');
    appState.items.forEach((it, idx) => setNodePos(it.id, 120 + idx * 260, 140));
    ensureCanvasInitialized();
    goToScreen('board');
    renderAllNodes(); renderAllEdges();
    updateTutorialLaunchBtn();
  });
  await page.waitForTimeout(300);
  // Dismiss any spotlight feature-tour overlay so it doesn't intercept events
  await page.evaluate(() => {
    if (typeof tourDismiss === 'function') tourDismiss();
    const o = document.getElementById('tour-overlay');
    if (o) o.classList.add('hidden');
  });
  await page.waitForTimeout(150);

  // --- Cursor states ---
  check('viewport idle cursor = default (arrow)',
    (await cssCursor(page, '#canvas-viewport')) === 'default');
  check('canvas node cursor = default (arrow)',
    (await cssCursor(page, '.canvas-node')) === 'default');

  // A text field inside a node should be `text`
  const hasField = await page.evaluate(() => !!document.querySelector('.canvas-node input, .canvas-node textarea'));
  if (hasField) {
    check('node text field cursor = text',
      (await page.evaluate(() => {
        const f = document.querySelector('.canvas-node input, .canvas-node textarea');
        return getComputedStyle(f).cursor;
      })) === 'text');
  } else {
    console.log('SKIP  no text field in node (signals are read-only)');
  }

  // Connect handle = crosshair
  check('connect handle cursor = crosshair',
    (await cssCursor(page, '.canvas-node .connect-handle')) === 'crosshair');

  // Space-held pan-ready = grab
  await page.evaluate(() => document.getElementById('canvas-viewport').focus?.());
  await page.keyboard.down('Space');
  await page.waitForTimeout(100);
  const spaceClassAdded = await page.evaluate(() =>
    document.getElementById('canvas-viewport').classList.contains('space-pan-ready'));
  check('space-pan-ready class added on space keydown', spaceClassAdded);
  check('space-pan-ready cursor = grab',
    (await cssCursor(page, '#canvas-viewport')) === 'grab');
  await page.keyboard.up('Space');
  await page.waitForTimeout(100);
  check('cursor returns to default after space released',
    (await cssCursor(page, '#canvas-viewport')) === 'default');

  // --- Tutorial button: visible, hover shows hint, click starts tutorial ---
  check('tour-help-btn visible on board',
    await page.evaluate(() => !document.getElementById('tour-help-btn').classList.contains('hidden')));
  check('hint hidden by default (opacity 0)',
    (await page.evaluate(() => getComputedStyle(document.getElementById('canvas-hint')).opacity)) === '0');
  await page.hover('#tour-help-btn');
  await page.waitForTimeout(250);
  check('hint visible on tour-help-btn hover (opacity 1)',
    (await page.evaluate(() => getComputedStyle(document.getElementById('canvas-hint')).opacity)) === '1');
  await page.click('#tour-help-btn');
  await page.waitForTimeout(500);
  check('clicking tour-help-btn starts tutorial (coach + sorting visible)',
    await page.evaluate(() =>
      !document.getElementById('tutorial-coach').classList.contains('hidden')
      && !document.getElementById('sorting-screen').classList.contains('hidden')));

  await browser.close();
  console.log(failures === 0 ? '\nALL PASSED' : `\n${failures} FAILURE(S)`);
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => { console.error('SCRIPT ERROR:', e); process.exit(1); });
