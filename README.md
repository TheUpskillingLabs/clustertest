# The Triangulator-inator

A thinking instrument for Kees Dorst's Frame Creation model — sort friction signals, triangulate through seven evidence types, build themes, and surface a Problem Situation worth framing.

## What it does

You start with a pool of **friction signals**: raw evidence from the world — articles, datasets, observations, interview fragments, policies, statistics. Your job is to triangulate the patterns hiding inside them — sort the noise, classify the evidence, then go deeper to find the themes that bridge human experience and structural forces.

The tool walks you through four stages:

1. **Sort the signals** — swipe through each signal card to classify it as **noise** (swipe left), **signal** (swipe right), or **★ super signal** (swipe up). The binary forces intellectual commitment. Super signals mark the evidence you consider most urgent or revelatory. Your sorting decisions become analytical data — the AI uses what you kept vs. discarded to challenge your instincts.

2. **Triangulate on the canvas** — drag surviving signals onto a web map and connect them. Connecting two signals creates a plain **evidence card** — keep adding signals to it, then classify it into one of seven types (History, Counterfactual, Boundary, Flux, Player, Value, or Problem) once the pattern is clear; the ✨ AI button can help you decide. Connect two cards to create a **Theme**. Connect two themes to create a **Problem Situation**. Signals can belong to multiple cards — this is a **many-to-many lattice**, not a tree.

3. **Map & pressure-test** — for each committed theme, map who's affected and pressure-test your framing, with AI prompts grounded in Dorst's methodology as thinking partners.

4. **Artifact** — a structured summary of your committed themes and their evidence trails, with a peer review preparation checklist.

## The lattice

| Object | What it is | Created by |
|---|---|---|
| **Signal** | Raw evidence — a pattern of action or behavior, not an opinion | Imported from CSV, sample data, or manual entry |
| **Card** | An intermediate evidence card — created plain, then classified into one of seven types (see below) | Connecting two signals on the canvas |
| **Theme** | A deeper universal that 2+ cards triangulate toward — bridges human experience and structural/systemic factors | Connecting two cards |
| **Problem Situation** | An open, complex, networked, dynamic condition — not a bounded problem but a situation worth framing | Connecting two themes |

### The seven card types

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

Your session is saved automatically to `localStorage`, so you can close and reopen without losing work. A guided tour runs on first visit to each screen — click the **?** button to replay it.

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

## Building the lattice

1. Hover any signal card to reveal **dots** on its edges.
2. Drag from a dot to another signal — a plain **evidence card** appears at the midpoint. The signals stay where you placed them; connecting never reshuffles your layout.
3. Drag more signals onto the card to grow it — signals can belong to multiple cards (many-to-many). When the pattern is clear, classify the card using the inline type chips (or the ✨ AI button for help). You can re-classify any time via "Change type".
4. Connect two cards to create a **Theme**. Themes show quality-check prompts:
   - *Bridge test:* Does this theme describe both a structural condition AND a human experience?
   - *Depth test:* Is this hidden beneath the surface of everyday professional life?
5. Connect two themes to create a **Problem Situation** with a frame prompt: "If this situation is approached as if it is ___, then ___"
6. Nodes are color-coded by type and layer.

### View states

The tab bar at the top of the canvas lets you switch between **All** and four focused views: **Signals**, **Cards**, **Themes**, and **Situations**. **All** shows every node at full size; each focused view highlights one layer and fades the others, letting you focus on one level of abstraction at a time.

### AI prompts

The **✨ See the whole pool** button generates an AI prompt grounded in Dorst's Frame Creation methodology. If you've sorted your signals, it partitions them by your decisions (super/signal/noise) and asks what your sorting instincts reveal.

Each card/theme/situation node has a **✨ AI** button with three modes: through-line discovery, name & describe, and stress-test. The prompts are card-type-aware — a History card gets different framing than a Boundary card.

## Committing and deepening

When you have 2–3 themes you're willing to stand behind, click **Commit**. This opens the **Workspace**, where you:

- **Map who's affected** — stakeholders, gatekeepers, enablers
- **Pressure-test your framing** — hidden assumptions, structural biases, who benefits from the status quo

Each section has an AI prompt you take to your own AI tool — think with it, then come back and write in your own words. Once all sections are complete, you can submit.

## Exporting

From the Artifact screen you can:

- **Print / Save PDF** — browser print dialog
- **Download Markdown** — `.md` file with your full submission

## Technical notes

- Single HTML file — all CSS and JavaScript are inline
- No frameworks or build tools
- State persists to `localStorage` (key: `olos.sensemaking.v2`)
- Many-to-many lattice data model: `cards[]`, `themes[]`, `situations[]` with cross-referencing ID arrays
- Old tree-based state (pre-lattice) is auto-migrated on load
- Per-screen onboarding tours with spotlight engine
- Works offline after first load
- Tested on Chrome, Safari, Firefox — desktop and mobile
