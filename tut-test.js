const { chromium } = require('playwright');

const URL = 'file:///home/user/triangles/index.html';
let failures = 0;
function check(name, cond) {
  console.log((cond ? 'PASS' : 'FAIL') + '  ' + name);
  if (!cond) failures++;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    // Ignore network failures for external resources (fonts) — sandbox has no internet
    if (m.type() === 'error' && !m.text().includes('Failed to load resource')) errors.push(m.text());
  });

  // ---------- Scenario 1: fresh visitor, full tutorial run ----------
  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(900);

  check('offer modal auto-shown to fresh visitor',
    await page.evaluate(() => !document.getElementById('tutorial-offer-modal').classList.contains('hidden')));

  await page.click('#tutorial-offer-modal .btn-primary');
  await page.waitForTimeout(400);

  check('coach visible after start',
    await page.evaluate(() => !document.getElementById('tutorial-coach').classList.contains('hidden')));
  check('sorting screen active',
    await page.evaluate(() => !document.getElementById('sorting-screen').classList.contains('hidden')));
  check('step 1/18 shown',
    await page.evaluate(() => document.getElementById('tutorial-coach-step').textContent.trim() === '1 / 18'));
  check('tutorial sort card rendered',
    await page.evaluate(() => document.getElementById('sort-card-title').textContent.includes('market-finder')));
  check('launch button hidden during tutorial',
    await page.evaluate(() => document.getElementById('tour-help-btn').classList.contains('hidden')));

  const next = () => page.click('#tutorial-coach-next');

  await next(); // -> step 2
  await next(); // -> step 3 (Continue disabled, waiting for swipe)
  check('step 3 Continue disabled before swipe',
    await page.evaluate(() => document.getElementById('tutorial-coach-next').disabled));

  // Swipe 1 (noise) via keyboard
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(600);
  check('step 3 explanation shown + Continue enabled after swipe',
    await page.evaluate(() => !document.getElementById('tutorial-coach-next').disabled
      && document.getElementById('tutorial-coach-body').textContent.includes('noise')));
  await next(); // -> step 4

  // Swipe 2 — deliberately "wrong" (left on a signal) to test adaptive copy
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(600);
  check('step 4 adaptive copy for wrong swipe',
    await page.evaluate(() => document.getElementById('tutorial-coach-body').textContent.includes('You discarded it')));
  await next(); // -> step 5

  // Swipe 3 (super)
  await page.keyboard.press('ArrowUp');
  await page.waitForTimeout(900);
  check('step 5 satisfied after super swipe',
    await page.evaluate(() => !document.getElementById('tutorial-coach-next').disabled));
  await next(); // -> step 6 (recap)
  check('sorting complete panel visible at recap',
    await page.evaluate(() => !document.getElementById('sorting-complete').classList.contains('hidden')));
  await next(); // -> step 7 (enters canvas via onAdvance)
  await page.waitForTimeout(600);

  check('board screen active after canvas transition',
    await page.evaluate(() => !document.getElementById('board-workspace').classList.contains('hidden')));
  check('8 tutorial signals on canvas',
    await page.evaluate(() => document.querySelectorAll('.signal-node').length === 8));

  await next(); // -> step 8 (waiting for connect)
  check('step 8 highlight on tut-s1',
    await page.evaluate(() => {
      const hl = document.getElementById('tutorial-highlight');
      return !hl.classList.contains('hidden');
    }));

  // Connect two signals (programmatic — drag plumbing is pre-existing behavior)
  await page.evaluate(() => connectNodes('tut-s1', 'tut-s2'));
  await page.waitForTimeout(1200); // action-auto advanceDelay 700 + render

  check('advanced to step 9 after evidence created',
    await page.evaluate(() => document.getElementById('tutorial-coach-step').textContent.trim() === '9 / 18'));

  // Classify: click a "wrong" chip (flux) to test adaptive copy
  const evidenceId = await page.evaluate(() => _tutCreated[1]);
  check('user-created evidence id recorded', !!evidenceId);
  await page.click(`#node-${evidenceId} .card-type-chip[data-type="flux"]`);
  await page.waitForTimeout(400);
  check('step 9 adaptive copy for non-History pick',
    await page.evaluate(() => document.getElementById('tutorial-coach-body').textContent.includes('defensible')));
  await next(); // -> step 10

  // Name + describe the evidence card
  await page.fill(`#node-${evidenceId} .hub-title`, 'Retail grocery has repeatedly failed here');
  await page.fill(`#node-${evidenceId} .hub-desc`, 'Two independent retail failures, 2019 and 2021.');
  await page.waitForTimeout(400);
  check('step 10 satisfied after naming',
    await page.evaluate(() => !document.getElementById('tutorial-coach-next').disabled));
  await next(); // -> step 11 (injects B, C, D)
  await page.waitForTimeout(400);

  check('three sibling evidence cards injected',
    await page.evaluate(() => !!(findCard('tut-eB') && findCard('tut-eC') && findCard('tut-eD'))));
  check('coach moved right for step 11',
    await page.evaluate(() => document.getElementById('tutorial-coach').classList.contains('coach-right')));
  await next(); // -> step 12

  await page.evaluate(id => connectNodes(id, 'tut-eB'), evidenceId);
  await page.waitForTimeout(1200);
  check('advanced to step 13 after pattern created',
    await page.evaluate(() => document.getElementById('tutorial-coach-step').textContent.trim() === '13 / 18'));

  const patternId = await page.evaluate(() => _tutCreated[2]);
  await page.fill(`#node-${patternId} .hub-title`, 'Formal retail exits, informal infrastructure absorbs the load');
  await page.fill(`#node-${patternId} .hub-desc`, 'The mechanism behind both branches of evidence.');
  await page.waitForTimeout(400);
  await next(); // -> step 14 (injects p2)
  await page.waitForTimeout(400);
  check('second pattern injected',
    await page.evaluate(() => !!findCard('tut-p2')));
  await next(); // -> step 15

  await page.evaluate(id => connectNodes(id, 'tut-p2'), patternId);
  await page.waitForTimeout(1200);
  check('advanced to step 16 after theme created',
    await page.evaluate(() => document.getElementById('tutorial-coach-step').textContent.trim() === '16 / 18'));

  const themeId = await page.evaluate(() => _tutCreated[3]);
  await page.fill(`#node-${themeId} .hub-title`, 'A trust-and-logistics network mistaken for a retail problem');
  await page.fill(`#node-${themeId} .hub-desc`, 'Structural and human at once; explains pantry avoidance too.');
  await page.waitForTimeout(400);
  await next(); // -> step 17 (push gate)

  // Push button must be guarded during tutorial
  await page.evaluate(() => openCommitModal());
  await page.waitForTimeout(200);
  check('push guarded during tutorial (still on board)',
    await page.evaluate(() => !document.getElementById('board-workspace').classList.contains('hidden')));

  await next(); // -> step 18
  check('final step reached',
    await page.evaluate(() => document.getElementById('tutorial-coach-step').textContent.trim() === '18 / 18'));
  await next(); // Finish -> exit
  await page.waitForTimeout(500);

  check('tutorial exited cleanly',
    await page.evaluate(() => !window.tutorialMode && document.getElementById('tutorial-coach').classList.contains('hidden')));
  check('done flag set',
    await page.evaluate(() => localStorage.getItem('olos.tutorial.done') === '1'));
  check('real state untouched (no items, no cards)',
    await page.evaluate(() => appState.items.length === 0 && appState.cards.length === 0));
  check('no tutorial data persisted',
    await page.evaluate(() => {
      const raw = localStorage.getItem('olos.sensemaking.v2');
      return !raw || !raw.includes('tut-');
    }));
  check('launch button visible again',
    await page.evaluate(() => !document.getElementById('tour-help-btn').classList.contains('hidden')));

  // ---------- Scenario 2: populated real board, exit mid-tutorial ----------
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(700);
  // Decline the offer this time
  await page.click('#tutorial-offer-modal .btn-outline');
  await page.waitForTimeout(300);
  // Build a small real board
  await page.evaluate(() => {
    loadSampleSignals();
    appState.items = appState.items.slice(0, 4);
    appState.sorting = { currentIndex: 4, decisions: {} };
    appState.items.forEach(i => appState.sorting.decisions[i.id] = 'signal');
    setNodePos(appState.items[0].id, 100, 100);
    setNodePos(appState.items[1].id, 500, 100);
    connectNodes(appState.items[0].id, appState.items[1].id);
    clearTimeout(saveTimer); save();
  });
  const before = await page.evaluate(() => localStorage.getItem('olos.sensemaking.v2'));
  const beforeCards = await page.evaluate(() => appState.cards.length);

  // Start tutorial from the floating button, play a few steps, exit
  await page.evaluate(() => tutorialStart());
  await page.waitForTimeout(400);
  check('tutorial state swapped in (3 sort items)',
    await page.evaluate(() => appState.items.length === 3));
  await next(); await next(); // to step 3
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(600);
  await page.click('.tut-exit-btn');
  await page.waitForTimeout(500);

  check('exit mid-tutorial restores real cards',
    await page.evaluate(c => appState.cards.length === c, beforeCards));
  const after = await page.evaluate(() => localStorage.getItem('olos.sensemaking.v2'));
  check('localStorage byte-identical across tutorial', before === after);
  check('tutorial mode off after exit',
    await page.evaluate(() => !window.tutorialMode));

  // Spotlight tours: never fired during tutorial; still available after
  check('no tour done-keys leaked for sorting during tutorial',
    await page.evaluate(() => !localStorage.getItem('olos.tour.done.sorting')));

  check('NO page errors: ' + (errors.length ? errors.join(' | ').slice(0, 300) : 'clean'), errors.length === 0);

  await browser.close();
  console.log(failures === 0 ? '\nALL TESTS PASSED' : `\n${failures} FAILURE(S)`);
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => { console.error('SCRIPT ERROR:', e); process.exit(1); });
