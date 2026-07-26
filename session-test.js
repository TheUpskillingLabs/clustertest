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
  // The stylesheet @imports Geologica from Google Fonts. Let the driver be
  // hermetic: it should test the app, not the network. (Worth knowing that a
  // *hanging* font request — as opposed to a failing one — blocks the page from
  // finishing load, because the @import is render-blocking.)
  await context.route('**fonts.googleapis.com**', r => r.abort());

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
  const poolSize = await page.evaluate(() => SAMPLE_HAND_SIZE);
  check(`the shared deal puts a ${poolSize}-card hand in the pool`,
    await page.evaluate(() => appState.items.length) === poolSize);
  check('every pre-loaded extract cites its source',
    await page.evaluate(() => appState.items.every(i => /^https?:\/\//.test(i.source_url || ''))));
  check('the deal is deterministic for this board\'s seed',
    await page.evaluate(() => {
      const first = appState.items.map(i => i.id).join(',');
      appState.items = [];
      loadSampleSignals();
      return appState.items.map(i => i.id).join(',') === first;
    }));
  check('a different seed deals a different hand',
    await page.evaluate(() => {
      const first = appState.items.map(i => i.id).join(',');
      const saved = appState.settings.seed;
      appState.settings.seed = (saved + 1) >>> 0;
      appState.items = [];
      loadSampleSignals();
      const second = appState.items.map(i => i.id).join(',');
      appState.settings.seed = saved;
      appState.items = [];
      loadSampleSignals();
      renderConfigItems();
      return first !== second;
    }));

  // -------------------------------------------------------------- CSV import
  // An import has to say what it did. A toast is gone in three and a half
  // seconds, and the old code dropped malformed rows silently — so a file
  // where a third of the rows were unusable reported plain success.
  section('CSV import feedback');
  {
    const fs = require('fs');
    const os = require('os');
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'csv-'));
    const write = (name, body) => { const f = path.join(tmp, name); fs.writeFileSync(f, body); return f; };
    const good = write('good.csv', 'title,summary\nOne,First summary\nTwo,Second summary\n');
    const partial = write('partial.csv', 'title,summary\nGood,Has a summary\nNo summary,\n,No title\nAlso good,Fine\n');
    const badHeader = write('bad.csv', 'name,text\nA,B\n');

    const readStatus = () => page.evaluate(() => {
      const el = document.getElementById('csv-status');
      if (!el || el.classList.contains('hidden')) return { shown: false };
      return { shown: true, kind: (el.className.match(/csv-status-(\w+)/) || [])[1], text: el.textContent.trim() };
    });
    const upload = async (file, confirm) => {
      await page.evaluate(() => { appState.items = []; renderConfigItems(); clearCsvStatus('setup'); });
      await page.setInputFiles('#csv-file-input', file);
      await sleep(500);
      const gated = await page.evaluate(() => {
        const m = document.getElementById('qa-verify-modal');
        return !!m && !m.classList.contains('hidden');
      });
      if (gated) { await page.evaluate(c => (c ? qaConfirmImport() : qaCancelImport()), confirm); await sleep(400); }
      return { gated, status: await readStatus() };
    };

    const clean = await upload(good, true);
    check('a clean import says so, where the import happened',
      clean.status.shown && clean.status.kind === 'ok' && /2 extracts loaded/.test(clean.status.text),
      JSON.stringify(clean.status));

    const part = await upload(partial, true);
    check('rows that could not be used are reported, not dropped in silence',
      part.status.shown && part.status.kind === 'warn' && /2 extracts loaded/.test(part.status.text)
      && /2 rows skipped/.test(part.status.text),
      JSON.stringify(part.status));

    const bad = await upload(badHeader, true);
    check('a CSV the tool cannot read says why, and what it wanted',
      bad.status.shown && bad.status.kind === 'error'
      && /title/.test(bad.status.text) && /summary/.test(bad.status.text),
      JSON.stringify(bad.status));

    const cancelled = await upload(good, false);
    check('cancelling the verification gate leaves a trace',
      cancelled.status.shown && /cancelled/i.test(cancelled.status.text),
      JSON.stringify(cancelled.status));

    // The message has to outlive a toast — that is the whole point.
    await sleep(4200);
    check('the result is still on screen after the toast has gone',
      (await readStatus()).shown === true);

    fs.rmSync(tmp, { recursive: true, force: true });
    // Put the sample pool back — the rest of the walk runs on it.
    await page.evaluate(() => { appState.items = []; renderConfigItems(); clearCsvStatus('setup'); });
    await page.click('#load-sample-btn');
    await sleep(400);
    check('the sample pool reloads cleanly after the CSV checks',
      await page.evaluate(() => appState.items.length) === poolSize);
  }

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

  for (let i = 0; i < poolSize; i++) {
    await page.keyboard.press(i % 5 === 0 ? 'ArrowUp' : 'ArrowRight');
    await sleep(90);
  }
  await sleep(400);
  check(`all ${poolSize} extracts got a decision`,
    await page.evaluate(() => Object.keys(appState.sorting.decisions).length) === poolSize);

  await page.getByRole('button', { name: /Continue to Canvas/ }).click();
  await sleep(900);

  // --------------------------------------------------- Canvas — first Evidence
  section('Canvas');
  check('board is showing',
    await page.evaluate(() => !document.getElementById('board-workspace').classList.contains('hidden')));

  // The whole ladder is available from the first card — no unlock step.
  check('every tier tool is in the dock from the start',
    await page.evaluate(() => {
      const wanted = ['tier-2', 'tier-3', 'tier-4'];
      return wanted.every(t => {
        const b = document.querySelector(`#canvas-dock .dock-tool[data-tool="${t}"]`);
        return b && !b.classList.contains('hidden');
      });
    }),
    await page.evaluate(() => ['tier-2', 'tier-3', 'tier-4'].map(t => {
      const b = document.querySelector(`#canvas-dock .dock-tool[data-tool="${t}"]`);
      return t + '=' + (!b ? 'missing' : b.classList.contains('hidden') ? 'hidden' : 'shown');
    }).join(' ')));
  check('the evidence tool is called Evidence, not Hunch',
    await page.evaluate(() => {
      const l = document.querySelector('#dock-evidence-btn .dock-label');
      return !!l && l.textContent.trim() === 'Evidence';
    }));
  check('an empty board says the first move is a connection',
    await page.evaluate(() => computeNextAction().state) === 'connect');

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

  // No unlock step: two named Evidence cards climb to a Pattern immediately.
  check('Evidence climbs straight to a Pattern, with no unlock step',
    await page.evaluate(ids => {
      const before = appState.cards.length;
      connectNodes(ids[0], ids[1]);
      const made = appState.cards[appState.cards.length - 1];
      const ok = appState.cards.length === before + 1 && made.tier === 2;
      if (ok) { appState.cards.pop(); delete appState.nodes[made.id]; save(); }  // put it back
      return ok;
    }, evidenceIds));

  // The lock that stays: a Pattern needs Evidence that has been examined.
  check('but only from Evidence that is named and described',
    await page.evaluate(ids => {
      const a = findCard(ids[0]);
      const keptTitle = a.title;
      a.title = '';                                  // un-examine it
      const before = appState.cards.length;
      connectNodes(ids[0], ids[1]);
      const refused = appState.cards.length === before;
      a.title = keptTitle;
      save();
      return refused;
    }, evidenceIds));

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

  // The workbook is a ~4,000px scroll across five stages. It has to spend its
  // height on the questions, and it has to say where you are in them.
  const wsChrome = await page.evaluate(() => {
    const h = s => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().height) : 0; };
    const sticky = h('.ws-stage-nav') + h('#workspace-actionbar');
    const top = h('#workspace-screen .step-indicator') + h('.workspace-header') + h('.ws-stage-nav') + h('#workspace-actionbar');
    const field = document.querySelector('#sit-title-1');
    return { vh: window.innerHeight, sticky, top, firstField: field ? Math.round(field.getBoundingClientRect().top) : null };
  });
  check('the workbook does not spend a third of the screen on chrome',
    wsChrome.top / wsChrome.vh < 0.30,
    `${wsChrome.top}px of ${wsChrome.vh} (${Math.round(wsChrome.top / wsChrome.vh * 100)}%) — was 45% before the rework`);
  check('the first question is in the top half of the screen',
    wsChrome.firstField !== null && wsChrome.firstField < wsChrome.vh / 2,
    `first field at y=${wsChrome.firstField} of ${wsChrome.vh}`);

  check('the stage nav lists all five stages',
    await page.evaluate(() => document.querySelectorAll('.ws-stage-chip').length) === 5);

  // Jumping must land the stage under the nav *and* light the right chip. The
  // nav is sticky, so at scroll-top it is still below the header — targeting
  // where it is rather than where it comes to rest under-scrolls every jump.
  const jumps = [];
  for (const n of ['2', '3', '4', '5']) {
    await page.click(`.ws-stage-chip[data-goto-stage="${n}"]`);
    await sleep(1100);
    jumps.push(await page.evaluate(() => {
      const active = document.querySelector('.ws-stage-chip[aria-current="true"]');
      return active ? active.getAttribute('data-goto-stage') : null;
    }));
  }
  check('jumping to a stage highlights that stage', jumps.join(',') === '2,3,4,5', jumps.join(','));

  await page.evaluate(() => wsGoToStage('1'));
  await sleep(900);

  check('the export button unlocks once the five stages are answered',
    await page.evaluate(() => {
      const b = document.getElementById('export-folder-btn');
      return !!b && !b.disabled;
    }),
    await page.evaluate(() => document.getElementById('submit-status-hint') && document.getElementById('submit-status-hint').textContent));

  // Answering a stage should tick it in the nav — without stealing focus out
  // of the field being typed into.
  check('answering Stage 1 ticks it in the nav',
    await page.evaluate(() => {
      const chip = document.querySelector('.ws-stage-chip[data-goto-stage="1"]');
      return !!chip && !!chip.querySelector('.ws-chip-done');
    }));

  // The workbook has its own sticky action bar; a toast has to clear it the
  // same way it clears the board's.
  const wsToastClear = await page.evaluate(() => {
    document.querySelectorAll('#toast-region .toast').forEach(t => t.remove());
    toast('probe');
    const t = document.querySelector('#toast-region .toast');
    const bar = document.getElementById('workspace-actionbar');
    if (!t || !bar) return 'missing element';
    const a = t.getBoundingClientRect(), b = bar.getBoundingClientRect();
    return (a.bottom <= b.top || a.top >= b.bottom) ? true
      : `toast ${Math.round(a.top)}..${Math.round(a.bottom)} vs footer ${Math.round(b.top)}..${Math.round(b.bottom)}, --ab-h=${getComputedStyle(document.documentElement).getPropertyValue('--ab-h').trim()}, toasts=${document.querySelectorAll('#toast-region .toast').length}`;
  });
  check('a toast on the workbook clears its footer', wsToastClear === true, String(wsToastClear));
  await sleep(300);
  await page.evaluate(() => document.querySelectorAll('#toast-region .toast').forEach(t => t.remove()));

  // ------------------------------------------------- The export gate speaks
  // A blocked export must name the stage that unblocks it from every entry
  // point, not just from the Deepen action bar.
  section('The export gate names what is missing');
  const gateMsg = await page.evaluate(() => {
    const sit = appState.situations[0];
    const kept = sit.paradox;
    sit.paradox = '';                       // re-block it
    document.querySelectorAll('#toast-region .toast').forEach(t => t.remove());
    exportModular();
    const t = document.querySelector('#toast-region .toast');
    const text = t ? t.textContent : '(no toast)';
    sit.paradox = kept;                     // put it back
    recomputeSubmitButton();
    return text;
  });
  check('a blocked deck export names the missing stage', /paradox/i.test(gateMsg) && /Stage/i.test(gateMsg), gateMsg);
  await sleep(300);
  await page.evaluate(() => document.querySelectorAll('#toast-region .toast').forEach(t => t.remove()));

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

  // The distilled sentence is the one artifact OLOS voters read first; the
  // export must carry the audit prompt, and the audit must ban the stock
  // formats without ever writing the sentence itself.
  {
    const wf = await page.evaluate(() => {
      const files = buildExportFiles(appState.situations[0].id);
      const distill = files.find(f => /(^|\/)distill\.md$/.test(f.path));
      return {
        hasDistill: !!distill,
        bansHmw: !!distill && distill.content.includes('How might we'),
        forbidsWriting: !!distill && /may NOT write/i.test(distill.content),
        hasDraftSlot: !!distill && distill.content.includes('draft_sentence')
      };
    });
    check('the working folder carries distill.md', wf.hasDistill, JSON.stringify(wf));
    check('the distill audit names the stock formats and forbids ghostwriting',
      wf.bansHmw && wf.forbidsWriting && wf.hasDraftSlot, JSON.stringify(wf));
    const paradoxPlaceholder = await page.evaluate(() => {
      const ta = document.querySelector('textarea[id^="sit-paradox-"]');
      return ta ? ta.placeholder : '(no paradox field rendered)';
    });
    check('the paradox field asks for the user\'s own words, not a fill-in template',
      !/___/.test(paradoxPlaceholder), paradoxPlaceholder);
  }

  // ------------------------------------------- What is actually in the export
  // "A file was produced" is not the deliverable. The deliverable is a landing
  // page and a presentation that open by double-click — no server, no network —
  // because that is how they get looked at: from a USB stick, in a library.
  {
    const fs = require('fs');
    const os = require('os');
    const files = await page.evaluate(() => buildModularExportFiles());
    const byPath = Object.fromEntries(files.map(f => [f.path, f.content]));
    const want = ['index.html', 'slides.html', 'README.md', 'assets/style.css', 'assets/viewer.js',
      'data/project.jsonld', 'data/extracts.csv', 'data/site-data.js',
      'content/situation.md', 'content/themes.md'];
    check('the export carries the whole site folder',
      want.every(f => byPath[f] && byPath[f].length),
      JSON.stringify(want.filter(f => !byPath[f])));

    check('index.html is the landing page, titled with the board',
      /<!doctype html>/i.test(byPath['index.html'])
      && /id="report"/.test(byPath['index.html'])
      && /Civics &amp; Elections/.test(byPath['index.html']));
    check('slides.html is a self-contained presentation of the situation',
      /class="slide/.test(byPath['slides.html'])
      && /<style>/.test(byPath['slides.html']) && /<script>/.test(byPath['slides.html'])
      && /Ballot access erodes/.test(byPath['slides.html']),
      (byPath['slides.html'].match(/class="slide[ "]/g) || []).length + ' slides');
    check('nothing in the export reaches for the network',
      !want.some(f => /https?:\/\/(cdn|unpkg|jsdelivr|fonts\.googleapis|ajax\.google)/i.test(byPath[f])));

    // Write the folder out and open it the way a participant will: by
    // double-clicking index.html off a stick, with no server anywhere.
    const site = fs.mkdtempSync(path.join(os.tmpdir(), 'tgx-site-'));
    files.forEach(f => {
      const dest = path.join(site, f.path);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, f.content);
    });
    for (const [name, min] of [['index.html', 'text'], ['slides.html', 'slides']]) {
      const p = await browser.newPage();
      const pageErrs = [];
      p.on('pageerror', e => pageErrs.push(String(e.message)));
      p.on('console', m => { if (m.type() === 'error') pageErrs.push(m.text()); });
      await p.goto('file://' + path.join(site, name));
      await sleep(1200);
      const seen = await p.evaluate(() => ({
        len: (document.body.innerText || '').trim().length,
        loading: !!document.querySelector('.loading'),
        mapNodes: document.querySelectorAll('svg.map rect').length,
        headings: document.querySelectorAll('h1, h2, .slide h1, .slide h2').length,
      }));
      // The site hydrates a whole report; the deck shows one slide at a time,
      // so its visible text is short by design — count its slides instead.
      const rendered = min === 'text'
        ? (!seen.loading && seen.len > 500 && seen.mapNodes > 0)
        : seen.headings >= 4;
      check(`${name} opens from file:// and renders`, rendered, JSON.stringify(seen));
      // Falling back after four failed fetches works, but it fills the console
      // with red for anyone who looks — on file:// there is nothing to fetch.
      check(`${name} opens without console errors`, pageErrs.length === 0, JSON.stringify(pageErrs));
      await p.close();
    }
    fs.rmSync(site, { recursive: true, force: true });
  }

  // ------------------------------------------------------- The action bar
  // It is permanent chrome over the canvas, so it stays small — and minimises
  // to just the one next action when the canvas matters more.
  section('Action bar');
  await page.evaluate(() => goToScreen('board'));
  await sleep(700);
  const barH = () => page.evaluate(() => {
    const e = document.getElementById('tgx-actionbar');
    return e && !e.classList.contains('hidden') ? Math.round(e.getBoundingClientRect().height) : 0;
  });
  const expandedH = await barH();
  check('the action bar is compact', expandedH > 0 && expandedH <= 80, expandedH + 'px (was ~129px)');

  await page.click('.ab-collapse');
  await sleep(500);
  const collapsedH = await barH();
  check('it minimises to a slim strip', collapsedH > 0 && collapsedH <= 36,
    `${expandedH}px -> ${collapsedH}px`);
  check('the one next action survives minimising',
    await page.evaluate(() => !!document.querySelector('#tgx-actionbar .ab-primary')));
  check('minimising republishes the clearance toasts key off',
    await page.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ab-h'), 10)) === collapsedH,
    await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ab-h').trim()));

  await page.reload();
  await sleep(1200);
  await page.evaluate(() => goToScreen('board'));
  await sleep(600);
  check('the preference survives a reload',
    await page.evaluate(() => document.getElementById('tgx-actionbar').classList.contains('is-collapsed')));
  await page.click('.ab-collapse');
  await sleep(500);
  const reExpandedH = await barH();
  check('and it expands again', reExpandedH > 0 && reExpandedH <= 80,
    `${expandedH}px before, ${reExpandedH}px after`);

  // --------------------------------------------------------- Auto-layout
  // Nodes are seeded on a spiral whose spacing is under half a card's width,
  // so a board of any size starts out overlapping. Auto-layout is the way out.
  section('Auto-layout');

  await page.evaluate(() => goToScreen('board'));
  await sleep(800);
  const overlaps = () => page.evaluate(() => {
    const r = [...document.querySelectorAll('.canvas-node')]
      .filter(n => n.getBoundingClientRect().width > 0)
      .map(n => n.getBoundingClientRect());
    let pairs = 0;
    for (let i = 0; i < r.length; i++) {
      for (let j = i + 1; j < r.length; j++) {
        const a = r[i], b = r[j];
        if (!(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom)) pairs++;
      }
    }
    return { pairs, nodes: r.length };
  });

  const posBefore = await page.evaluate(() => JSON.stringify(appState.nodes));
  const boxBefore = await page.evaluate(() => JSON.stringify(appState.situations.map(s => s.box)));
  const before2 = await overlaps();

  check('the auto-layout button is on the canvas toolbar',
    await page.evaluate(() => {
      const b = document.querySelector('.zoom-layout');
      return !!b && b.getBoundingClientRect().width > 0;
    }));

  await page.click('.zoom-layout');
  await sleep(1200);
  const after2 = await overlaps();
  check('auto-layout removes every card overlap',
    after2.pairs === 0 && after2.nodes === before2.nodes,
    `before ${before2.pairs} pairs / after ${after2.pairs} pairs over ${after2.nodes} nodes`);

  // Tiers must actually stack: every card sits above the ones it rests on.
  check('every card sits above its own children', await page.evaluate(() => {
    const bad = [];
    appState.cards.forEach(c => {
      const p = appState.nodes[c.id];
      if (!p) return;
      (c.childIds || []).forEach(k => {
        const q = appState.nodes[k];
        if (q && q.y <= p.y) bad.push(`${c.title || c.id} not above ${k}`);
      });
    });
    return bad.length === 0;
  }));

  // Section boxes are derived from member positions, so a layout that doesn't
  // recompute them leaves a frame around empty canvas.
  check('situation boxes still wrap their members', await page.evaluate(() => {
    return appState.situations.every(s => {
      if (!s.box) return false;
      return situationNodeIds(s).every(id => {
        const n = appState.nodes[id];
        const d = nodeSize(isHubId(id) ? 'hub' : 'signal', id);
        return n && n.x >= s.box.x && n.y >= s.box.y
          && n.x + d.w <= s.box.x + s.box.w && n.y + d.h <= s.box.y + s.box.h;
      });
    });
  }));

  // Someone who hand-arranged their board and hit this by accident must be
  // able to get it back — and the Undo button must be clickable, which means
  // clear of the dock and the action bar.
  const undoBtn = page.locator('#toast-region .toast button', { hasText: 'Undo' });
  const undoReachable = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('#toast-region .toast button')]
      .find(b => /undo/i.test(b.textContent));
    if (!btn) return 'no Undo button on screen';
    const r = btn.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    if (top === btn || btn.contains(top)) return true;
    return `covered by .${top && top.className} — toast at ${Math.round(r.top)}..${Math.round(r.bottom)}, `
      + `--ab-h=${getComputedStyle(document.documentElement).getPropertyValue('--ab-h').trim()}, `
      + `--dock-h=${getComputedStyle(document.documentElement).getPropertyValue('--dock-h').trim()}`;
  });
  check('the Undo action on the toast is not buried under the canvas chrome',
    undoReachable === true, String(undoReachable));
  await undoBtn.click();
  await sleep(900);
  check('Undo puts every node back exactly where it was',
    await page.evaluate(() => JSON.stringify(appState.nodes)) === posBefore);
  check('Undo restores the situation boxes too',
    await page.evaluate(() => JSON.stringify(appState.situations.map(s => s.box))) === boxBefore);

  // And it has to survive being run on an empty-ish board without throwing.
  await page.click('.zoom-layout');
  await sleep(1000);

  // ------------------------------------------------------------- BYO-LLM
  // The prompts are the only analytical help the tool offers — it has no AI of
  // its own — so an entry point that can't be found is the feature not existing.
  section('BYO-LLM prompts');

  await page.evaluate(() => goToScreen('board'));
  await sleep(700);
  check('the board header carries an AI-prompts button',
    await page.evaluate(() => {
      const b = document.querySelector('.btn-ai-prompt');
      return !!b && b.getBoundingClientRect().width > 0;
    }));
  check('every card on the canvas carries its own ✨ AI button',
    await page.evaluate(() => {
      const cards = document.querySelectorAll('.hub-node');
      const btns = document.querySelectorAll('.hub-node .hub-ai-btn');
      return cards.length > 0 && btns.length === cards.length;
    }),
    await page.evaluate(() => `${document.querySelectorAll('.hub-node .hub-ai-btn').length} buttons / ${document.querySelectorAll('.hub-node').length} cards`));
  check('the situation box carries AI prompts and the blind-spot audit',
    await page.evaluate(() => !!document.querySelector('.section-ai') && !!document.querySelector('.section-blindspot')));

  // One click from the canvas should land on a loaded prompt, not a collapsed
  // disclosure with no clue what's inside. Auto-placed cards overlap at the
  // default zoom, so click one that is actually on top rather than forcing it.
  const hittable = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('.hub-node .hub-ai-btn')];
    return btns.findIndex(b => {
      const r = b.getBoundingClientRect();
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return top === b || b.contains(top);
    });
  });
  check('at least one card\'s ✨ button is unobstructed at default zoom', hittable >= 0, 'index ' + hittable);
  await page.locator('.hub-node .hub-ai-btn').nth(Math.max(hittable, 0)).click();
  await sleep(700);
  const cardAI = await page.evaluate(() => ({
    pageOpen: !document.getElementById('card-page-modal').classList.contains('hidden'),
    sectionOpen: document.getElementById('card-page-ai').open,
    promptChars: document.getElementById('card-page-ai-prompt').value.length,
    peekClosed: !document.getElementById('card-page-ai-prompt').closest('details').open,
    targets: document.querySelectorAll('#card-ai-step-paste .ai-target').length
  }));
  check('one click from a card opens its prompts, already loaded',
    cardAI.pageOpen && cardAI.sectionOpen && cardAI.promptChars > 500, JSON.stringify(cardAI));

  // Per-board prompt variation: same board = same prompt, different seed =
  // materially different prompt — and the fixed integrity rules survive it.
  const variation = await page.evaluate(() => {
    const a = buildPoolPrompt('landscape');
    const saved = appState.settings.seed;
    const others = [7, 131, 4099].map(d => {
      appState.settings.seed = (saved + d) >>> 0;
      return buildPoolPrompt('landscape');
    });
    appState.settings.seed = saved;
    const c = buildPoolPrompt('landscape');
    return {
      differs: others.some(b => b !== a),
      stable: a === c,
      integrity: others.concat([a]).every(p => p.includes('Do NOT propose solutions')
        && p.includes('most predictable reading')),
      personaNamed: /sensemaking partner/.test(a)
    };
  });
  check('prompts differ across board seeds', variation.differs, JSON.stringify(variation));
  check('prompts are stable for one board\'s seed', variation.stable);
  check('the integrity rules survive persona and twist rotation', variation.integrity);
  check('the rotated persona still carries the thinking-partner contract', variation.personaNamed);
  check('the prompt text stays folded away behind a labelled peek', cardAI.peekClosed);
  check('the card panel names where to paste it', cardAI.targets === 5, String(cardAI.targets));
  await page.evaluate(() => closeModal('card-page-modal'));
  await sleep(300);

  // The modal must lead with the next step, and the copy must actually reach
  // the clipboard — a prompt that silently fails to copy is the worst outcome.
  await page.evaluate(() => openAIPromptModal());
  await sleep(600);
  const before = await page.evaluate(() => ({
    peekClosed: !document.querySelector('.ai-prompt-peek').open,
    copyLabel: document.querySelector('#ai-step-copy .btn').textContent.trim(),
    targets: document.querySelectorAll('#ai-step-paste .ai-target').length
  }));
  check('the AI modal opens on step 1 with the prompt text folded away',
    before.peekClosed && before.copyLabel === 'Copy the prompt', JSON.stringify(before));
  check('the modal names all five places to paste it', before.targets === 5);

  // A toast fired while a modal is open must not land on the modal's buttons.
  const modalToastClear = await page.evaluate(() => {
    toast('probe');
    const t = document.querySelector('#toast-region .toast');
    const btn = document.querySelector('#ai-step-copy .btn');
    if (!t || !btn) return 'missing element';
    const a = t.getBoundingClientRect(), b = btn.getBoundingClientRect();
    const hit = !(a.bottom < b.top || a.top > b.bottom || a.right < b.left || a.left > b.right);
    return hit ? `toast covers the copy button` : true;
  });
  check('a toast does not cover the modal it fires over', modalToastClear === true, String(modalToastClear));
  await sleep(400);

  await page.getByRole('button', { name: 'Copy the prompt' }).click();
  await sleep(600);
  const after = await page.evaluate(() => ({
    done: document.getElementById('ai-step-copy').classList.contains('is-done'),
    next: document.getElementById('ai-step-paste').classList.contains('is-next'),
    label: document.querySelector('#ai-step-copy .btn').textContent.trim()
  }));
  check('copying ticks step 1 and points at step 2',
    after.done && after.next && after.label === 'Copy it again', JSON.stringify(after));

  // Switching prompt mode must reset the walkthrough rather than leave step 1
  // ticked for a prompt that was never copied.
  await page.evaluate(() => switchAIMode('bridge'));
  await sleep(400);
  check('switching prompt resets the walkthrough',
    await page.evaluate(() => !document.getElementById('ai-step-copy').classList.contains('is-done')));
  await page.evaluate(() => closeAIPromptModal());
  await sleep(300);

  // ------------------------------------------------- Auto-layout on a lattice
  section('Auto-layout — latticed board');
  // --- The case that actually matters: a lattice, not a tree.
  // The method's whole point is that a node can rest on several claims and be
  // read by several above it — "a many-to-many lattice, not a tree". A layout
  // that only behaves on trees is a layout that degrades exactly as the
  // exercise succeeds.
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await sleep(1200);
  await page.evaluate(() => {
    loadSampleSignals();
    appState.items.forEach(i => { appState.sorting.decisions[i.id] = 'signal'; });
    appState.mode = 'pod';
    goToScreen('board');
    const k = appState.items.map(i => i.id);
    const mk = (a, b, t) => {
      connectNodes(a, b);
      const c = appState.cards[appState.cards.length - 1];
      c.title = t; c.description = 'described';
      return c.id;
    };
    const e = [];
    for (let i = 0; i < 8; i++) e.push(mk(k[i * 2], k[i * 2 + 1], 'E' + (i + 1)));
    // Extracts read by more than one Evidence card.
    addChildToParent(e[0], k[6]); addChildToParent(e[1], k[0]);
    addChildToParent(e[5], k[2]); addChildToParent(e[7], k[4]);
    const P = [mk(e[0], e[1], 'P1'), mk(e[2], e[3], 'P2'), mk(e[4], e[5], 'P3'), mk(e[6], e[7], 'P4')];
    // Evidence read by more than one Pattern.
    addChildToParent(P[0], e[4]); addChildToParent(P[1], e[6]);
    addChildToParent(P[2], e[1]); addChildToParent(P[3], e[2]);
    const T = [mk(P[0], P[1], 'T1'), mk(P[2], P[3], 'T2')];
    addChildToParent(T[0], P[2]); addChildToParent(T[1], P[0]);
    mk(T[0], T[1], 'S1');
    save(); renderBoard(); autoLayout();
  });
  await sleep(1400);

  // Crossings, counted the way the layout counts them: inversions between
  // adjacent bands. Geometry is the wrong measure here — collinear endpoints
  // make naive segment intersection over-report.
  const latticeMetrics = () => page.evaluate(() => {
    const tierOf = id => { const c = findCard(id); return c ? c.tier : 0; };
    const inLattice = new Set();
    appState.cards.forEach(c => { inLattice.add(c.id); (c.childIds || []).forEach(k => inLattice.add(k)); });
    const ranks = {};
    [...inLattice].forEach(id => { const t = tierOf(id); (ranks[t] = ranks[t] || []).push(id); });
    const tiers = Object.keys(ranks).map(Number).sort((a, b) => a - b);
    tiers.forEach(t => ranks[t].sort((a, b) => appState.nodes[a].x - appState.nodes[b].x));
    let crossings = 0;
    for (let i = 1; i < tiers.length; i++) {
      const pos = new Map(ranks[tiers[i - 1]].map((id, j) => [id, j]));
      const edges = [];
      ranks[tiers[i]].forEach((u, ui) => (findCard(u).childIds || []).forEach(kk => {
        if (pos.has(kk)) edges.push([ui, pos.get(kk)]);
      }));
      for (let a = 0; a < edges.length; a++) {
        for (let b = a + 1; b < edges.length; b++) {
          if ((edges[a][0] - edges[b][0]) * (edges[a][1] - edges[b][1]) < 0) crossings++;
        }
      }
    }
    const rects = [...document.querySelectorAll('.canvas-node')]
      .filter(n => n.getBoundingClientRect().width > 0)
      .map(n => n.getBoundingClientRect());
    let overlaps = 0;
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i], b = rects[j];
        if (!(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom)) overlaps++;
      }
    }
    const edgeCount = appState.cards.reduce((n, c) => n + (c.childIds || []).length, 0);
    return { crossings, overlaps, edgeCount, positions: JSON.stringify(appState.nodes) };
  });

  const lat = await latticeMetrics();
  check('a latticed board still lays out without overlaps', lat.overlaps === 0, JSON.stringify({ overlaps: lat.overlaps }));
  check('multi-parent nodes do not tangle the layout',
    lat.crossings <= 40,
    `${lat.crossings} crossings over ${lat.edgeCount} edges (pre-rewrite this fixture ran 42-51)`);
  check('every card still sits above its children on a lattice', await page.evaluate(() => {
    return appState.cards.every(c => {
      const p = appState.nodes[c.id];
      return !p || (c.childIds || []).every(k => !appState.nodes[k] || appState.nodes[k].y > p.y);
    });
  }));

  // Running it twice must not shuffle the board. The seed order comes from the
  // spiral, which uses Math.random(), so without the multi-seed restarts the
  // same board laid out differently every press.
  await page.click('.zoom-layout');
  await sleep(1400);
  const lat2 = await latticeMetrics();
  check('laying out twice is stable', lat2.positions === lat.positions,
    `${lat.crossings} then ${lat2.crossings} crossings`);

  // ------------------------------------------- Adding extracts from the canvas
  // Evidence arrives mid-session: a table finds a new dataset, or runs another
  // interview. Both ways in — a CSV and the ✨ extractor — have to work from
  // the board itself, not only from the Sources screen the room left an hour
  // ago. This runs on the latticed board above, which is what that looks like.
  section('Add extracts from the canvas');
  {
    const fs = require('fs');
    const os = require('os');
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'boardcsv-'));
    const write = (name, body) => { const f = path.join(tmp, name); fs.writeFileSync(f, body); return f; };
    const good = write('more.csv', 'title,summary\nLate arrival,Found at the second table.\nAnother,Also found late.\n');
    const partial = write('partial.csv', 'title,summary\nUsable,Has a summary\nNot usable,\n');

    const boardState = () => page.evaluate(() => ({
      items: appState.items.length,
      nodes: document.querySelectorAll('.canvas-node').length,
      unsorted: appState.items.filter(i => !appState.sorting.decisions[i.id]).length,
      cursorAtEnd: appState.sorting.currentIndex === appState.items.length,
      csvStatus: (document.getElementById('board-csv-status') || {}).textContent || '',
      csvKind: ((document.getElementById('board-csv-status') || {}).className || '').match(/csv-status-(\w+)/),
      xtrStatus: (document.getElementById('xtr-status') || {}).textContent || '',
      csvOpen: !document.getElementById('board-csv-modal').classList.contains('hidden'),
    }));
    const closeOpenModals = () => page.evaluate(() =>
      document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => closeModal(m.id)));

    await closeOpenModals();
    await page.click('#canvas-dock .dock-tool[onclick="openAddExtractsSheet()"]');
    await sleep(300);
    check('the dock opens an add-extracts chooser on the canvas',
      await page.evaluate(() => !document.getElementById('add-extracts-modal').classList.contains('hidden')));
    check('it offers all three ways in — CSV, ✨ extractor, by hand',
      await page.evaluate(() => document.querySelectorAll('#add-extracts-modal .share-row').length) === 3);
    // On a phone the dock hides its labels, so the glyph is the whole button.
    // Hydrating tier glyphs used to overwrite the ＋ with Evidence's dashed
    // circle, leaving the one way to add data looking like a duplicate tool.
    check('the add-extracts button keeps its own glyph', await page.evaluate(() => {
      const add = document.querySelector('#canvas-dock .dock-tool[onclick="openAddExtractsSheet()"] .dock-glyph');
      const ev = document.querySelector('#dock-evidence-btn .dock-glyph');
      return !!add && !!ev && add.innerHTML.trim() !== ev.innerHTML.trim() && /\+|＋/.test(add.textContent);
    }));

    await page.click('#add-extracts-modal .share-row >> nth=1');
    await sleep(300);
    check('"Upload a CSV" reaches the importer from the board', (await boardState()).csvOpen);

    const before = await boardState();
    await page.setInputFiles('#board-csv-input', good);
    await sleep(500);
    // The gate used to open *behind* the picker that launched it, which left
    // its confirm button unclickable — the import simply could not be finished.
    check('the verification gate lands on top of the picker that opened it',
      await page.evaluate(() => {
        const b = Array.from(document.querySelectorAll('#qa-verify-modal button'))
          .find(x => /verified/i.test(x.textContent));
        if (!b) return false;
        const r = b.getBoundingClientRect();
        return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === b;
      }));
    await page.click('#qa-verify-modal button.btn-primary');
    await sleep(600);
    let s = await boardState();
    check('a CSV uploaded on the canvas puts real cards on the canvas',
      s.nodes === before.nodes + 2 && s.items === before.items + 2,
      JSON.stringify({ before: before.nodes, after: s.nodes }));
    // Extracts added on the board arrive already sorted. Leaving them unsorted
    // makes the next reload resume into the sorting queue instead of the board.
    check('cards added on the canvas do not reopen the sorting queue',
      s.unsorted === 0 && s.cursorAtEnd, JSON.stringify({ unsorted: s.unsorted }));
    check('the importer says what it did, and stays up to be read',
      /2 extracts added to the canvas/.test(s.csvStatus) && s.csvKind[1] === 'ok' && s.csvOpen,
      JSON.stringify(s.csvStatus));
    const arrivals = await page.evaluate(() => {
      const vp = document.getElementById('canvas-viewport').getBoundingClientRect();
      const ids = appState.items.filter(i => /^(Late arrival|Another)$/.test(i.title)).map(i => i.id);
      return ids.map(id => {
        const el = document.querySelector(`.canvas-node[data-node-id="${id}"]`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { onScreen: r.right > vp.left && r.left < vp.right && r.bottom > vp.top && r.top < vp.bottom };
      });
    });
    check('the view moves to the new cards, which land off-screen otherwise',
      arrivals.length === 2 && arrivals.every(a => a && a.onScreen), JSON.stringify(arrivals));

    await page.setInputFiles('#board-csv-input', partial);
    await sleep(500);
    await page.click('#qa-verify-modal button.btn-primary');
    await sleep(500);
    s = await boardState();
    check('rows it could not use are named on the canvas too',
      s.csvKind[1] === 'warn' && /1 row skipped/.test(s.csvStatus), JSON.stringify(s.csvStatus));

    // ✨ Extract from sources, from the board.
    await closeOpenModals();
    await page.evaluate(() => openAddExtractsSheet());
    await sleep(250);
    await page.click('#add-extracts-modal .share-row >> nth=0');
    await sleep(350);
    check('the ✨ extractor opens from the canvas, whole',
      await page.evaluate(() => {
        const m = document.getElementById('xtr-modal');
        return !!m && !m.classList.contains('hidden')
          && ['xtr-source', 'xtr-file', 'xtr-url', 'xtr-prompt', 'xtr-result'].every(id => !!document.getElementById(id));
      }));
    const beforeX = await boardState();
    await page.fill('#xtr-source', 'Notes: the same address is re-keyed into three systems every morning.');
    await sleep(250);
    check('the prompt it hands you carries your own source material',
      await page.evaluate(() => /re-keyed into three systems/.test(document.getElementById('xtr-prompt').value)));
    await page.fill('#xtr-result', JSON.stringify([
      { title: 'Triple re-keying', summary: 'The same address is entered three times.', kind: 'observation' },
      { title: 'Systems do not talk', summary: 'No shared record between them.', kind: 'fact' },
      { title: 'Dropped, no summary', kind: 'fact' }
    ]));
    await page.click('#xtr-modal button.btn-primary');
    await sleep(350);
    // Routing this to the pool instead of the board is invisible and total: the
    // cards exist in state, appear nowhere, and drop the next reload into sort.
    check('extracting on the canvas targets the canvas, append-only',
      await page.evaluate(() => pendingCsvImport
        && pendingCsvImport.target === 'board' && pendingCsvImport.mode === 'append'));
    await page.click('#qa-verify-modal button.btn-primary');
    await sleep(600);
    s = await boardState();
    check('extracted cards land on the canvas, sorted',
      s.nodes === beforeX.nodes + 2 && s.unsorted === 0 && s.cursorAtEnd,
      JSON.stringify({ before: beforeX.nodes, after: s.nodes, unsorted: s.unsorted }));
    check('the extractor reports what it added and what it dropped',
      /2 extracts added to the canvas/.test(s.xtrStatus) && /1 entry skipped/.test(s.xtrStatus),
      JSON.stringify(s.xtrStatus));

    // "Replace existing pool" is a Sources-screen radio. Reading it from the
    // canvas would swap the whole pool out from under a live board.
    check('the replace-pool radio can never reach a live board',
      await page.evaluate(() => {
        const r = document.querySelector('input[name="csv-mode"][value="replace"]');
        if (r) r.checked = true;
        const n0 = appState.items.length;
        document.getElementById('xtr-result').value =
          JSON.stringify([{ title: 'Kept', summary: 'The board survives.', kind: 'fact' }]);
        tgxExtractParseAndAdd();
        qaConfirmImport();
        return appState.items.length === n0 + 1;
      }));

    await closeOpenModals();
    await sleep(250);
    check('a reload lands back on the canvas, not on Sources',
      await page.evaluate(() => pickInitialScreen()) === 'board');

    fs.rmSync(tmp, { recursive: true, force: true });
  }

  // ----------------------------------------------------------- Start over
  // Start over clears the save and reloads. The unsaved-work guard on
  // beforeunload fires on that reload and asks "leave site?" — and cancelling
  // it (the natural answer, having just confirmed) left the board on screen
  // with its save already deleted, which read as the button doing nothing.
  section('Start over');

  // The guard itself must still be there for accidental navigation.
  check('leaving with unsaved work is still guarded',
    await page.evaluate(() => {
      const e = new Event('beforeunload', { cancelable: true });
      window.dispatchEvent(e);
      return e.defaultPrevented;
    }));

  // Any beforeunload prompt during this is the bug: it means the user gets
  // asked whether to leave, having just confirmed that they want to.
  const prompts = [];
  const onDialog = async d => { prompts.push(d.type() + ' — ' + d.message()); await d.accept(); };
  page.on('dialog', onDialog);

  await page.evaluate(() => document.querySelectorAll('#toast-region .toast').forEach(t => t.remove()));
  await page.evaluate(() => { openShareSheet(); });
  await sleep(400);
  await page.getByRole('button', { name: /^Start over/ }).first().click();
  await sleep(500);

  // Clearing the board is the only irreversible thing in the tool, so it asks
  // in the middle of the screen — a toast at the bottom lands among the action
  // bar, the dock and the zoom toolbar, which is where the previous version of
  // this confirm went to hide.
  const resetDialog = await page.evaluate(() => {
    const m = document.getElementById('confirm-reset-modal');
    if (!m || m.classList.contains('hidden')) return 'dialog did not open';
    const c = m.querySelector('.modal-content').getBoundingClientRect();
    const clashes = ['#tgx-actionbar', '#canvas-dock', '.zoom-toolbar']
      .map(sel => document.querySelector(sel))
      .filter(el => el && el.getBoundingClientRect().height > 0)
      .filter(el => {
        const r = el.getBoundingClientRect();
        return !(c.bottom <= r.top || c.top >= r.bottom || c.right <= r.left || c.left >= r.right);
      });
    return {
      centredX: Math.abs((c.left + c.right) / 2 - window.innerWidth / 2) < 4,
      centredY: c.top > 0 && c.bottom < window.innerHeight,
      clashes: clashes.map(e => e.id || e.className),
      accent: getComputedStyle(m.querySelector('.modal-content')).borderTopColor,
      confirm: (m.querySelector('.btn-danger') || {}).textContent,
      focused: document.activeElement && document.activeElement.textContent
    };
  });
  check('Start over asks in a dialog in the middle of the screen',
    resetDialog !== 'dialog did not open' && resetDialog.centredX && resetDialog.centredY,
    JSON.stringify(resetDialog));
  check('the dialog is clear of the bottom chrome it used to hide behind',
    resetDialog.clashes && resetDialog.clashes.length === 0, JSON.stringify(resetDialog.clashes));
  check('it is accented in red and the safe choice has focus',
    resetDialog.accent === 'rgb(238, 28, 37)' && /keep my board/i.test(resetDialog.focused || ''),
    JSON.stringify({ accent: resetDialog.accent, focused: resetDialog.focused }));

  await page.evaluate(() => confirmStartOver());
  await page.waitForFunction(() => typeof appState !== 'undefined' && document.readyState === 'complete',
    null, { timeout: 15000 });
  await sleep(700);
  page.off('dialog', onDialog);

  const afterReset = await page.evaluate(() => ({
    items: appState.items.length,
    cards: appState.cards.length,
    screen: appState.currentScreen,
    onSources: !document.getElementById('setup-screen').classList.contains('hidden')
  }));
  check('confirming Start over actually clears the board',
    afterReset.items === 0 && afterReset.cards === 0 && afterReset.onSources,
    JSON.stringify(afterReset));
  check('and it does not stop to ask whether to leave the page',
    prompts.length === 0, prompts.join(' | '));

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
  check('a pre-seed board is dealt a variation seed on load',
    await page.evaluate(() => typeof appState.settings.seed === 'number' && isFinite(appState.settings.seed)));

  // A board saved mid-Seed, before Patterns and Themes were unlocked from the
  // start. It must come forward with everything it had and the full ladder now
  // available — the migration only ever adds.
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('olos.sensemaking.v2', JSON.stringify({
      settings: { title: 'A board left in Seed Mode', concept: 'an early hunch' },
      items: [
        { id: 'i1', tag: 'signal', title: 'A', summary: 'a' },
        { id: 'i2', tag: 'signal', title: 'B', summary: 'b' }
      ],
      cards: [{ id: 'k1', title: 'A hunch', description: 'named while in Seed', tier: 1, childIds: ['i1', 'i2'], cardType: null, files: [], doc: '' }],
      situations: [],
      nodes: { i1: { x: 10, y: 10 }, i2: { x: 90, y: 10 }, k1: { x: 50, y: 130 } },
      view: { zoom: 1, panX: 0, panY: 0 }, viewInitialized: true, canvasViewState: 'all',
      mode: 'seed', seedGuide: true,
      currentScreen: 'board', classifyPhase: false,
      sorting: { currentIndex: 2, decisions: { i1: 'signal', i2: 'signal' } }
    }));
  });
  await page.reload();
  await sleep(1400);
  const fromSeed = await page.evaluate(() => ({
    mode: appState.mode,
    cards: appState.cards.length,
    title: appState.cards[0] && appState.cards[0].title,
    tier: appState.cards[0] && appState.cards[0].tier,
    patternToolShown: (() => {
      const b = document.querySelector('#canvas-dock .dock-tool[data-tool="tier-2"]');
      return !!b && !b.classList.contains('hidden');
    })()
  }));
  check('a board saved mid-Seed keeps its cards and gains the full ladder',
    fromSeed.cards === 1 && fromSeed.title === 'A hunch' && fromSeed.tier === 1
    && fromSeed.mode === 'pod' && fromSeed.patternToolShown === true,
    JSON.stringify(fromSeed));

  // A board saved with a level tab selected. The tabs are gone, but the state
  // they wrote persists — and what they did to a board was fade every other
  // card to 22%, shrink it and set pointer-events:none. Loading one of these
  // has to give the board back whole and clickable, not frozen.
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('olos.sensemaking.v2', JSON.stringify({
      settings: { title: 'A board left on the Pattern tab', concept: '' },
      items: [
        { id: 'i1', tag: 'signal', title: 'A', summary: 'a' },
        { id: 'i2', tag: 'signal', title: 'B', summary: 'b' }
      ],
      cards: [{ id: 'k1', title: 'Ev', description: 'd', tier: 1, childIds: ['i1', 'i2'], cardType: null, files: [], doc: '' }],
      situations: [],
      nodes: { i1: { x: 10, y: 10 }, i2: { x: 190, y: 10 }, k1: { x: 90, y: 230 } },
      view: { zoom: 1, panX: 0, panY: 0 }, viewInitialized: true,
      canvasViewState: 'tier-2',
      currentScreen: 'board', classifyPhase: false, mode: 'pod',
      sorting: { currentIndex: 2, decisions: { i1: 'signal', i2: 'signal' } }
    }));
  });
  await page.reload();
  await sleep(1400);
  const unfiltered = await page.evaluate(() => ({
    tabBar: !!document.getElementById('view-tabs') || document.querySelectorAll('.view-tab').length > 0,
    total: document.querySelectorAll('.canvas-node').length,
    dimmed: document.querySelectorAll('.canvas-node.view-dim').length,
    frozen: Array.from(document.querySelectorAll('.canvas-node'))
      .filter(n => getComputedStyle(n).pointerEvents === 'none').length
  }));
  check('the level-tab bar is gone', unfiltered.tabBar === false);
  check('a board saved on a level tab comes back whole and clickable',
    unfiltered.total === 3 && unfiltered.dimmed === 0 && unfiltered.frozen === 0,
    JSON.stringify(unfiltered));

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

  // ------------------------------------------------------- Narrow viewports
  // Forty-odd people on whatever devices they brought. Two things must hold on
  // a phone: nothing scrolls sideways, and the toast still doesn't sit on the
  // sort legend — it wraps to two lines down there, which is what made the
  // desktop fix insufficient.
  section('Phone viewport');
  const phone = await context.newPage({ viewport: { width: 390, height: 844 } });
  watchForErrors(phone);
  await phone.goto(URL);
  await phone.evaluate(() => localStorage.clear());
  await phone.reload();
  await sleep(800);
  check('Sources does not scroll sideways on a phone',
    await phone.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await phone.evaluate(() => {
    loadSampleSignals();
    appState.items.forEach(i => { appState.sorting.decisions[i.id] = 'signal'; });
    goToScreen('sorting');
  });
  await sleep(600);
  const phoneLegend = await phone.evaluate(() => {
    const hint = document.getElementById('sorting-hint');
    const toast = document.querySelector('#toast-region .toast');
    if (!hint) return 'no hint element';
    if (!toast) return true;
    const a = hint.getBoundingClientRect(), b = toast.getBoundingClientRect();
    return (a.bottom < b.top || a.top > b.bottom) ? true
      : `toast ${Math.round(b.height)}px tall covers the legend`;
  });
  check('the sort legend survives a two-line toast on a phone', phoneLegend === true, String(phoneLegend));
  await phone.evaluate(() => goToScreen('board'));
  await sleep(800);
  check('the board does not scroll sideways on a phone',
    await phone.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await phone.close();

  // ------------------------------------------------------------- The gate
  section('Zero-JS-error gate');
  check('no uncaught errors or console errors during the whole run',
    jsErrors.length === 0, jsErrors.join(' | '));

  await browser.close();

  console.log('\n' + (failures === 0 ? 'ALL PASSED' : failures + ' FAILURE(S)'));
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => { console.error('DRIVER CRASHED:', e); process.exit(1); });
