# The Triangulator-inator

A thinking instrument for Kees Dorst's Frame Creation model — sort friction signals, triangulate them up a ladder of cards, and synthesize a Problem Situation worth framing.

## What it does

You start with a pool of **friction signals**: raw evidence from the world — articles, datasets, observations, interview fragments, policies, statistics. Your job is to triangulate the patterns hiding inside them — sort the noise, classify the evidence, then build upward, level by level, until you can name the open condition underneath it all.

The tool walks you through four stages:

1. **Sort the signals** — swipe through each signal card to classify it as **noise** (swipe left), **signal** (swipe right), or **★ super signal** (swipe up). The binary forces intellectual commitment. Super signals mark the evidence you consider most urgent or revelatory. Your sorting decisions become analytical data — the AI uses what you kept vs. discarded to challenge your instincts.

2. **Triangulate on the canvas** — drag surviving signals onto a web map and connect them up a ladder of cards. Connecting two of anything one level up creates the next level: two **signals** → an **evidence card**; two evidence cards → a **pattern**; two patterns → a **theme**; two themes → a **super-theme**; and on up (mega-theme, …). Evidence cards start plain — keep adding signals, then classify each into one of seven types (History, Counterfactual, Boundary, Flux, Player, Value, or Problem) when the pattern is clear; the ✨ AI button can help. Nodes can have multiple parents — this is a **many-to-many lattice**, not a strict tree.

3. **Push to the Problem Situation** — once every card is named and described, push to the next screen and synthesize the whole ladder into a single **Problem Situation**: name it, frame it, map its stakeholders, and pressure-test it — with AI prompts grounded in Dorst's methodology as thinking partners.

4. **Artifact** — your framed Problem Situation with its full evidence trail, plus a peer-review preparation checklist.

## The ladder

| Level | What it is | Created by |
|---|---|---|
| **Signal** | Raw evidence — a pattern of action or behavior, not an opinion | Imported from CSV, sample data, or manual entry |
| **Evidence** | An intermediate evidence card — created plain, then classified into one of seven types (see below) | Connecting two signals |
| **Pattern** | A specific, named condition that 2+ evidence cards point toward together | Connecting two evidence cards |
| **Theme** | A deeper universal that 2+ patterns triangulate toward — bridges human experience and structural/systemic factors | Connecting two patterns |
| **Super-theme / Mega-theme / …** | Higher convergences where the human and structural meet, pointing toward a frame | Connecting two of the level below |
| **Problem Situation** | The apex — an open, complex, networked, dynamic condition synthesized on the next screen, not a node on the canvas | Pushing once every card is named & described |

### The seven evidence types

| Type | Color | What it captures |
|---|---|---|
| **History** | Slate blue | What happened / what was done |
| **Counterfactual** | Violet | The path not taken |
| **Boundary** | Deep red | A "they will never…" nonnegotiable |
| **Flux** | Amber | A point of movement or potential change |
| **Player** | Teal | A stakeholder, defined by practices & currency |
| **Value** | Green | A deeper or universal value from the field |
| **Problem** | Orange | A bounded difficulty, solvable conventionally |

**Player** cards also have a **role**: Inner-circle (already involved), Wider-field (not yet involved but influential), or Owner/Client (could own this problem situation).

## Getting started

Open `index.html` in any modern browser. No build step, no server, no dependencies — everything is in one file.

1. Load signals — use the 44 sample signals, upload a CSV, or add manually
2. Click **Start Sorting** to enter the swipe-based sorting phase
3. After sorting, the canvas opens with your surviving signals ready to triangulate

Your session is saved automatically to `localStorage`, so you can close and reopen without losing work.

### The guided tutorial

First-time visitors are offered a **5-minute interactive tutorial** (also available any time via the **🎓 Tutorial** button). It runs on a self-contained worked example — *neighborhood food access* — completely sandboxed from your own data:

1. **Sorting practice** — swipe three example cards (an opinion that's noise, an observed pattern that's a signal, and a reframing super signal), with an explanation after each swipe of *why* it sorts that way. The explanations adapt to whatever you actually swiped.
2. **Canvas walkthrough** — eight pre-placed signals. You connect two into an evidence card, classify it (learning the seven evidence types), and name the claim. The tutorial fast-forwards the sibling cards, then you build a pattern (mechanism, not topic) and climb to a theme (bridge test + depth test), ending at the Push gate without pushing.

Along the way it teaches the Frame Creation reasoning behind each step: why binary sorting forces commitment, why two signals beat one anecdote, why patterns must name mechanisms, and why you frame before you solve. Exit at any step — nothing in the tutorial touches your workspace or saved state.

Lightweight spotlight tours still run on first visit to each screen for UI orientation — click the **?** button to replay them.

## Signal sorting

The sorting screen is a pure gesture interface:

| Action | How |
|---|---|
| Keep as signal | Swipe right / press → |
| Discard as noise | Swipe left / press ← |
| Mark as super signal | Swipe up / press ↑ |
| Undo last decision | Click "undo" or Ctrl+Z |

- Cards show real-time feedback during drag — teal glow (right), desaturation (left), gold glow + lift (up)
- Super signals get a gold starburst animation on release
- Progress persists — you can close and resume mid-sort
- A hint bar fades after your first swipe

## Canvas interactions

| Action | Desktop | Mobile / Touch |
|---|---|---|
| Move a node | Drag the card | Drag with one finger |
| Pan the canvas | Drag background · Space + drag · Middle-mouse | Drag background with one finger |
| Zoom | Scroll · Ctrl/Cmd + scroll · `+` / `−` keys | Pinch with two fingers |
| Zoom out far | Scroll down (5%–250% range) | Pinch out |
| Connect nodes | Hover card → drag from an edge dot to another card | Tap card → drag from an edge dot |
| Fit all nodes | `0` key · click the `%` button | Tap `%` in zoom toolbar |
| Delete a connection | Click the edge → press Delete | Tap the edge → Delete button |
| Switch view state | Click tabs in the infobar | Same |
| Hide header chrome | `↕` button in zoom toolbar | Same |

## Building the ladder

1. Hover any signal card to reveal **dots** on its edges.
2. Drag from a dot to another signal — a plain **evidence card** appears at the midpoint. The signals stay where you placed them; connecting never reshuffles your layout.
3. Drag more signals onto the card to grow it — nodes can have multiple parents (many-to-many). When the pattern is clear, classify the evidence card using the inline type chips (or the ✨ AI button for help). You can re-classify any time via "Change type".
4. Connect two of anything to climb a level: evidence + evidence → **Pattern**, pattern + pattern → **Theme**, theme + theme → **Super-theme**, and on up. You always build one level at a time.
5. **Theme** cards show quality-check prompts:
   - *Bridge test:* Does this describe both a structural condition AND a human experience?
   - *Depth test:* Is this hidden beneath the surface of everyday professional life?
6. Nodes are color-coded by level (and, for evidence cards, by type).

### Levels view

The tab bar at the top of the canvas lets you switch between **All**, **Signals**, and one tab per level that exists (Evidence, Pattern, Theme, …). **All** shows everything at full size; each level view highlights its cards and fades the rest, so you can focus on one rung of the ladder at a time.

### AI prompts

The **✨ See the whole pool** button generates an AI prompt grounded in Dorst's Frame Creation methodology. If you've sorted your signals, it partitions them by your decisions (super/signal/noise) and asks what your sorting instincts reveal.

Every card has a **✨ AI** button with three modes: through-line discovery, name & describe, and stress-test. The prompts are level-aware — an unclassified evidence card gets a "which of the seven types is this?" prompt, while a theme gets a bridge-the-domains prompt.

## Push to the Problem Situation

Once **every card on the board is named and described**, the **Push to Problem Situation** button takes you to the next screen — a single synthesized **Problem Situation** drawing on your whole ladder. There you:

- **Name & describe** the open condition
- **Frame it** — "If this situation is approached as if it is ___, then ___"
- **Map its stakeholders** — inner-circle, wider-field, owners/clients, gatekeepers
- **Pressure-test the framing** — hidden assumptions, structural biases, who benefits from the status quo

Each section has an AI prompt you take to your own AI tool — think with it, then come back and write in your own words. Once all sections are complete, you can submit.

## Exporting

From the Artifact screen you can:

- **Print / Save PDF** — browser print dialog
- **Download Markdown** — `.md` file with your full submission

## Technical notes

- Single HTML file — all CSS and JavaScript are inline
- No frameworks or build tools
- State persists to `localStorage` (key: `olos.sensemaking.v2`)
- Unified tiered data model: a single `cards[]` array where each card has a `tier` (1 = evidence … up) and a `childIds` array; the Problem Situation is one synthesized object
- Older state shapes (clusters, and the cards/themes/situations lattice) are auto-migrated on load
- Per-screen onboarding tours with spotlight engine
- Sandboxed interactive tutorial: the app state is swapped in-memory for example data, persistence is suspended, and steps advance on real user actions (swipes, connections, classification, naming)
- Works offline after first load
- Tested on Chrome, Safari, Firefox — desktop and mobile
