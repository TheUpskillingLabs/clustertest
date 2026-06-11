# The Triangulator-inator

A thinking instrument for Kees Dorst's Frame Creation model — sort friction signals, triangulate patterns and themes, and build a defensible case for where to focus.

## What it does

You start with a pool of **friction signals**: raw evidence from the world — articles, datasets, observations, interview fragments, policies, statistics. Your job is to triangulate the patterns hiding inside them — sort the noise, name what connects the signals, then go deeper to find the themes that bridge human experience and structural forces.

The tool walks you through four stages:

1. **Sort the signals** — swipe through each signal card to classify it as **noise** (swipe left), **signal** (swipe right), or **★ super signal** (swipe up). The binary forces intellectual commitment. Super signals mark the evidence you consider most urgent or revelatory. Your sorting decisions become analytical data — the AI uses what you kept vs. discarded to challenge your instincts.

2. **Triangulate on the canvas** — drag surviving signals onto a web map and connect them to reveal patterns. Connect two signals to create a **Pattern** (a named condition no single signal shows on its own). Connect two patterns to create a **Theme** (a deeper universal). Connect two themes to create a **Super-theme** (a convergence that points toward a frame). Each level goes deeper.

3. **Map & pressure-test** — for each committed pattern, map who's affected and pressure-test your framing, with AI prompts grounded in Dorst's methodology as thinking partners.

4. **Artifact** — a structured summary of your committed patterns, themes, and super-themes, with a peer review preparation checklist.

## The hierarchy

| Object | What it is | Created by |
|---|---|---|
| **Signal** | Raw evidence — a pattern of action or behavior, not an opinion | Imported from CSV, sample data, or manual entry |
| **Pattern** | A specific, named condition that 2+ signals point toward together | Connecting two signals on the canvas |
| **Theme** | A deeper universal that 2+ patterns triangulate toward — bridges human experience and structural/systemic factors | Connecting two patterns |
| **Super-theme** | The deepest convergence — where human and structural forces meet, pointing toward a candidate frame | Connecting two themes |

## Getting started

Open `index.html` in any modern browser. No build step, no server, no dependencies — everything is in one file.

1. Load signals — use the 44 sample signals, upload a CSV, or add manually
2. Click **Start Sorting** to enter the swipe-based sorting phase
3. After sorting, the canvas opens with your surviving signals ready to triangulate

Your session is saved automatically to `localStorage`, so you can close and reopen without losing work.

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
| Move a signal | Drag the card | Drag with one finger |
| Pan the canvas | Drag background · Space + drag · Middle-mouse | Drag background with one finger |
| Zoom | Scroll · Ctrl/Cmd + scroll · `+` / `−` keys | Pinch with two fingers |
| Zoom out far | Scroll down (5%–250% range) | Pinch out |
| Connect signals | Hover card → drag from an edge dot to another card | Tap card → drag from an edge dot |
| Fit all nodes | `0` key · click the `%` button | Tap `%` in zoom toolbar |
| Delete a connection | Click the edge → press Delete | Tap the edge → Delete button |
| Tidy layout | `Shift + T` | — |
| Hide header chrome | `↕` button in zoom toolbar | Same |

## Building patterns, themes, and super-themes

1. Hover any signal card to reveal **teal dots** on its edges.
2. Drag from a dot to another signal — a **Pattern** node appears between them.
3. Continue dragging signals onto the pattern to grow it.
4. Connect two patterns to create a **Theme**. Themes show quality-check prompts:
   - *Bridge test:* Does this theme describe both a structural condition AND a human experience?
   - *Depth test:* Is this hidden beneath the surface of everyday professional life?
5. Connect two themes to create a **Super-theme** with a frame prompt: "If this situation is approached as if it is ___, then ___"
6. Nodes are color-coded by tier: teal (signal) → red (pattern) → amber (theme) → purple (super-theme).

The **✨ See the whole pool** button generates an AI prompt grounded in Dorst's Frame Creation methodology. If you've sorted your signals, it partitions them by your decisions (super/signal/noise) and asks what your sorting instincts reveal.

Each pattern/theme/super-theme node has a **✨ AI** button with three modes: through-line discovery, name & describe, and stress-test.

## Committing and deepening

When you have 2–3 patterns you're willing to stand behind, click **Commit to Patterns**. This opens the **Workspace**, where you:

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
- Works offline after first load
- Tested on Chrome, Safari, Firefox — desktop and mobile
