# The Triangulator-inator

An **evidence-first sensemaking canvas** built on a deliberate inversion of Kees Dorst's Frame Innovation method. Dorst starts with a client who hands you a problem. We start with **neither a client nor a problem** — only raw evidence from the field. You gather source extracts, sort signal from noise, triangulate the survivors up a ladder of evidence, and let the problem *emerge* — until you can name the **Problem Situation**, the **paradox** that keeps it stuck, and the **candidate problem owners** who could break it. Then you export your **working folder** into your pod's shared repository and submit your problem statement in **OLOS**, where the cohort reviews the gallery, votes, and pods form. (A ready-to-host site + slide deck export remains available as an optional showcase.)

The whole sequence is a **loop, not a pipeline**: nothing is ever "done." As each step teaches you something, you circle back — add sources, re-sort, reconnect, re-map, re-deepen.

**Try it live: [theupskillinglabs.github.io/triangles](https://theupskillinglabs.github.io/triangles/)**

Created for **The Upskilling Labs** by **Levy Strategic Design**. Open source under the [MIT License](LICENSE).

---

## Try it in 60 seconds

There is no build step, no server, no install, and no account.

1. Open **`index.html`** in any modern browser (double-click works — it runs from `file://`), or use the live URL above.
2. On the Sources screen, click **Load 48 Civics & Elections source extracts** — real material from a field survey; every card cites the survey response it came from.
3. Follow the bar at the bottom of the screen. It always shows your one next move.

Everything auto-saves to your browser's `localStorage`. The app works fully offline after first load. **Nothing you enter ever leaves your browser.**

## The journey

A bottom **action bar** carries you through the whole arc — it always shows exactly one primary action for wherever you are, and if that action is locked, it names the one thing that unblocks it. That bar is the whole guidance system: the tool used to also carry an intro deck, a corner coach and a "Why this step?" panel, all explaining the same thing in parallel. They were removed for the facilitated sessions, where a poderator carries the why out loud.

1. **Gather source extracts** (`Sources`) — load the sample, upload a CSV (`title,summary[,source_url]`), ✨ extract cards from an article or dataset with your own AI, or type one by hand. Go wide — include what might contradict you. **You do not name a problem first.** The problem comes into focus later, once the evidence has something to say.

   Evidence keeps arriving after you've started, so all three ways in stay open once you're on the canvas: **＋ Extracts** in the dock offers the same CSV upload, the same ✨ extractor, and a card by hand. Cards added there land in open space beside your map, already sorted, and the view moves to them. Every import says what it did — how many cards, and how many rows it couldn't use — where the import happened, not in a toast that's gone before you've read it.

2. **Sort signal from noise** (`Sort`) — swipe each extract: **noise** (left / ←), **signal** (right / →), or **★ super signal** (up / ↑). Fast binary commitment is the point: where you hesitate is data about a belief you haven't earned.

3. **Triangulate** (`Validate`) — drag a glowing edge dot from one extract onto another (or use the **Link** tool in the dock) and two extracts pointing at the same condition become an **Evidence** card. Name the claim. Once you've kept a critical mass of extracts (~10), the tool *invites* you to name the problem concept taking shape — optional, dismissible, revisable.

   Cards land where you drop them, and a busy board gets tangled. **⊞ Auto-layout** in the canvas toolbar rebuilds it as tiers — extracts along the bottom, each claim centred over what it rests on, separate ladders side by side, and the extracts you haven't used yet pooled underneath. It's undoable from the toast if you'd hand-arranged things.

4. **Climb the ladder** — every tier's tool is in the dock from the first card. Evidence climbs into **Patterns** (named mechanisms), Patterns into **Themes**, Themes toward the situation. Every card stays locked until the cards beneath it are named and described — each claim must stand on examined ones. That lock is the method; there is no gate in front of it.

5. **Map the Problem Situation** (`Map`) — with at least one named, described Theme, synthesize the ladder into a **Problem Situation**: an open, complex, networked condition — not yet a problem to solve.

6. **Classify the evidence** (`Classify`) — Dorst's seven evidence types (history, counterfactual, problem, boundary, flux, player, value), introduced one at a time in Dorst's order. See where your coverage is thin.

7. **Deepen** (`Deepen`) — a five-stage workbook that converges on the point of the whole exercise. A sticky stage bar tracks which stage you're in, ticks the ones you've answered, and jumps to any of them:
   - **Stage 1** Solidify the situation · **Stage 2** Evidence landscape & research agenda · **Stage 3** Research access
   - **Stage 4 — Context & field: map the players.** Inner circle first (the directly implicated — *candidate problem owners come from here*), then the wider field (where themes and status-quo beneficiaries live). Candidate owners are marked "(not yet approached)" until a real conversation has happened.
   - **Stage 5 — Find the paradox(es).** The deadlock the field sustains: *"the situation demands X, but the same conditions that create the need prevent X from working."* Hold multiple candidate paradoxes, link each to who benefits from it persisting and to the evidence behind **both** legs of the contradiction, and pass the sharpness self-check — which is carried honestly into everything you export.

8. **Export your working folder** — the terminal action: commit it to your pod's shared repo, then submit your problem situation in OLOS with the repo link. (The deck & site export remains as an optional showcase — see "What comes out" below.)

## The method, in brief

- **The ladder:** Source Extract (tier 0) → Evidence (1) → Pattern (2) → Theme (3) → Super-theme (4) and up. A many-to-many lattice, not a tree — nodes can have multiple parents.
- **The inversion:** no client vouches for this problem, so the **evidence is the warrant**. Everywhere the paradox is asserted — deck, site, situation document — the tool attaches *how we know*: the extracts and themes it was read off.
- **The five syndromes the locks head off** (Dorst): the Lone Warrior, Freeze the World, the Self-Made Box, the Rational High Ground, and Identification. Every gate you hit in the tool is one of these, prevented mechanically.
- **The paradox is field-intrinsic** — a self-undoing structural contradiction verified by *who benefits from it persisting* (there's no stuck client to verify pain, so cui bono is the honesty gate).
- **The problem owner is an output, not an input** — discovered in the Context ring of the field map, then approached. A candidate owner is a hypothesis until someone has actually talked to them.
- **Honest deliverables:** the deck includes "What we're still testing" — open questions, ungrounded tensions, unclaimed sharpness. Meet the Pods presents a live inquiry, not performed completion.

## What comes out

Three exports, all reachable from the **Share / Export** sheet (and offered by the action bar when you're ready). The sheet is also where **Start over** lives — clearing the board is a deliberate trip, not a button beside the forward action:

| Export | When | Contents |
|---|---|---|
| **Meet-the-Pods site & deck** (`.zip`, optional showcase) | Workspace complete, real title | 10 files: a GitHub-Pages-ready `index.html` (web map + themes + situation + extracts), `slides.html` (the Meet-the-Pods deck), `README.md`, `assets/` (viewer + styles), `data/project.jsonld` (semantic graph), `data/extracts.csv`, `data/site-data.js` (offline fallback), `content/situation.md`, `content/themes.md` |
| **Working folder** (`.zip`) | Any mapped situation | `problem-situation.md`, `gap-analysis.md`, per-card folders (`card.json`, `notes.md`, `deepen.md`, `evidence.md`, attached sources), and **`state.json`** — a full re-importable board snapshot |
| **Concept summary** (`.md`) | Any time | Your provisional concept + your Evidence cards with their supporting extracts |

After any export, a **Git handoff** panel walks you through committing the folder into your Pod's shared repository. The **Open a shared folder** action (in the same sheet) imports a podmate's exported zip — merge or replace — which is how a whole Pod builds one map: export → commit → merge, and where Git finds a conflict, two people mapped the same thing differently and should talk. That conversation is the feature.

## Your AI, not ours

The tool contains **no AI**. Every ✨ **AI prompts** button builds a prompt out of what's on your board, copies it to your clipboard, and leaves the thinking to you and *your own* model. This is a governance decision, not a limitation: your data never leaves your browser, and the analytical judgment stays yours.

Wherever you are, the prompt for that thing is one click away:

| Where | Button | Prompts |
|---|---|---|
| Sources | ✨ **Extract from sources** | Turn an article, transcript, or dataset into extract cards |
| Board (header) | ✨ **AI prompts** | Landscape · Stress-test sorting · Find bridges · 🔍 Blind-spot audit |
| Any card | ✨ **AI** | Through-line · Name & describe · Stress-test |
| A problem situation | ✨ **AI prompts** · 🔍 **Audit** | Paradoxes · Frame · Stakeholders · Problematize · Interviews |

Every one of them opens the same three steps — **copy the prompt**, **open your AI and paste it in** (Claude, ChatGPT, Gemini, NotebookLM, Perplexity), **bring it back and argue with it**. The prompt text itself is folded away behind "See the prompt text"; you never have to read the XML unless you want to. Prompts are rebuilt from the live board every time you open them, so re-running one after the card changes gives you a different answer.

The **Blind-spot audit** deserves its own mention: it compiles your entire canvas into a hostile critic. It's the one to reach for when everything feels too tidy.

## Data & privacy

- State lives in your browser's `localStorage` under the key `olos.sensemaking.v2` (older `v1` state auto-migrates; **saved boards are never broken by updates** — that's a hard invariant).
- **Per-browser, per-device.** Your board does not sync anywhere by itself. Moving work between people or machines happens by export/import (see above).
- Works offline. Makes no network requests with your data. "Self-destruct" on the Sources screen wipes local state.

## For developers

- **One file.** The entire app — HTML, CSS, JS — is `index.html` (~9,200 lines, vanilla JS, no dependencies, no build). It must keep working when opened from `file://`.
- **The additive invariant:** never break a saved board. New persisted fields must be optional and read with defaults; no migrations of existing state shapes beyond the established normalizer.
- **Verification:** `node session-test.js` drives the real app headlessly with Playwright — the full arc from Sources to three exports, plus old-saved-board loads — and fails on any uncaught exception or console error. `node cursor-test.js` covers canvas cursor states. Both run against `file://`. See [CONTRIBUTING.md](CONTRIBUTING.md).
- **Branches & PRs:** feature branches, PRs merged with merge commits. Pod Squad work uses `podsquad/<slug>` branches.

## Documentation

| Doc | For |
|---|---|
| [docs/PODSQUAD-ONBOARDING.md](docs/PODSQUAD-ONBOARDING.md) | **Start here if you're Pod Squad.** This tool is a starting place, and that doc is your invitation to rebuild it — fork it, prototype, feature-harvest, and ship the version the cycle deserves. |
| [docs/SENSEMAKING-SPRINT.md](docs/SENSEMAKING-SPRINT.md) | The co-design brief for the first in-person sensemaking event — draft run-of-show + the open questions the Pod Squad owns. |
| [docs/PRD-triangulator-finalization.md](docs/PRD-triangulator-finalization.md) | The product spec: cycle integration, seams to the OLOS platform, build order, design decisions. |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Repo conventions, how to run the drivers, how to propose changes. |
| [docs/CLEANUP-2026-07.md](docs/CLEANUP-2026-07.md) | What was removed before the Sensemaking Sprint, why, and how to restore any of it. Read before rebuilding something that looks missing. |

## Accessibility

WCAG-AA color contrast throughout; card types carry a shape channel in addition to color (colorblind-safe); keyboard paths for sorting (arrow keys) and canvas work; 44pt touch targets and bottom-sheet modals on mobile; `prefers-reduced-motion` respected.

---

**The Upskilling Labs** · Washington, DC · built in the open.
