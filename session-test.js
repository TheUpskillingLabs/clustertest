// session-test.js — the full-arc driver with a real zero-JS-error gate.
//
// Walks the whole method the way a participant does — Sources → Sort →
// connect → Unlock → climb → Map → Classify → Deepen → export, three times —
// and then loads boards saved by OLDER builds to prove the additive invariant
// (never break a saved board) still holds.
//
// Everything runs against file:// with no server, because that is how the tool
// ships and how a room with bad wifi will actually open it.
//
//   node session-test.js            # exit 0 on pass, 1 on any failure
//
// Requires playwright. If it isn't local, the globally installed one works:
//   PW=/opt/node22/lib/node_modules/playwright node session-test.js

const path = require('path');
const { chromium } = require(process.env.PW || 'playwright');

const URL = 'file://' + path.join(__dirname, 'index.html');

let failures = 0;
function check(name, cond, detail) {
  if (cond) { console.log('  PASS  ' + name); }
  else { failures++; console.log('  FAIL  ' + name + (detail ? '  — ' + detail : '')); }
}
function section(name) { console.log('\n=== ' + name); }

// Any uncaught exception or console error anywhere in the run fails the suite.
// This is the gate CONTRIBUTING promises; without it a deleted global that an
// injected onclick still names sails straight through.
const jsErrors = [];
function watchForErrors(page) {
  page.on('pageerror', e => jsErrors.push('pageerror: ' + e.message));
  page.on('console', m => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/net::ERR_|Failed to load resource/.test(t)) return; // file:// favicon noise
    jsErrors.push('console: ' + t);
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await context.newPage();
  watchForErrors(page);

  // Record every download by intercepting the anchor click: the app builds zips
  // as blobs, and blob downloads from file:// don't always raise Playwright's
  // download event.
  await page.addInitScript(() => {
    window.__downloads = [];
    const realClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) window.__downloads.push(this.download);
      return realClick.apply(this, arguments);
    };
  });

  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await sleep(900);

  // ---------------------------------------------------------------- Sources
  section('Sources');
  // Tolerate an intro deck if one is present, so this driver is valid either
  // side of its removal — but say which door we came through.
  const bootedOn = await page.evaluate(() => appState.currentScreen);
  if (bootedOn === 'intro') {
    console.log('  note  booted on the intro deck; skipping it');
    await page.getByText('Skip intro').click();
    await sleep(500);
  } else {
    console.log('  note  booted straight onto ' + bootedOn);
  }
  check('lands on the Sources screen',
    await page.evaluate(() => !document.getElementById('setup-screen').classList.contains('hidden')),
    await page.evaluate(() => appState.currentScreen));

  await page.click('#load-sample-btn');
  await sleep(400);
  check('sample pool loads 21 source extracts',
    await page.evaluate(() => appState.items.length) === 21);

  await page.getByRole('button', { name: /Start sorting/ }).click();
  await sleep(500);

  // ------------------------------------------------------------------- Sort
  section('Sort');
  check('sorting screen is showing',
    await page.evaluate(() => !document.getElementById('sorting-screen').classList.contains('hidden')));

  // The gesture legend must be readable, not buried under a toast. Regression
  // guard for the collision between #toast-region and .sorting-hint.
  const legendClear = await page.evaluate(() => {
    const hint = document.getElementById('sorting-hint');
    const toast = document.querySelector('#toast-region .toast');
    if (!hint) return 'no hint element';
    if (!toast) return true; // nothing to collide with
    const a = hint.getBoundingClientRect(), b = toast.getBoundingClientRect();
    const overlaps = !(a.bottom < b.top || a.top > b.bottom || a.right < b.left || a.left > b.right);
    return overlaps ? `toast ${JSON.stringify(b)} covers legend ${JSON.stringify(a)}` : true;
  });
  check('the sort gesture legend is not covered by a toast', legendClear === true, String(legendClear));

  for (let i = 0; i < 21; i++) {
    await page.keyboard.press(i % 5 === 0 ? 'ArrowUp' : 'ArrowRight');
    await sleep(90);
  }
  await sleep(400);
  check('all 21 extracts got a decision',
    await page.evaluate(() => Object.keys(appState.sorting.decisions).length) === 21);

  await page.getByRole('button', { name: /Continue to Canvas/ }).click();
  await sleep(900);

  // --------------------------------------------------- Canvas — first Evidence
  section('Canvas — Seed Mode');
  check('board is showing',
    await page.evaluate(() => !document.getElementById('board-workspace').classList.contains('hidden')));
  check('starts in Seed Mode', await page.evaluate(() => isSeedMode()) === true);

  // Connect pairs of kept extracts — the move that makes an Evidence card.
  // Four of them, so there is something real to climb with later.
  const EVIDENCE_NAMES = [
    ['Local election information is hard to reach', 'Two independent extracts describe the same access failure.'],
    ['Volunteer capacity is thinning', 'Two extracts describe the same erosion of local capacity.'],
    ['Trust falls fastest where contact is thinnest', 'Two extracts tie distrust to the absence of contact.'],
    ['Local media no longer covers the mechanics', 'Two extracts describe coverage collapsing before turnout does.']
  ];
  const evidenceIds = await page.evaluate(names => {
    const d = appState.sorting.decisions;
    const kept = appState.items.filter(i => d[i.id] === 'signal' || d[i.id] === 'super').map(i => i.id);
    const made = [];
    names.forEach((pair, n) => {
      const before = appState.cards.length;
      connectNodes(kept[n * 2], kept[n * 2 + 1]);
      if (appState.cards.length === before) return;   // a gate refused — record nothing
      const card = appState.cards[appState.cards.length - 1];
      card.title = pair[0];
      card.description = pair[1];
      made.push(card.id);
    });
    save();
    return made;
  }, EVIDENCE_NAMES);
  check('connecting extracts creates Evidence cards', evidenceIds.length === 4,
    'made ' + evidenceIds.length + ' of 4');

  // The Seed-Mode ceiling: hunches don't climb until the room unlocks together.
  check('Seed Mode refuses to build a Pattern', await page.evaluate(ids => {
    const before = appState.cards.length;
    connectNodes(ids[0], ids[1]);
    return appState.cards.length === before;
  }, evidenceIds));

  // ---------------------------------------------------------------- Unlock
  section('Unlock Patterns & Themes');
  await page.getByRole('button', { name: /Unlock Patterns & Themes/ }).click();
  await sleep(400);
  check('the one-way unlock sheet opens',
    await page.evaluate(() => !document.getElementById('graduate-modal').classList.contains('hidden')));
  await page.evaluate(() => tgxConfirmGraduate());
  await sleep(600);
  check('board is in Pod Mode', await page.evaluate(() => appState.mode) === 'pod');
  check('the Pattern tool is now in the dock',
    await page.evaluate(() => {
      const t = [...document.querySelectorAll('#canvas-dock .dock-tool')];
      return t.some(el => /pattern/i.test(el.textContent) && !el.classList.contains('hidden'));
    }));

  // ------------------------------------------------------------------ Climb
  // Evidence → Pattern → Theme, through connectNodes so the locks are real.
  section('Climb the ladder');
  const climbed = await page.evaluate(ids => {
    const pair = (a, b, title, desc) => {
      const before = appState.cards.length;
      connectNodes(a, b);
      if (appState.cards.length === before) return null;
      const card = appState.cards[appState.cards.length - 1];
      card.title = title;
      card.description = desc;
      return card;
    };
    const p1 = pair(ids[0], ids[1],
      'Access erodes fastest where capacity is thinnest',
      'The mechanism: fewer volunteers means fewer contact points means less reachable information.');
    const p2 = pair(ids[2], ids[3],
      'Absence of contact reads as intent',
      'The mechanism: when nobody shows up, people infer a decision rather than a gap.');
    if (!p1 || !p2) return { patterns: [p1 && p1.id, p2 && p2.id].filter(Boolean), theme: null };
    const t = pair(p1.id, p2.id,
      'Civic infrastructure decays quietly before it fails loudly',
      'The universal bridging the human experience and the structural condition.');
    save(); renderBoard();
    return { patterns: [p1.id, p2.id], theme: t ? t.id : null };
  }, evidenceIds);

  check('two named Patterns were built from Evidence', climbed.patterns.length === 2);
  check('a named Theme was built from the Patterns', !!climbed.theme);
  check('the Theme is tier 3, named and described', await page.evaluate(id => {
    const c = id && findCard(id);
    return !!(c && c.tier === 3 && c.title && c.description);
  }, climbed.theme));

  // -------------------------------------------------------------------- Map
  section('Map the Problem Situation');
  await page.evaluate(() => { selectedNodeIds.clear(); openCommitModal(); });
  await sleep(600);
  check('a Problem Situation is mapped',
    await page.evaluate(() => appState.situations.length) >= 1);

  // --------------------------------------------------------------- Classify
  section('Classify');
  await page.evaluate(() => enterClassifyPhase());
  await sleep(500);
  check('classify phase is active', await page.evaluate(() => appState.classifyPhase) === true);
  check('the classify guide is on screen',
    await page.evaluate(() => !!document.getElementById('classify-guide')));
  await page.evaluate(() => exitClassifyPhase(true));
  await sleep(700);

  // ----------------------------------------------------------------- Deepen
  section('Deepen');
  await page.evaluate(() => goToScreen('workspace'));
  await sleep(700);
  check('the Deepen workbook is showing',
    await page.evaluate(() => !document.getElementById('workspace-screen').classList.contains('hidden')));

  // Type into the real inputs — this is the path a participant walks.
  const typeInto = async (id, text) => {
    const el = await page.$('#' + id);
    if (!el) return false;
    await el.click();
    await el.fill(text);
    await sleep(120);
    return true;
  };
  check('Stage 1 — name the situation', await typeInto('sit-title-1', 'Ballot access erodes where civic capacity is thinnest'));
  check('Stage 1 — describe it', await typeInto('sit-desc-1', 'An open, networked condition spanning volunteers, libraries, and local media.'));
  check('Stage 1 — why it is open', await typeInto('sit-open-1', 'No single actor owns it and the moving parts keep reconfiguring.'));
  check('Stage 5 — the paradox', await typeInto('sit-paradox-1', 'The situation demands sustained local volunteers, but the same erosion that creates the need is what burns them out.'));
  check('Stage 5 — the pressure-test', await typeInto('sit-problem-1', 'Assumes volunteering is the unit of capacity; paid civic staffing would break the frame.'));
  await sleep(400);

  check('the deck button unlocks once the five stages are answered',
    await page.evaluate(() => {
      const b = document.getElementById('produce-deck-btn');
      return !!b && !b.disabled;
    }),
    await page.evaluate(() => document.getElementById('submit-status-hint') && document.getElementById('submit-status-hint').textContent));

  // ---------------------------------------------------------------- Exports
  // Three times, because that is what the room does.
  section('Export — three times');
  await page.evaluate(() => {
    // A real title is a gate on the deck export; give it one.
    appState.settings.title = 'Civics & Elections — DC Founding Lab';
    save();
  });
  for (let i = 1; i <= 3; i++) {
    await page.evaluate(() => exportModular());
    await sleep(1600);
    await page.evaluate(() => document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => m.classList.add('hidden')));
    await sleep(250);
    const n = await page.evaluate(() => window.__downloads.length);
    check('deck & site export #' + i + ' produced a file', n === i, 'downloads so far: ' + n);
  }

  await page.evaluate(() => exportWorkingFolder(appState.situations[0].id));
  await sleep(1500);
  await page.evaluate(() => document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => m.classList.add('hidden')));
  check('working-folder export produced a file',
    await page.evaluate(() => window.__downloads.length) === 4);

  const names = await page.evaluate(() => window.__downloads);
  console.log('  downloads: ' + JSON.stringify(names));

  // -------------------------------------------- The additive invariant
  // A board saved by an OLDER build must still open. This is the project's
  // hardest rule and the one with the least margin for error.
  section('Additive invariant — old saved boards still load');

  const OLD_V2 = {
    settings: { title: 'A board from before the cleanup', concept: 'an early hunch' },
    items: [
      { id: 'i1', tag: 'signal', title: 'A', summary: 'a' },
      { id: 'i2', tag: 'signal', title: 'B', summary: 'b' }
    ],
    cards: [{ id: 'k1', title: 'Ev', description: 'd', tier: 1, childIds: ['i1', 'i2'], cardType: null, files: [], doc: '' }],
    situations: [{ id: 's1', title: 'Sit', description: 'described', memberCardIds: ['k1'], box: null, createdAt: 1 }],
    nodes: { i1: { x: 10, y: 10 }, i2: { x: 90, y: 10 }, k1: { x: 50, y: 130 } },
    view: { zoom: 1, panX: 0, panY: 0 }, viewInitialized: true, canvasViewState: 'all',
    // Fields written by UI this cleanup removes — they must not break the load.
    submittedAt: '2026-07-20T10:00:00.000Z', exportedAt: null,
    currentScreen: 'artifact', boardIntroSeen: true,
    classifyPhase: false, mode: 'pod', seedGuide: true, hideStepWhy: false,
    sorting: { currentIndex: 2, decisions: { i1: 'signal', i2: 'signal' } }
  };

  await page.evaluate(s => { localStorage.clear(); localStorage.setItem('olos.sensemaking.v2', JSON.stringify(s)); }, OLD_V2);
  await page.reload();
  await sleep(1400);
  const resumed = await page.evaluate(() => ({
    screen: appState.currentScreen,
    cards: appState.cards.length,
    sits: appState.situations.length,
    onADeadScreen: !!document.getElementById('artifact-screen')
      && !document.getElementById('artifact-screen').classList.contains('hidden')
  }));
  check('a pre-cleanup board (saved on the artifact screen) still loads',
    resumed.cards === 1 && resumed.sits === 1, JSON.stringify(resumed));
  check('it does not resume onto a removed screen', resumed.onADeadScreen === false, JSON.stringify(resumed));
  check('it resumes somewhere real', ['board', 'workspace', 'setup', 'sorting'].includes(resumed.screen), resumed.screen);

  // And the v1 → v2 migration, which predates all of this.
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('olos.sensemaking.v1', JSON.stringify({
      settings: { title: 'V1 board' },
      items: [{ id: 'i1', tag: 'signal', title: 'A', summary: 'a' }],
      clusters: [], currentScreen: 'board'
    }));
  });
  await page.reload();
  await sleep(1400);
  const migrated = await page.evaluate(() => ({
    items: appState.items.length,
    v1gone: !localStorage.getItem('olos.sensemaking.v1'),
    v2written: !!localStorage.getItem('olos.sensemaking.v2')
  }));
  check('a legacy v1 board migrates and the old key is cleaned up',
    migrated.items === 1 && migrated.v1gone && migrated.v2written, JSON.stringify(migrated));

  // ------------------------------------------------------------- The gate
  section('Zero-JS-error gate');
  check('no uncaught errors or console errors during the whole run',
    jsErrors.length === 0, jsErrors.join(' | '));

  await browser.close();

  console.log('\n' + (failures === 0 ? 'ALL PASSED' : failures + ' FAILURE(S)'));
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => { console.error('DRIVER CRASHED:', e); process.exit(1); });
