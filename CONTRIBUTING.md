# Contributing

Welcome. This guide gets you from a fresh clone to a merged change. Read it once end-to-end; it's short.

## Run it

Open `index.html` in a browser. That's the whole setup — no build, no server, no dependencies, no install. It must keep working when opened from `file://`; anything that breaks that is a regression.

## The two hard rules

1. **One file.** The entire app lives in `index.html` (vanilla HTML/CSS/JS). No frameworks, no bundlers, no external runtime dependencies. If you're tempted to split it, open an issue first — the single file *is* the deployment story.
2. **The additive invariant: never break a saved board.** State persists in `localStorage` under `olos.sensemaking.v2`. New persisted fields must be optional and read with defaults; existing boards must load unchanged after your change. If a feature would require migrating what an old board wrote, it's designed wrong.

Also: **no in-app AI, ever.** Every ✨ feature copies a prompt for the user's own model. This is governance, not a TODO.

## Not sure? File an issue first

The issue templates (🐛 bug · 🧠 method friction · ✨ sprint idea) are the front door — especially for Pod Squad members. A great report beats a speculative PR. If you've never contributed to a repo before, paste this into your own AI and follow along: *"Walk me through filing a GitHub issue and later opening a pull request on a repo I have write access to, using only the github.com website."*

## Branches & PRs

- Branch from `main`. Pod Squad work: `podsquad/<short-slug>`. (You'll also see `claude/<slug>` branches — those are agent-built.)
- Open a PR against `main`; describe what changed and *how you verified it*. PRs are merged with merge commits (not squash).
- Docs-only changes (README, `docs/`) are the easiest first PR and are always welcome.

## Verifying changes

The project is tested by driving the real app headlessly with Playwright against `file://`, with a zero-JS-error gate. If you change app behavior:

1. Install the driver deps locally (they're git-ignored): `npm init -y && npm i playwright` and point `PLAYWRIGHT_BROWSERS_PATH` at a Chromium, or just use your installed Chrome via `channel: 'chrome'`.
2. Minimum bar: load the app fresh (cleared localStorage), click through Sources → Sort → connect → Unlock → Map → Deepen → export, and confirm the console shows **zero errors**.
3. State-compatibility bar: load a board saved *before* your change and confirm it renders and the action bar shows a sane state.
4. Say in the PR what you drove and what you saw.

## Docs map

| File | What it is |
|---|---|
| `README.md` | The front door — what the tool is and how to use it |
| `docs/PODSQUAD-ONBOARDING.md` | Poderator onboarding + facilitation guide |
| `docs/SENSEMAKING-SPRINT.md` | The co-design brief for the first in-person event (living doc) |
| `docs/PRD-triangulator-finalization.md` | Product spec: cycle integration, seams, build order |

House style for all docs: the brand is **The Upskilling Labs** ("The Labs" — never an acronym); the role is **Poderator** in anything reader-facing.
