# The Triangulator-inator

A problem-framing instrument built on Kees Dorst's Frame Creation method. Load a pool of raw observations, sort them into signals and noise, triangulate the signals up a ladder of evidence, and synthesize the open condition worth framing.

Try it: **theupskillinglabs.github.io/triangles/**

An open-source project created for **The Upskilling Labs** by **Levy Strategic Design**.

---

## What it does

You start with an **observation pool**: raw material from the world — field notes, interview fragments, articles, statistics, policies, anecdotes. Your job is to work through them, surface the real signals hiding inside, triangulate those signals into layered evidence, and climb until you can name the open condition underneath it all.

The tool walks you through four stages:

1. **Sort the observations** — swipe through each observation card to classify it as **noise** (left), **signal** (right), or **★ super signal** (up). The binary forces intellectual commitment. Super signals mark what you consider most urgent or revelatory. Your sorting decisions become analytical data — the AI uses what you kept versus discarded to challenge your instincts.

2. **Triangulate on the canvas** — drag surviving signals onto a web map and connect them up a ladder of cards. Connecting two of anything creates the next level: two **signals** → an **evidence card**; two evidence cards → a **pattern**; two patterns → a **theme**; two themes → a **super-theme**; and on up. Evidence cards start unclassified — classify each into one of seven types when the pattern is clear. Nodes can have multiple parents: this is a **many-to-many lattice**, not a strict tree. A card at any level is locked for editing until every card it rests on is named and described — every claim must stand on examined ones.

3. **Push to the Problem Situation** — once every card is named and described, push forward and synthesize the whole ladder into a single **Problem Situation**: name it, frame it, map its stakeholders, and pressure-test it. AI prompts grounded in Dorst's methodology serve as thinking partners throughout.

4. **Artifact** — your framed Problem Situation with its full evidence trail, ready to print or download as Markdown.

---

## The ladder

| Level | What it is | Created by |
|---|---|---|
| **Observation** | Raw, unsorted material — the full pool you load at the start | Imported from CSV, sample data, or manual entry |
| **Signal** | An observation that survived sorting — a pattern of action or behavior, not an opinion | Sorting right or up |
| **Evidence** | An intermediate evidence card — created plain, then classified into one of seven types | Connecting two signals |
| **Pattern** | A specific, named mechanism that 2+ evidence cards triangulate toward | Connecting two evidence cards |
| **Theme** | A deeper universal that 2+ patterns triangulate toward — bridging human experience and structural/systemic factors | Connecting two patterns |
| **Super-theme / Mega-theme / …** | Higher convergences pointing toward a frame | Connecting two of the level below |
| **Problem Situation** | The apex — an open, complex, dynamic condition synthesized on the next screen | Pushing once every card is named & described |

### The seven evidence types

Evidence cards are organized into two analytical phases:

**Archaeology & Context** — excavating the problem's history and hard limits:

| Type | Color | What it captures |
|---|---|---|
| **History** | Slate blue | What happened / what was done |
| **Counterfactual** | Violet | The path not taken |
| **Boundary** | Deep red | A "they will never…" nonnegotiable |
| **Flux** | Amber | A point of movement or potential change |
| **Problem** | Orange | A bounded difficulty, solvable conventionally |

**Field mapping** — mapping the wider field of players and values:

| Type | Color | What it captures |
|---|---|---|
| **Player** | Teal | A stakeholder, defined by practices & currency |
| **Value** | Green | A deeper or universal value from the field |

**Player** cards also have a **role**: Inner-circle (already involved), Wider-field (not yet involved but influential), or Owner/Client (could own this problem situation).

The ✨ AI button on every evidence card generates a type-specific prompt grounded in Dorst's methodology — a thinking partner for classifying the evidence and naming the claim.

---

## Getting started

Open `index.html` in any modern browser. No build step, no server, no dependencies — everything is in one file.

1. Load observations — use the 44 sample observations, upload a CSV, or add manually
2. Click **Start Sorting** to enter the swipe-based sorting phase
3. After sorting, the canvas opens with your surviving signals ready to triangulate

Your session is saved automatically to `localStorage`, so you can close and reopen without losing work.

### The guided tutorial

First-time visitors are offered a **5-minute interactive tutorial** (also available any time via the **Tutorial** button). It runs on a self-contained worked example — *neighborhood food access* — completely sandboxed from your own data:

1. **Sorting practice** — swipe three example observation cards (an opinion that's noise, an observed pattern that's a signal, and a reframing super signal), with an explanation after each swipe of *why* it sorts that way.
2. **Canvas walkthrough** — eight pre-placed signals. You connect two into an evidence card, classify it using the two-phase type picker, and name the claim. The tutorial fast-forwards sibling cards, then you build a pattern, climb to a theme, and reach the Push gate.

Along the way it teaches the Frame Creation reasoning behind each step: why binary sorting forces commitment, why two signals beat one anecdote, why patterns must name mechanisms, and why you frame before you solve. Exit at any step — nothing touches your workspace or saved state.

---

## Sorting your observations

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

---

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

---

## Building the ladder

1. Hover any signal card to reveal **dots** on its edges.
2. Drag from a dot to another signal — a plain **evidence card** appears at the midpoint. The signals stay where you placed them; connecting never reshuffles your layout.
3. Drag more signals onto the card to grow it. When the pattern is clear, classify the evidence card using the two-phase type picker (Archaeology & Context / Field mapping). You can reclassify any time via "Change type".
4. **Name and describe the card** — higher-tier cards are locked until every card they rest on is named and described. Every claim must stand on examined ones.
5. Connect two evidence cards to create a **Pattern**, two patterns to create a **Theme**, and so on. You always build one level at a time.
6. **Theme** cards show quality-check prompts:
   - *Bridge test:* Does this describe both a structural condition AND a human experience?
   - *Depth test:* Is this hidden beneath the surface of everyday professional life?
7. Nodes are color-coded by tier (and, for evidence cards, by type).

### Levels view

The tab bar at the top of the canvas lets you switch between **All**, **Signals**, and one tab per level that exists (Evidence, Pattern, Theme, …). **All** shows everything; each level view highlights its cards and fades the rest.

### AI prompts

The **✨ See the whole pool** button generates a prompt grounded in Dorst's methodology. If you've sorted, it partitions your observations by sorting decision and asks what your instincts reveal.

Every card has a **✨ AI** button. Prompts are level- and type-aware — an unclassified evidence card gets a "which of the seven types is this?" prompt; a classified History card gets an excavation prompt; a theme gets a bridge-the-domains prompt.

---

## Push to the Problem Situation

Once every card on the board is named and described — and the ladder has climbed to **at least one named and described theme** — the **Push to Problem Situation** button opens the synthesis screen:

- **Name & describe** the open condition
- **Frame it** — "If this situation is approached as if it is ___, then ___"
- **Map its stakeholders** — inner-circle, wider-field, owners/clients, gatekeepers
- **Pressure-test the framing** — hidden assumptions, structural biases, who benefits from the status quo

Each section has an AI prompt to take to your own AI tool — think with it, then come back and write in your own words. Once all sections are complete, you can submit.

---

## Exporting

From the Artifact screen:

- **Print / Save PDF** — browser print dialog
- **Download Markdown** — `.md` file with your full submission

---

## Technical notes

- Single HTML file — all CSS and JavaScript are inline
- No frameworks or build tools
- State persists to `localStorage` (key: `olos.sensemaking.v2`)
- Unified tiered data model: a single `cards[]` array where each card has a `tier` (1 = evidence … up) and a `childIds` array; the Problem Situation is one synthesized object
- Older state shapes (clusters, and the cards/themes/situations lattice) are auto-migrated on load
- Seven evidence types organized into two analytical phases (Archaeology & Context; Field mapping) with per-type SVG glyphs and Dorst-grounded AI prompts
- Design tokens: all tier colors (`--tier-1`…`--tier-6`), evidence-type colors (`--type-history` … `--type-problem`), the type scale with paired baseline-grid leading (`--text-*`/`--lead-*`, 8px baseline), spacing (`--space-*`), radii, rules, and shadows live in the `:root` block of `index.html`; JavaScript resolves colors from CSS at startup (`cssToken()`), so the canvas, dock, and cards can never disagree
- One tier-glyph language (dot → dashed circle → triangle → square → four-point star for Signal → Evidence → Pattern → Theme → Super-theme) shared by the bottom dock and card tags
- Hub locking: a card is locked for editing until every card it rests on is named and described; unlocks live as you type
- WCAG-AA contrast maintained across all evidence type color treatments; redundant shape channel (per-type glyph) for colorblind accessibility
- Per-screen onboarding tours with spotlight engine
- Sandboxed interactive tutorial: app state is swapped in-memory for example data, persistence is suspended, and steps advance on real user actions
- Works offline after first load
- Tested on Chrome, Safari, Firefox — desktop and mobile
