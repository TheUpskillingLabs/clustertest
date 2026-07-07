# Pod Squad Onboarding — the Triangulator, and your part in it

*For the Pod Squad: the frontline Poderators of the Washington, DC Founding Lab (the Labs' flagship), co-building the tools and methods for the Civics & Elections cycle. Read this once end-to-end — it's the only doc you need before your first session with the tool.*

---

## Who you are (and where "Pod Squad" comes from)

On June 22, 2026, the moderators of the flagship lab wrote a memo — a lived-needs wish-list that reshaped how the platform treats Poderators. The features it demanded got built as "the Pod Squad batch," and its core question ("is this a moderator CRM or a participant experience system?") got answered in the participants' favor. **You are the continuation of that memo.** The same frontline perspective that fixed the dashboard is now co-designing the sensemaking method itself. This repo is where that happens.

You've been added to the `triangles` GitHub repository as a team. This doc gets you from *invited* to *useful*.

## Your posture (unchanged from the dashboard)

The Poderator constitution applies here word for word:

> *You're the shepherd here… unblock what you can, grade nothing — and when the process itself trips someone, that's a signal about the process, never a mark against the member.*

Two additions specific to this tool:

- **The tool is your co-facilitator.** The bar at the bottom of the screen always shows a participant's one next move, and the corner coach explains why it matters. You don't need to memorize a script — when someone is stuck, look at their action bar together. Your job is the *why* behind the why; the tool handles the *what to click*.
- **When the process trips someone, that's now a signal you can act on.** File it (see "Feed the build" below). You are not just running the method — you're debugging it.

## Where this tool sits in the cycle

The Summer 2026 cycle runs on six in-person anchor events at DC Public Library:

```
Kickoff Summit ──► SENSEMAKING SPRINT ──► Meet the Pods ──► Frame Sprint ──► Meet the Projects ──► Showcase Summit
   Jul 14           Jul 28 (this tool's      Aug 18           (Hackathon)         Sep 15               Oct 13
                    big day — see the                          Sep 8
                    sprint brief)
```

The pipeline the Triangulator serves:

1. **The field survey** (OLOS) collects raw observations from the field — public, account-free, distributed by the cohort itself.
2. **Extraction** — participants run an app-provided prompt in *their own* AI to turn raw responses into discrete **source extract** cards, and bring them into the Triangulator (CSV upload or the ✨ Extract flow).
3. **This tool** — sort → triangulate → map the Problem Situation → find the paradox(es) → discover candidate problem owners.
4. **The export** — each pod's "Produce the deck & site" zip seeds its GitHub repository: a ready-to-host site plus the **Meet the Pods** slide deck.
5. **Frame Sprint and beyond** — framing deliberately does *not* happen in this tool. Pods form around a paradox; frames come later, and projects form around **one problem owner + one problem frame + 3–5 members**.

The one method idea to hold onto: **we start with no client and no named problem.** Classic Dorst begins with a client who brings a problem; our participants begin with evidence and *discover* the problem, the paradox, and the owner. Every design choice in the tool follows from that inversion — it's why nobody is asked to "state the problem" up front, and why the tool nags about evidence, beneficiaries, and "not yet approached" owners.

## Set up in 15 minutes

Do this once, alone, before you facilitate anyone. You cannot break anything — the sample data is disposable and "Start over (reset)" on the Sources screen wipes the slate.

- [ ] **Accept the GitHub team invite** (check the email tied to your GitHub account, or github.com/notifications).
- [ ] **Open the tool:** [theupskillinglabs.github.io/triangles](https://theupskillinglabs.github.io/triangles/). Skim the 5-slide intro once (you'll be asked about it).
- [ ] **Load the sample:** Sources screen → *Load 21 Civics & Elections source extracts*. Press **Start sorting →**.
- [ ] **Sort all 21.** Right = signal, left = noise, up = super signal. Go fast on purpose — notice what hesitation feels like; you'll be narrating that feeling to participants.
- [ ] **Connect two extracts.** On the canvas, the edge dots on cards are glowing (they do that for your first three connections). Drag a dot onto another card → an Evidence card appears. Name it and describe it. Do this twice more.
- [ ] **Unlock Patterns & Themes** (the bar's big button). Read the sheet before you confirm — note that it's one-way.
- [ ] **Climb:** connect two named Evidence cards → a Pattern. Name it. Connect Patterns → a Theme. Name and describe it. Notice the *locks*: the tool refuses to let you name a higher card on unexamined lower ones. Those locks are the method.
- [ ] **Map the Problem Situation** (the bar offers it the moment your ladder qualifies). Then take the classify beat when offered — the seven evidence types, one at a time.
- [ ] **Deepen** — walk the five workbook stages. Give Stage 4 (Context & field) and Stage 5 (the paradox) real attention; they're the destination.
- [ ] **Produce the deck & site.** Unzip it. Open `index.html` and `slides.html` from the zip — this is what a pod brings to Meet the Pods.
- [ ] **Reset** (Sources screen → Start over) so your real board starts clean.

If any step surprised you or stalled you — congratulations, you found your first issue to file.

## Facilitation moves, by stage

| Participant is… | What's happening | Your move |
|---|---|---|
| Staring at the Sources screen | Blank-page freeze | "Load the sample to feel the mechanics — your real extracts come later. Go wide; include things that contradict you." |
| Agonizing over every sort | Treating sort as final | "It's a loop — nothing is unrecoverable. Where you hesitate *is* the data. Sort fast, trust the re-visit." |
| Asking "what's the problem we're solving?" | Wants the concept first | This is the inversion, said plainly: "We don't know yet — that's the point. The evidence gets to speak before anyone names the problem. The tool will invite you to name it once you've kept enough extracts." |
| Can't find how to connect cards | Missed the affordance | Point at the glowing dots (visible for their first 3 connections), or the **Link** tool in the dock: click one card, then the other. |
| Hit a locked card and is annoyed | The gates working as designed | "Every lock is one of Dorst's five syndromes headed off. This one's stopping you from naming a claim you haven't examined. Name and describe the cards under it first." |
| Asking whether to Unlock (graduate) | One-way anxiety | "Your hunches and evidence come with you unchanged. Unlock when you're ready to build Patterns and Themes — for the sprint, we do it together as a room." |
| Wrote a "paradox" that's really a complaint | Sharpness problem | Use the sharpness self-check with them: does the fix undo itself ("X requires not-X")? Who *benefits* from it persisting? A paradox nobody profits from is usually a misreading. |
| Marked a candidate owner confidently | Overclaiming | "The tool will say '(not yet approached)' until someone actually talks to them. An owner is a hypothesis until then — who's making the call?" |
| Wants the AI to do the thinking | ✨-button misunderstanding | "The tool has no AI. That button copies a prompt for *your* model — run it, argue with the output, and write your own words back. The Blind-spot audit tab is the one to run when everything feels too tidy." |
| Lost their work?? | localStorage panic | It's per-browser, per-device — see Gotchas. Same browser + same device = it's there. Different device = it never was; export/import is how work moves. |

## The Git loop, without fear

Each pod has a shared GitHub repository. The collaboration story is deliberately low-tech: **export a zip → put it in the repo → Git merges everyone's maps.** Where two people mapped the same thing differently, Git raises a conflict — which is the tool's way of scheduling a conversation. That's a feature, not an error.

**The web-only path (no terminal, works for everyone):**
1. In the tool: **Share / Export…** → *Export working folder (.zip)*. Unzip it on your machine.
2. On your pod's repo page on github.com: **Add file → Upload files**. Drag the unzipped folder's contents in.
3. Write one line about what you mapped ("added my extracts + first evidence on ballot access") and commit.
4. To take in a podmate's work: download their folder from the repo (Code → Download ZIP works), then in the tool **Share / Export… → Open a shared folder** and choose *Merge*.

**The terminal path** exists for those who want it (clone, copy folder in, `git add . && git commit && git push`) — but nobody is required to use it.

> **🤖 Ask your AI.** You have a state-of-the-art tutor in your pocket for every Git question. Paste prompts like these into Claude/ChatGPT/Gemini and follow along:
> - *"I have a zip file exported from a tool and a GitHub repository at `<repo URL>`. Walk me through adding the zip's contents to the repo using ONLY the github.com website — no command line. I'm on `<Mac/Windows>`."*
> - *"My teammate and I both edited files in the same GitHub repo and there's a merge conflict on `state.json`. Explain in plain language what happened and give me the simplest safe way to resolve it — we're fine talking it out and keeping one version."*
> - *"Explain `git clone`, `git add`, `git commit`, `git push` to me like I organize community events, not software."*

## Vocabulary translation table

Three vocabularies touch this work. They mean the same things — this table is the decoder ring.

| This tool says | The OLOS platform says | Dorst / theory says |
|---|---|---|
| Source Extract (tier 0) | extract / Extracted Signal | — (raw archaeology material) |
| Evidence → Pattern → Theme | the same ladder, tiers 1–3 | Archaeology climbing toward Themes |
| Seed Mode → Unlock (Pod Mode) | *(no equivalent — tool-only concept)* | scaffold-up-from-dead-simple |
| Map the Problem Situation | `problem_situation` (the frame artifact) | the open, complex, networked condition |
| The seven evidence types | same (history, counterfactual, problem, boundary, flux, player, value) | Dorst's evidence lenses |
| The five syndromes (the locks) | *(not named in OLOS docs)* | Dorst: Lone Warrior, Freeze the World, Self-Made Box, Rational High Ground, Identification |
| The paradox (field-intrinsic, cui-bono-verified) | the paradox as obligatory passage point; "complications are the raw material of the paradox" | Dorst step 2 — inverted: discovered from evidence, not from a client |
| Candidate problem owner ("not yet approached") | `problem_owner` actant — required by proposal time, "identified, not necessarily converted" | the client Dorst was handed; we have to find ours |
| Evidence as warrant ("How we know") | seconding / corroboration weight | the ground a claim stands on |
| Produce the deck & site | *(the de-facto Meet the Pods deliverable — see sprint brief Q5)* | — |

House style, everywhere: the brand is **The Upskilling Labs** ("The Labs" for short — never an acronym), and the role is **Poderator** in anything a human reads.

## Feed the build

You're co-builders, not testers. The loop is **GitHub Issues** on this repo — traceable, works from a phone, no Git required. Three templates:

- 🐛 **Bug** — the tool did something wrong. What happened, what you expected, screenshot, device + browser.
- 🧠 **Method friction** — the tool worked but a *person* got stuck. Which screen/state, what they said out loud, what you did. These are the most valuable reports we get.
- ✨ **Sprint idea** — a proposal for the Sensemaking Sprint co-design (reference the open question Q1–Q8 from the [sprint brief](SENSEMAKING-SPRINT.md) it addresses).

A good field report has three parts: *what the participant was trying to do → what actually happened → what you had to say or do to unblock them.* Verbatim quotes are gold.

Bigger changes: open a PR from a `podsquad/<short-name>` branch — see [CONTRIBUTING.md](../CONTRIBUTING.md). If you've never opened a PR, that's another great 🤖 Ask-your-AI moment.

## Gotchas (read twice)

1. **Boards live in the browser, per device.** Nothing syncs by itself. A participant who starts on a library laptop and goes home to their own machine has *two different empty-and-full boards*. The bridge is always export → repo → import. Say this out loud at the start of any session.
2. **Unlock is one-way.** Seed Mode cannot be re-entered on that board. (Their work survives the unlock untouched — the only thing lost is the simpler view.)
3. **Private/incognito windows** can wipe localStorage on close. Facilitate in normal windows.
4. **The deck export has gates:** Pod Mode + a completed workbook (name, description, openness, paradox, pressure-test + one named Theme) + a real project title. The bar's hint names exactly what's missing — read it to them.
5. **Offline is fine.** After first load the tool needs no network. Spotty venue wifi is a non-event.
6. **"Self-destruct" means it.** The reset on the Sources screen clears the saved board with one confirm. Keep it away from live boards; export first if in doubt.
7. **Nothing uploads anywhere, ever.** When someone asks about privacy: their data is in their browser and in whatever zips *they choose* to commit. That's the whole story.

---

*Questions this doc didn't answer are gaps in this doc — file a 🧠 issue and we'll fix the doc, not just the answer.*
