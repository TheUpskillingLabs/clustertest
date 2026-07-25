# Pod Squad — this tool is yours to rebuild

*You're one of the frontline Poderators of the Washington, DC Founding Lab — the Labs' flagship. You've just been given write access to this repository. This doc tells you why, and what we're hoping you'll do with it. Read it once end-to-end. Then break something.*

---

## Three weeks from now

Picture July 25. Dozens of your neighbors — organizers, poll workers, librarians, people who filled out a field survey because something in their civic life feels stuck — are about to spend a day turning a pile of raw evidence into shared maps. Their first Evidence card. The moment the whole room unlocks Patterns & Themes together. The first time someone looks at their own ladder and says *"oh — that's what's actually going on."*

The tool they'll use for all of it is open in your browser right now.

**And it is not finished.** It's a starting place — a working, tested, honest first draft of a method turned into software. You're not being onboarded to *operate* it. You're being invited to *rebuild* it.

**Some of what's in this app will not survive contact with your room.** A hint that reads clearly to its builders will confuse a real person at a real table. A gate that enforces the method beautifully will land as a wall on a tired Tuesday evening. We know this the way you know it — because you've watched software meet the public before, and you've been the one standing next to the person it confused. That's exactly why it's you being handed the keys, and why now, while there's still time to change everything.

## What you're actually holding

Don't mistake "starting place" for "sketch." What's in this repo works (mostly), end to end, today:

- The full arc runs: gather source extracts → sort signal from noise → triangulate up a ladder of Evidence, Patterns, Themes → map a Problem Situation → find the paradox that keeps it stuck → discover who could own breaking it → export a ready-to-host site and slide deck that seeds a pod's repository for Meet the Pods.
- It's **one HTML file**. No build, no server, no dependencies. Open `index.html`, and you're holding the entire application — every word of copy, every gate, every screen. The file *is* the spec. That's not a limitation; it's the invitation. There is nothing in this tool you can't reach.
- It's tested by `session-test.js`, a headless driver that walks the whole flow — sort, connect, unlock, climb, map, classify, the five Deepen stages, three exports — and fails on any JS error. Run it before you push and you'll know quickly whether you broke something else.
- And you're not the first to mod it. Keep reading.

## The framework is already modded — so you have permission to test your own mods too

The app is built on Kees Dorst's **Frame Innovation**. You'll need enough of it to argue with it — not to obey it. Here's the crash course.

Dorst's method, in one breath: a *client* arrives with a problem they can't solve → you dig into its history (*archaeology*) → you find the *paradox* that makes it unsolvable as framed → you map who's directly implicated (*context*) and the wider network around them (*field*) → you surface the deeper *themes* → and from those themes you craft new *frames* — new ways of seeing that make new actions possible.

Now here's the thing that makes this repo different from a book club: **this app has already broken Dorst's rules on purpose.** That's your proof that the framework is moddable — and your license to keep modding:

| Dorst says | This app does | What you might mod |
|---|---|---|
| A client walks in with a problem | **Nobody walks in with anything.** Evidence is gathered first; the problem *emerges* from the field | Where's the emergence threshold? Is ~10 kept extracts the right moment to invite naming a concept? |
| The paradox is diagnosed from the client's stuckness | The paradox is **discovered in the evidence** and verified by *cui bono* — who benefits from it persisting | Is the sharpness self-check honest enough? Too preachy? Does it need teeth or a lighter touch? |
| The problem owner is the client — given, day one | The owner is an **output**: discovered in the Context ring, marked "(not yet approached)" until someone's actually talked to them | How should a pod track approach attempts? Is "not yet approached" the right social pressure? |
| Framing is the point | Framing is **deliberately deferred** — pods form around a paradox; frames come at the Frame Sprint | Is the boundary drawn in the right place? What framing "leakage" should the tool allow? |
| The expert designer drives | A bottom action bar drives: one next action, and when it's locked, the reason | Every word of that bar is yours to rewrite. You know how DC actually talks. |

The rule of the game — the only rule of taste we ask you to honor: **mods are argued from the method or from the field, never from preference alone.** "I'd prefer blue" is a preference. "Three people at kickoff couldn't find the connect dots, here's what they said" is the field. "Dorst defers framing because premature frames blind you, and this button invites framing too early" is the method. Both of those win arguments. Preference just starts them.

**Your reading path** (a week of commutes, not a semester):
1. The [README's method section](../README.md#the-method-in-brief) — ten minutes, the whole shape.
2. [The PRD](PRD-triangulator-finalization.md) — where the tool is headed and why; skim §2 Principles and §10 Design decisions.
2b. [The cleanup record](CLEANUP-2026-07.md) — what was cut before the sprint and how to get it back. Two of those cuts (a worked example, discoverable keyboard shortcuts) are open build agendas with the old code still in `git`.
3. Kees Dorst, *Frame Innovation: Create New Thinking by Design* (MIT Press, 2015) — chapters 1–5 are the engine. Read it like a co-author, pencil out.

> **🤖 Ask your AI:** *"Give me a working crash course on Kees Dorst's Frame Innovation method — the nine steps, the role of the paradox, and the difference between a theme and a frame. Then explain what would have to change if there were no client and no agreed problem at the start — just a pile of field evidence. Quiz me until I can explain it to a friend."*
>
> That second sentence? That's this app. You'll arrive at the same inversions we did — and probably some we didn't.

## Diverge, then converge — how we build together

Here's the vision, concretely. Not "feedback welcome." Not "we'll take it under advisement." This:

**By this Friday, there's a version of this tool with your name on it, live on the internet, doing something main doesn't do.** Your fork, your experiment, your hunch about what the room needs — clickable by anyone you send the link to. Next to it, four or five siblings: your squadmates' versions, each betting on something different. One of you rewrote the action bar in plain DC. One of you made sorting feel like a game. One of you tore a gate out entirely to see what happens without it. One of you added a stage we never thought of.

Then — week two — you play each other's builds. The way pods will play the tool. And the best ideas stop being opinions, because you've *used* them: "yours made me want to keep sorting; mine made me stop." That's **feature harvest**: the keepers get PR'd into main, one by one, argued from the method or the field. The best idea in the room wins on contact with reality — not in a meeting, not by seniority, not by whoever talks longest.

And on July 28, you watch a first-timer sail through the exact moment that used to snag — *because you rebuilt it.* That feeling is what "co-building the prototype tools and methods" means when it isn't a slogan. It's also, not incidentally, the same feeling the participants are supposed to have at Meet the Pods. You get it first. You'll facilitate it better because you've felt it.

**The three-week rhythm** (July 7 → 25):
- **Week 1 — diverge.** Fork or branch, prototype fast, ship your live URL. No permission needed. Wild is welcome.
- **Week 2 — harvest (converge).** Play each other's builds. Nominate keepers. Feature-harvest PRs into main.
- **Week 3 — freeze & rehearse.** Main is what the room runs. Drivers green. Walk the [sprint run-of-show](SENSEMAKING-SPRINT.md) with the real tool.

Two hard rules protect everyone's work — and they're the *only* two:
1. **The additive invariant:** never break a saved board. New persisted state must be optional-with-defaults. Someone's three weeks of mapping outranks your feature.
2. **No in-app AI, ever.** Every ✨ copies a prompt for the user's own model. This is governance, not a gap.

Everything else — copy, color, gates, stages, screens, the whole feel — is in play.

## Your first week

- [ ] **Today: feel the clay.** Run the loop once, end to end (15 minutes, sample data, disposable):
  1. Open [the live tool](https://theupskillinglabs.github.io/triangles/). It opens straight onto Sources.
  2. Sources → *Load 21 Civics & Elections source extracts* → **Start sorting →**. Sort all 21, fast — notice what hesitation feels like.
  3. On the canvas, drag a glowing edge dot onto another card → your first Evidence card. Name it. Do it twice more (or try the **Link** tool in the dock).
  4. **Unlock Patterns & Themes** when the bar offers it. Read the sheet — note it's one-way.
  5. Climb: Evidence → Pattern → Theme (name and describe as you go — feel the locks bite).
  6. **Map the Problem Situation** → take the classify beat → walk the five Deepen stages (linger on Stage 4's inner circle and Stage 5's paradox — that's the destination).
  7. **Produce the deck & site.** Unzip it. Open `slides.html`. That's what a pod carries into Meet the Pods.
  8. **Share / Export → Start over** — clean slate.
  Keep a note of every moment that made you squint. That list is your first build agenda.
- [ ] **This week: read enough to argue.** The reading path above. You don't need mastery — you need enough to say "Dorst would push back here, and here's why I'd push back on Dorst."
- [ ] **Then: make one mod.** Branch (`podsquad/<yourname>-<experiment>`) or fork — your call:
  - **Fork** (recommended for wild experiments): your fork gets its **own live GitHub Pages URL**. On your fork: Settings → Pages → "Deploy from a branch" → `main` / root → Save. Minutes later your version is live at `<you>.github.io/triangles/`.
  - **Branch** (fine for shared work): push `podsquad/<yourname>-<experiment>` to this repo.
  - Then open `index.html` — the whole app is in there — and change *one thing* from your squint list. A word of action-bar copy counts. A hint counts. A gate's threshold counts. A whole new workbook stage counts. Small is a superpower here: small ships Friday.
- [ ] **Share your URL** in the squad channel. Say what you were betting on. Try whatever anyone else posts.

> **🤖 Ask your AI (building edition):**
> - *"I have write access to a GitHub repo and I want to create a fork under my own account, enable GitHub Pages on it, and open its index.html live in my browser. Walk me through it on github.com, step by step."*
> - *"Here's a chunk of a large single-file HTML app [paste]. Help me change [the thing from my squint list] without touching anything else. Then tell me how to test that saved localStorage data still loads."*
> - *"Explain what a pull request is and walk me through opening one from my branch on github.com — I want to propose my change to the shared version."*

## Where this tool sits in the cycle

Your builds have a deadline with a room attached. The Summer 2026 cycle runs on six in-person anchor events at DC Public Library:

```
Kickoff Summit ──► SENSEMAKING SPRINT ──► Meet the Pods ──► Frame Sprint ──► Meet the Projects ──► Showcase Summit
   Jul 14           Jul 25 — your tool's     Aug 11          (Hackathon)         Sep 8               Oct 13
                    opening night                              Aug 15
```

The pipeline you're building for:

1. **The field survey** (on the Labs platform) collects raw observations — public, account-free, distributed by the cohort itself.
2. **Extraction** — participants run an app-provided prompt in *their own* AI to turn raw responses into **source extract** cards, and bring them in (CSV upload or the ✨ Extract flow).
3. **This tool** — sort → triangulate → map the Problem Situation → find the paradox(es) → discover candidate problem owners.
4. **The export** — each pod's deck & site zip seeds its GitHub repository: the de-facto **Meet the Pods** deliverable.
5. **Frame Sprint and beyond** — framing deliberately does *not* happen here. Pods form around a paradox; projects later form around **one problem owner + one problem frame + 3–5 members**.

Hold onto the one method idea under all of it: **we start with no client and no named problem.** The evidence speaks first. Every gate, nag, and invitation in the tool follows from that inversion — and every mod you make should know whether it's serving it or fighting it.

## Facilitation moves, by stage

You'll still be the one standing next to a stuck participant on July 25 — and by then, you'll be facilitating a tool you helped build. The bar at the bottom of their screen always shows the next move. It no longer explains *why* — that part is yours now, said out loud. When someone stalls, look at their bar *with* them. You carry the why behind the why.

| They're… | What's happening | Your move |
|---|---|---|
| Staring at the Sources screen | Blank-page freeze | "Load the sample to feel the mechanics — your real extracts come later. Go wide; include what might contradict you." |
| Agonizing over every sort | Treating sort as final | "It's a loop — nothing is unrecoverable. Where you hesitate *is* the data. Sort fast, trust the re-visit." |
| Asking "what's the problem we're solving?" | Wants the concept first | The inversion, said plainly: "We don't know yet — that's the point. The evidence speaks before anyone names the problem. The tool will invite you to name it once you've kept enough." |
| Can't find how to connect cards | Missed the affordance | Point at the glowing dots (visible for their first 3 connections), or the **Link** tool: click one card, then the other. |
| Hit a locked card, annoyed | The gates working as designed | "Every lock is one of Dorst's five syndromes headed off. This one stops you claiming what you haven't examined. Name the cards under it first." |
| Asking whether to Unlock | One-way anxiety | "Your hunches and evidence come with you unchanged. For the sprint, we do it together as a room." |
| Wrote a "paradox" that's a complaint | Sharpness problem | Run the self-check with them: does the fix undo itself ("X requires not-X")? Who *benefits* from it persisting? A paradox nobody profits from is usually a misreading. |
| Marked a candidate owner confidently | Overclaiming | "It says '(not yet approached)' until someone actually talks to them. An owner is a hypothesis until then — who's making the call?" |
| Wants the AI to do the thinking | ✨ misunderstanding | "The tool has no AI. That button copies a prompt for *your* model — run it, argue with it, write your own words back. The Blind-spot audit is the tab for when everything feels too tidy." |
| Lost in the Deepen workbook | Five stages, long scroll | The stage bar at the top of the workbook — it shows which stage they're in, ticks the answered ones, and jumps. The bar at the bottom names whatever is still blocking the export. |
| Board looks like a hairball | Cards seeded on a spiral, overlapping | **⊞ Auto-layout** in the canvas toolbar. It rebuilds the ladder in tiers and it's undoable — good to reach for right before someone presents their map. |
| Stuck on one card, staring at it | Doesn't know the help is there | Point at the ✨ **AI** button on the card itself. Three prompts for that card, built from what's underneath it. It walks them through copy → paste → bring it back. |
| "I lost my work??" | localStorage panic | Per-browser, per-device — see Gotchas. Same browser + device = it's there. Different device = it never was; export/import moves work. |

And now the builder's corollary: every row you add to this table from the field is either a facilitation note *or a bug in the design*. When it's the design — change the design.

## The Git loop, without fear

Each pod gets a shared GitHub repository. The collaboration story is deliberately low-tech: **export a zip → put it in the repo → Git merges everyone's maps.** Where two people mapped the same thing differently, Git raises a conflict — which is the tool scheduling a conversation. Feature, not error. (Notice it's the same shape as your diverge/converge: pods do with maps what you're doing with the tool itself.)

**The web-only path (no terminal, works for everyone):**
1. In the tool: **Share / Export…** → *Export working folder (.zip)*. Unzip it.
2. On the pod's repo page: **Add file → Upload files**. Drag the folder's contents in.
3. One line about what you mapped, commit.
4. To take in a podmate's work: download their folder (Code → Download ZIP), then **Share / Export… → Open a shared folder** → *Merge*.

**The terminal path** exists for those who want it — nobody is required to use it.

> **🤖 Ask your AI:**
> - *"I have a zip exported from a tool and a GitHub repository at `<repo URL>`. Walk me through adding the zip's contents using ONLY the github.com website. I'm on `<Mac/Windows>`."*
> - *"My teammate and I both edited files in the same repo and there's a merge conflict on `state.json`. Plain language: what happened, and the simplest safe way to resolve it — we're happy to talk it out and keep one version."*
> - *"Explain `git clone`, `add`, `commit`, `push` to me like I organize community events, not software."*

## Vocabulary translation table

Three vocabularies touch this work. Same things, different words — here's the decoder ring:

| This tool says | The Labs platform says | Dorst / theory says |
|---|---|---|
| Source Extract (tier 0) | extract / Extracted Signal | — (raw archaeology material) |
| Evidence → Pattern → Theme | the same ladder, tiers 1–3 | Archaeology climbing toward Themes |
| Seed Mode → Unlock (Pod Mode) | *(no equivalent — tool-only concept)* | scaffold-up-from-dead-simple |
| Map the Problem Situation | `problem_situation` (the frame artifact) | the open, complex, networked condition |
| The seven evidence types | same (history, counterfactual, problem, boundary, flux, player, value) | Dorst's evidence lenses |
| The five syndromes (the locks) | *(not named in platform docs)* | Dorst: Lone Warrior, Freeze the World, Self-Made Box, Rational High Ground, Identification |
| The paradox (field-intrinsic, cui-bono-verified) | the paradox as obligatory passage point | Dorst step 2 — inverted: discovered from evidence, not diagnosed from a client |
| Candidate problem owner ("not yet approached") | `problem_owner` actant — "identified, not necessarily converted" | the client Dorst was handed; we have to find ours |
| Evidence as warrant ("How we know") | seconding / corroboration weight | the ground a claim stands on |
| Produce the deck & site | *(the de-facto Meet the Pods deliverable — see the sprint brief, Q5)* | — |

House style everywhere: the brand is **The Upskilling Labs** ("The Labs" — never an acronym), and the role is **Poderator** in anything a human reads.

## Feed the build

Prototyping is one channel; observation is the other, and it's just as much building. The loop is **GitHub Issues** on this repo — traceable, phone-friendly, no Git required:

- 🐛 **Bug** — the tool did something wrong. What happened, what you expected, screenshot, device + browser.
- 🧠 **Method friction** — the tool worked but a *person* got stuck. Which screen, what they said out loud, what unblocked them. The most valuable reports we get — and now, often the seed of your next branch.
- ✨ **Sprint idea** — a proposal for the Sensemaking Sprint co-design ([the brief](SENSEMAKING-SPRINT.md) has eight open questions with your name on them — starting with what the event is even called).

A good field report: *what they were trying to do → what actually happened → what you said or did to unblock them.* Verbatim quotes are gold.

## Gotchas (read twice — then teach them)

1. **Boards live in the browser, per device.** Nothing syncs by itself. Library laptop ≠ home laptop. The bridge is always export → repo → import. Say it out loud at the start of every session.
2. **Unlock is one-way.** Seed Mode can't be re-entered on that board (the work survives untouched; only the simpler view is gone).
3. **Private/incognito windows** can wipe localStorage on close. Facilitate — and prototype — in normal windows.
4. **The deck export has gates:** Pod Mode + a completed workbook + a real project title. The bar's hint names exactly what's missing — read it to them.
5. **Offline is fine.** After first load, no network needed. Venue wifi is a non-event.
6. **"Self-destruct" means it.** The reset on the Sources screen clears the saved board. Export first if in doubt.
7. **Nothing uploads anywhere, ever.** Their data is in their browser and in whatever zips *they choose* to commit. That's the entire privacy story — tell it proudly.

---

Three weeks. A working starting place. Write access. A method that's already proven it can be modded, a squad that's already proven it can rebuild what the field says is broken — and a room full of your neighbors arriving July 28 to use whatever you make of it.

**Fork it. Change something. Ship the link.**

*Questions this doc didn't answer are gaps in this doc — file a 🧠 issue and we'll fix the doc, not just the answer.*
