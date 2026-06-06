# The Triangulatorizer

A facilitated sensemaking tool for synthesizing a pool of friction signals into defensible problem spaces — with an interactive canvas, AI thinking partners, and a structured deepening workspace.

## What it does

You start with a set of **friction signals**: real problems people experience. Your goal is to cluster them into **2–3 defensible problem spaces** by finding the through-lines, so you can dig deeper with stakeholder maps and problematizations before deciding where to focus.

The tool walks you through three stages:

1. **Web Map** — drag signals onto a canvas and connect them to form hub clusters. Signals with strong thematic relationships cluster together; the canvas auto-arranges as you build.
2. **Workspace** — for each committed cluster, write a stakeholder map and problematization, optionally with AI prompts as thinking partners.
3. **Artifact** — a structured summary of your committed clusters, ready to share or submit for voting.

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
| Connect signals | Hover card → drag from a teal dot to another card | Tap card → drag from a bright teal dot |
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

The **✨ AI Prompt** button in the header analyzes your entire signal pool to surface patterns before you start clustering.

## Committing and deepening

When you have 2–3 clusters you're confident in, click **Commit to Clusters**. This locks those clusters and opens the **Workspace**, where you write:

- **Stakeholder map** — who is affected and how
- **Problematization** — the defensible framing of the problem space

Each section has an AI prompt to help you think out loud before writing your own answer. Once all clusters are filled in, you can **Submit for Voting**.

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
