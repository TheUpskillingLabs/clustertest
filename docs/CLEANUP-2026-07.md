# What was removed before the Sensemaking Sprint — and how to get it back

**Date:** July 2026 · **Branch:** `claude/app-review-uiux-cleanup-w06k8y`
**Why:** the tool was built to be used *alone and unguided*. For a facilitated
session — poderators shepherding tables, saying the why out loud — a lot of that
self-guidance is a second voice competing with the first. This is the record of
what went, so nothing has to be excavated from `git log` to be reconsidered.

**Nothing was removed on the grounds that the room wouldn't reach it.** The full
arc still runs end to end, exports included. Every cut is either code that
already couldn't run, a feature that did nothing, or one of several controls
doing the same job.

`index.html` went from **10,349 to 10,127 lines** — 1,744 lines out, 1,522 back in. The removals are much bigger than the net figure suggests: the BYO-LLM walkthrough, the auto-layout pass, the workbook's stage nav and the import receipts are all new code added on top.

---

## The one-line summary per commit

| Commit | What |
|---|---|
| `Add a full-arc driver…` | `session-test.js` — the zero-JS-error gate CONTRIBUTING always promised |
| `Delete the dormant tutorial…` | ~716 lines that could not execute |
| `Remove the submit-for-voting stub…` | A feature that did nothing, and the screen it led to |
| `Retire three of the four systems…` | Intro deck, corner coach, "Why this step?" |
| `Consolidate the controls on each screen` | Fewer, clearer controls; same capability |
| `Stop the toast covering things…` | Two real bugs |
| `Make the BYO-LLM prompts findable…` | A dead entry point, and a copy-paste flow that read like a dev tool |
| `Add an auto-layout button` | Overlapping cards, and toasts landing under the dock |
| `Make auto-layout hold up on a lattice…` | The first version only behaved on trees |
| `Give the workbook its screen back…` | 45% of the viewport was chrome; no stage navigation |
| `Unlock Patterns and Themes from the start` | Seed Mode removed — owner's call, and it contradicts a PRD MUST |
| `Make CSV import say what it actually did` | Silently dropped rows; a cancelled import left no trace |
| `Make both ways of adding extracts work from the canvas` | Five bugs between the dock and the board |
| `Check what the export actually contains` | The driver only counted files; now it opens the site and the deck |
| `Remove the canvas level tabs` | A view switch that behaved as a lock, and persisted |
| `Make the deck & site export two files` | Ten files became two, rendered at export time |

## Removed: code that already couldn't run

None of this was reachable from the UI before the cleanup. Restoring it means
reviving the entry point too, not just the code.

- **The interactive guided tutorial** — ~550 lines of JS, a highlight ring, a
  coach panel, 90 lines of CSS, the `TUTORIAL_STEPS` script (a full worked
  example on *neighbourhood food access*), and about twenty live `tutorialMode`
  guards. `tutorialStart()` had no callers; the product removed it in `b542616`
  and left the machinery behind. **If you want a worked example — and the PRD's
  Area 1.2 argues you should — this is the best starting material in the
  repo's history.** `git show 1b0ea6e^:index.html` has it whole.
- `#tour-help-btn`, `updateTutorialLaunchBtn()`, `declineTutorialOffer()`,
  `#tutorial-offer-modal` — hooks for elements that never existed.
- `toggleMobileHeader()` / `ensureMobileHeaderFor()` — empty stubs.
- `onCommitRowChange()` / `getCheckedCommitIds()` / `updateCommitContinueButton()`
  — no-ops for a modal removed earlier.
- `appState.boardIntroSeen` — written, never read.
- Orphan CSS: `.tour-tooltip-step`, `.tour-tooltip p`, `.tour-step-count`.
- **`#canvas-hint`** — worth its own line. It was the only in-app listing of the
  keyboard and gesture shortcuts (`setupKeyboardNavigation()` still implements
  them all: space-to-pan, `Cmd/Ctrl+A`, `+`/`−`, `0` to fit, `1` to reset). It
  had been `opacity: 0` with nothing to raise it since its hover trigger was
  deleted. **Those shortcuts are still undiscoverable. That's a real design gap
  and a good Pod Squad build.**

## Removed: a feature that did nothing

**Submit for voting** → `#submit-modal` → `#artifact-screen`. The modal's own
copy admitted it: *"In a live deployment, this queues your work for community
review. In this prototype, it timestamps your submission and produces a
read-only artifact."* It set `appState.submittedAt` and navigated. Nothing
downstream read it — pod formation and voting live on the platform.

The artifact screen carried six more buttons: Back to Workspace, Print / Save
PDF, Download Markdown, a *second* "Produce the deck & site", Re-submit, and a
red Start Over. It sat one click from the real terminal action and lit up under
identical conditions.

`downloadMarkdown()` went with it. Its output is already in the working-folder
zip as `problem-situation.md`.

**If the OLOS ballot becomes real,** build against the ballot. Don't restore the
stub. (PRD §8, requirement 4.5, is updated to say so.)

## Removed: three of the four ways the tool explained itself

The tool had **four** parallel guidance systems. It now has one.

| Gone | Was |
|---|---|
| The 5-slide intro deck | Between opening the file and doing anything |
| The corner coach | A dismissible panel, keyed by screen *and* by action-bar state |
| "Why this step?" | An expander in the step rail, with a `STEP_WHY` essay per step |
| The loop note | "↺ This is a loop — revisit any step as you learn more", on every screen |

**Kept: the action bar.** One next action; when it's locked, the reason. It is
the thing a facilitator can point at. Also kept: the concept-naming invite —
that's a method beat, not scaffolding.

The intro deck's copy is real writing and is not reproduced anywhere else:
`git show 3e72d33^:index.html` if you want it.

## Consolidated: same capability, fewer controls

- **Sources: 14 actionable controls → 6.** Three ways in on one row (sample,
  ✨ Extract, Upload CSV), one line of help, and one "Other ways to add
  extracts" disclosure holding the CSV template, the append/replace choice, the
  AI dataset-conversion prompt, and the type-one-by-hand bar. Nothing lost.
- **"Skip to Canvas" removed** — it jumps the sort, which is where the method
  happens.
- **"Start over (reset)" moved** off the Sources nav into the Share / Export
  sheet as a danger row, and its `window.confirm` (with the self-destruct joke)
  became the toast-with-an-action pattern the unframe flow already uses. A
  board-wiping button does not belong beside the forward action with forty
  people in the room.
- **Share / Export de-duplicated** — it was in the board header *and* in the
  action bar's secondary row in six of nine states. The header keeps it.
- **"Export the whole canvas"** now shows only when there's no mapped
  situation. It's `exportWorkingFolder` without the named-situation gate, and
  the working-folder zip already carries the whole board.

## Added: the BYO-LLM prompts got an entry point and a walkthrough

Not a removal, but it belongs in the same record. `openHubAIModal()` and
`openHubNamePromptModal()` were **dead functions** — the per-card prompts had no
caller anywhere in the UI, despite being the richest part of the library. Every
card now carries a ✨ **AI** button (using `.hub-ai-btn`, which was already in
the stylesheet with nothing rendering it).

Both prompt surfaces also stopped leading with the raw prompt — a wall of
`<role>` XML — and now lead with a numbered **copy → paste → argue with it**
walkthrough, with the prompt text folded behind a labelled disclosure and the
five paste destinations as buttons.

## Added: an auto-layout button

New nodes are seeded on a phyllotaxis spiral with 110px of radial spacing
against cards 240–400px wide, so any real board starts out overlapping — 104
overlapping pairs on a 21-extract sample with two ladders. **⊞** in the canvas
toolbar lays the graph out as tiers (barycentre ordering, parents centred over
children, ladders side by side, unused extracts pooled below), recomputes the
situation boxes, and is undoable from the toast.

The first version only behaved on **trees**. The method is a many-to-many
lattice, and a latticed board came out tangled — the ordering pass sorted
unconnected nodes to the far right of their band and never settled, it kept
whatever its last pass produced rather than the best, and the coordinate pass
cascaded every collision rightward across the canvas. Rewritten as a proper
layered pass: median ordering with transpose, isotonic (pool-adjacent-violators)
placement, best-kept across iterations, and three seeds tried because the spiral
that seeds the order starts at `Math.random()` — so the same board used to lay
out differently on every press. On a 42-edge latticed fixture that took
crossings from 46.5 average (42–51 spread) to a repeatable 32, and average edge
length from 721px to 602px, with no regression on trees.

**Pressing it twice used to rearrange the board.** Best-of-N restarts is a
heuristic, not a function — started again from its own output it can find
something better. It now runs to a fixed point, so a second press is a no-op.
Note that the *first* press still varies run to run (9 to 23 crossings on the
same fixture): the seed order is read from node positions laid down by a spiral
that starts at `Math.random()`. Making the result independent of that would mean
ignoring where the user had put things, which is a real trade-off, not an
oversight.

**Still open: width.** The drawing is as wide as its widest band, which is
always the extracts — 16 of them in a row is ~4,400px, so a big board fits the
screen at about 35% zoom. Stacking tier 0 into two sub-rows would roughly halve
that and double the readable zoom. It's the obvious next move, and it wasn't
worth making the night before a session because it changes the one-band-per-tier
model the crossing counter assumes.

The spiral seeding is untouched — it is fine for the first few cards and
auto-layout is the way out once it isn't. Running it automatically the first
time a board crosses some node count is the other obvious follow-up.

## Added: the workbook stage nav, and its screen back

The five Deepen stages are a ~4,000px scroll, and 45% of a 1366×768 laptop
viewport was header, step rail and footer — the first question sat at y=494.
The header's standing explanation of the five stages went the same way as the
coach and "Why this step?"; the header is now one row and the footer one row.
In their place a **sticky stage nav**: five chips, current one highlighted on
scroll, ticks on answered stages, one click to any of them. Permanently
occupied chrome went *down* (95px → 79px) while gaining the navigation.

  laptop  342px (45%) → 184px (24%),  first field y=494 → y=366
  phone   411px (49%) → 185px (22%),  first field y=594 → y=372

## Removed: Seed Mode — the one cut that contradicts the spec

**Owner's decision, and worth reading before anyone re-litigates it.**

New boards used to start in Seed Mode: tier-1 was a "Hunch", the
Pattern/Theme/Super-theme tools were hidden, the ladder refused to climb,
classification and the site export were refused, and the way out was a one-way
"Unlock Patterns & Themes" threshold sheet. Now every tier's tool is in the
dock from the first card and two named Evidence cards climb to a Pattern with
nothing in between.

The argument for removing it: that design serves a first-timer meeting the tool
**alone**. In a facilitated room the poderator introduces the ladder out loud,
so a one-way gate sits in the middle of the thing being taught.

**The argument against, which is on the record:** PRD §5 requirement **1.1 is a
MUST** — *"Seed Mode is the front door"* — and the "ceiling, not floor"
principle in §2 argues the same. Those are now marked reversed in the PRD
rather than quietly deleted. **If this tool is ever shipped for unaccompanied
first-timers again, the progressive on-ramp needs rebuilding.**
`git show be5a1cc^:index.html` has the whole apparatus.

Two things were kept rather than deleted with it:

- The seed branch of `computeNextAction()` carried the only first-move hint on
  an empty board. It became a `'connect'` state with the same hint.
- **"Compile concept (.md)"** was offered *only* in Seed Mode, so removing Seed
  would have silently dropped one of the three exports the README documents. It
  now sits in the Share / Export sheet unconditionally.

**The locks stay.** Seed Mode switched off `evidenceLabelLocked` and
`hubLocked`; those are Dorst's syndromes made mechanical, so they now apply from
the start. The one behaviour change for saved boards: a tier-1 card with fewer
than two extracts becomes name-locked — exactly what already happened to any
Seed board whose owner pressed Unlock.

## Fixed: four real bugs

1. **The toast covered what it interrupted.** `#toast-region` was pinned to the
   bottom at `z-index: 2000` with nothing keeping it clear. On the sort screen
   it landed squarely on the gesture legend — `← noise · signal → · ↑ super` —
   at the moment a first-time sorter needs it, and it covered the workspace
   action bar too. Toasts now respect `--ab-h`; the legend is lifted clear.
   `session-test.js` asserts the two boxes don't intersect.
2. **Toasts also drew on top of open modals** (`z-index` 2000 against 1000),
   and once they cleared the action bar they landed on the modals' own buttons.
   A `modal-open` class on `body` drops them back to the floor while a modal is
   up.
3. **Toasts slid under whichever bar was on screen.** On the board the canvas
   dock floats above the action bar, so a toast clearing only the action bar
   landed on the dock — Undo, Delete-underpopulated and the Unframe confirm all
   had buttons that could not be pressed. On the workbook, its sticky footer
   sits inside a scroller with 32px of bottom padding, so it rests above the
   window's edge and its own height undercounts the clearance. Every bar now
   publishes the measured gap from the window bottom rather than its height.
4. **The export gate wouldn't say what was wrong.** Producing the deck is gated
   on the five Deepen stages. From `#produce-deck-btn` the block is explained
   ("Missing: the paradox — Stage 5"), but `exportModular()` is reachable from
   three other places, and all three gave the same generic paragraph listing
   every requirement. It now names the one missing thing and offers to take you
   there.

## Fixed: adding extracts once the room is on the canvas

Evidence arrives mid-session — a table finds a dataset, or runs another
interview. The dock's **＋ Extracts** button was already there, and the chooser
behind it offered all three ways in. None of it survived contact.

1. **The verification gate opened *behind* the CSV picker that launched it.**
   Every `.modal-overlay` carries `z-index: 1000`, so when modals stack the
   winner is whichever sits later in the document — and `#board-csv-modal` is
   16 lines below `#qa-verify-modal`. Choosing a file appeared to do nothing,
   and clicking where the gate's confirm button was hit the picker's Cancel.
   `openModal()` now raises each modal above whatever is already open, and
   Escape and the Tab trap follow the one on top rather than the first in the
   document.
2. **✨ Extract from sources dropped canvas-side extracts into limbo.**
   `tgxExtractParseAndAdd()` hardcoded `target: 'setup'`, so extracting from
   the board appended to the pool: nothing on the canvas, no sorting decision,
   the cursor left short. The cards existed in state and appeared nowhere — and
   because they were unsorted, the next reload resumed into the sorting queue
   instead of the board, which reads as the board having been lost. It now
   routes by the screen you opened it from.
3. **The Sources "Replace existing pool" radio was live on the canvas.** The
   extractor read `input[name="csv-mode"]:checked` wherever it ran. A table that
   had touched that radio an hour earlier, on the Sources screen, would have
   had `appState.items` replaced and every Evidence card emptied — mid-session,
   from a button that says "Add". Append/replace is a Sources choice now.
4. **A board-side import reported only through a toast**, which is the thing the
   previous commit had just finished fixing everywhere else. All three surfaces
   — Sources, the board CSV modal, the extractor — now write the same sentence
   where the import happened, and the toast only fires when no such surface is
   on screen. New cards land off-screen by design (`placeNodesInFreeSpace()`
   puts them right of everything else), so the view now pans to them: seeing the
   cards is the receipt.
5. **＋ Extracts wore Evidence's glyph.** `hydrateDockGlyphs()` treated any dock
   button without a `data-tool` as Evidence, so the ＋ was overwritten with the
   dashed circle. On a phone, where the dock hides its labels, the one way to
   add data looked like a duplicate of the tool beside it.

## Checked: the export still builds the site and the deck

**Produce the deck & site** was only ever asserted as far as "a file was
downloaded" — the driver never opened the zip. Driven end to end now, three
times, on a complete board:

`index.html` · `slides.html` · `README.md` · `assets/style.css` ·
`assets/viewer.js` · `data/project.jsonld` · `data/extracts.csv` ·
`data/site-data.js` · `content/situation.md` · `content/themes.md`

`index.html` is a 413-byte shell by design — it hydrates from
`data/site-data.js` and renders the board title, the web map as SVG, the themes,
the problem situation and every source extract (23k of text, 55 map nodes on the
sample board). `slides.html` is a six-slide, self-contained deck built from the
mapped situation: cover, paradox, evidence, themes, live-inquiry, join. Neither
reaches for a CDN, a font service or a network of any kind.

One fix: the viewer tried `fetch()` first and fell back to the embedded shim
when it failed. That works, but on `file://` — how these get looked at — the
fallback cost four red console errors before it fired. It now skips straight to
the shim when the protocol is `file:`, and keeps fetching when served, so a pod
that edits `content/*.md` in its repo still sees the edit without regenerating.

`session-test.js` now writes the export folder to disk and opens both pages from
`file://`, asserting they render and that the console is clean.

## Removed: the canvas level tabs (owner's call, from the field)

`ALL · SOURCE EXTRACTS · EVIDENCE · PATTERN · THEME …` — the small bar that
floated top-left over the canvas, one tab per tier that existed. Reported as
"not working for people and bugging out", and reproducing it shows why.

It reads as a view switch. It behaves as a lock. Selecting a tier ran
`applyViewState()`, which put `.view-dim` on every node outside that tier:

```css
.canvas-node.view-dim { opacity: 0.22; pointer-events: none; transform: scale(0.78); }
```

On an eleven-card board, one tap left **ten cards faded to 22%, shrunk to 78%,
and completely non-interactive** — not draggable, not linkable, not openable.
And `setCanvasView()` called `scheduleSave()`, so the choice persisted: the
board came back frozen after a reload, with the only way out a word in a corner
that a participant had no reason to connect to what had happened to their map.

Nothing about it was recoverable by the gestures people actually try — panning,
zooming, clicking a card, reloading. At a table on a Saturday morning that is a
lost map.

Removed: the markup, `existingTiers()`, `normalizedView()`, `buildViewTabs()`,
`setCanvasView()`, `applyViewState()`, both calls in `renderAllNodes()`, the
`.view-tab*` and `.canvas-node.view-dim` CSS with their phone media rules, and
the two marquee hit-tests that excluded `.view-dim` (they now select every card,
which is what a marquee should always have done).

`appState.canvasViewState` stays in `defaultState()` and `normalizeState()` so
boards saved mid-filter still parse — nothing reads it, and nothing applies the
dim class any more. `session-test.js` loads exactly such a board and asserts it
comes back whole and clickable.

## Removed: eight of the ten files in the deck & site export

The export shipped a folder:

```
index.html          417 B    a shell that rendered nothing on its own
slides.html       7,256 B    the deck (already self-contained)
README.md         1,101 B    how to host the folder on GitHub Pages
assets/style.css  1,182 B
assets/viewer.js  5,295 B    a CSV parser + a Markdown parser + fetch/hydrate logic
data/project.jsonld  33 KB   the graph, as JSON-LD
data/extracts.csv    13 KB   the extracts, again
data/site-data.js    50 KB   all of the above, again, as a file:// fallback
content/situation.md  6 KB
content/themes.md     5 KB
```

The owner's note: *"far too complex. This is meant to be an entry level set of two files
for them to begin practicing vibecoding. So adding separate css files and markdowns etc
etc is complicating it."*

All of it followed from one decision: **ship data plus a client-side renderer.** The same
content was therefore serialised three times, and the file a beginner opened first was
nine lines of `<script src>`.

Inverted. The app holds the content as live objects at export time, so it renders the
HTML *there* and ships the finished page. **Two files now — `index.html` and
`slides.html`, no zip.** `index.html` is 279 lines: `<!doctype html>`, an inline
`<style>` whose colour variables are on line one, the themes and the problem situation as
real headings and paragraphs, the extracts as a `<ul>`, and the web map as inline SVG at
the bottom where the generated markup isn't the first thing anyone scrolls past. No
`<script>`, no `<link>`, no `src=`, no `fetch`.

Removed: `SITE_VIEWER_JS` (76 lines of stringified renderer), `buildProjectJsonld()`,
`buildExtractsCsv()`, `buildSiteDataJs()`, `buildSiteReadme()`. Added in their place, as
real app code rather than a shipped string: `siteMdToHtml()`, `siteMapSvg()`,
`siteExtractsHtml()`. `SITE_STYLE_CSS` survives, inlined into the page.

Two smaller consequences, both corrections:

- **The export stopped opening the Git handoff sheet.** That modal says *"This .zip is
  your working folder — your whole board as data (`state.json`)"*, which describes the
  *other* export and was already wrong here. It now shows a toast naming the two files.
- **Headings shift down one level.** Both Markdown documents open with their own `# `, so
  the page used to carry three `<h1>`s and a doubled heading under each section label.
  One `<h1>` now — the board's name. Worth getting right in a file people are about to
  read as an example of HTML.

**Nothing was lost.** The machine-readable trail is the **working folder** export, which
still ships `state.json`, `problem-situation.md`, `gap-analysis.md` and a folder per card,
and is untouched. `docs/PRD-triangulator-finalization.md` §7a — which made
`project.jsonld` "the canonical seed contract" — is struck through with the reasoning on
both sides, the same treatment requirement 1.1 already carries.

## How to get any of it back

Every commit is independent and revert-clean:

```bash
git log --oneline main..claude/app-review-uiux-cleanup-w06k8y
git revert <sha>                 # put one back
git show <sha>^:index.html       # read the file as it was, without reverting
```

Or run the session from `main` at `cb2b340`, which is what the live GitHub Pages
URL serves until this branch merges.

**Before you restore anything, run `node session-test.js`.** If your restored
code calls a function these commits deleted, the zero-JS-error gate will tell
you immediately rather than at a table on a Saturday morning.
