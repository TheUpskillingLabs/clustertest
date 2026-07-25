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

`index.html` went from **10,349 to ~9,370 lines** — 1,159 net lines out, with the BYO-LLM walkthrough added back in.

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
