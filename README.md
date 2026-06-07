# The Triangulator-inator

A problem space location instrument — sort friction signals, triangulate the through-lines, and build a defensible case for where to focus.

## What it does

You start with a pool of **friction signals**: real problems, reported by real people. Your job is to find the problem spaces hiding inside them — cluster the signals, name what connects them, then pressure-test your framing before submitting.

The tool walks you through three stages:

1. **Sort & triangulate** — drag signals onto a web map canvas and connect them to form clusters. Signals with strong thematic relationships cluster together; the canvas auto-arranges as you build.
2. **Map** — for each committed problem space, map who's affected and pressure-test your framing, with AI prompts as thinking partners.
3. **Artifact** — a structured summary of your committed problem spaces, with a peer review preparation checklist.

## Getting started

Open `index.html` in any modern browser. No build step, no server, no dependencies — everything is in one file.

Your session is saved automatically to `localStorage`, so you can close and reopen without losing work.

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

## Building clusters

1. Hover any signal card to reveal **teal dots** on its edges.
2. Drag from a dot to another signal — a **hub node** appears between them.
3. Continue dragging signals onto the hub to grow the cluster.
4. Hubs are color-coded by tier (teal → red → amber → purple) as they grow more complex.
5. Each hub has a **✨ AI** button that generates naming suggestions, pattern analyses, and stress-test prompts — copy them into your AI tool of choice.

The **✨ See the whole pool** button in the header generates a prompt to explore your entire signal pool — use it before you start clustering.

## Committing and deepening

When you have 2–3 clusters you're willing to stand behind, click **Commit to Clusters**. This locks those problem spaces and opens the **Workspace**, where you:

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
