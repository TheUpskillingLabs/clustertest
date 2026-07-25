# Session runbook — Sensemaking Sprint, July 25 2026

The operational run-of-show for the live sprint (DC Public Library, ~40
participants). Companion docs: [SENSEMAKING-SPRINT.md](SENSEMAKING-SPRINT.md)
(the co-design brief), [ANTI-MATCHMAKING-PROMPT.md](ANTI-MATCHMAKING-PROMPT.md)
(the grouping prompt), [PODSQUAD-ONBOARDING.md](PODSQUAD-ONBOARDING.md)
(tool gotchas).

The day's arc:

1. **Map** — everyone works their own board in the Triangulator.
2. **Anti-matchmaking** — initial maps are digested and AI-grouped
   (facilitator-run, BYO-LLM) into *minimally aligned* triads.
3. **Peer consult** — triad members merge each other's boards for context,
   but everyone keeps working their own map and problem situation.
4. **Publish** — each triad makes one GitHub repo; each member commits
   their exported working folder to it.
5. **Submit** — each person submits their own problem statement in OLOS,
   linking the repo ("Link to your map", step 3 of the propose wizard).
6. **Review + vote** — everyone browses the OLOS gallery
   (`/cycles/{id}/proposals`), then stack-votes on the ballot; finalize
   publishes the pod shortlist.

---

## Participant steps

### A. Before the grouping call

1. **Title your board with your name** (Share / Export → board title). The
   title is how your digest is labeled and how your cards are badged when a
   teammate merges your board. An untitled board is anonymous in the worst
   way.
2. Export your board: Share / Export → **working folder (.zip)**. This
   export requires a **named + described problem situation**; if you're not
   there yet, use the **canvas zip** export instead — it has no gate.
3. Drop the zip in the collection channel the facilitator names in the room
   (Slack / Drive — decided on the day).

### B. After triads are announced

4. One member creates a **GitHub repo for the triad**; all three get write
   access. Web-only path (no terminal needed) is in
   [PODSQUAD-ONBOARDING.md](PODSQUAD-ONBOARDING.md).
5. Each member **unzips their working folder and commits it** to the repo
   as a top-level folder (the export's README explains the layout).
6. Each member imports **each teammate's folder once**: Share / Export →
   Open a shared folder → **Merge into my board**. Two merges each, and
   *exactly* one per teammate — re-merging the same folder duplicates every
   card (there is no dedup). Merged content lands to the right of yours,
   badged with the teammate's board title.
7. Peer-consult, then keep building **your own** map and problem situation.
   The workbook (Deepen stages) is where the thinking happens; OLOS will
   only ask you for the distilled statement.
8. Re-export your working folder and commit it to the triad repo when it
   changes — the repo is what voters will open.

### C. Submitting in OLOS

9. `/cycles/{id}/propose` → the 6-step wizard. Step 3 has **"Link to your
   map"** — paste the triad repo URL (or a link straight to your folder in
   it). Everyone submits their own statement; the triad is a consultation
   structure, not a submission unit.
10. Your submission (with its map link) appears on the cycle page and in
    the gallery immediately; voting opens when the facilitator says so.

---

## Facilitator steps (anti-matchmaking)

1. Collect everyone's zips into one local folder (e.g. `~/sprint-boards/`).
2. `node scripts/digest-boards.mjs ~/sprint-boards/` → writes
   `digest.md` and prints how many boards it read; chase stragglers listed
   as skipped.
3. Paste the prompt from
   [ANTI-MATCHMAKING-PROMPT.md](ANTI-MATCHMAKING-PROMPT.md) + the whole
   `digest.md` into your own LLM.
4. Review the output (watch list first), swap where you know better, and
   announce groups from a slide. Nothing about groups is entered into any
   tool.

Timing: collection is the bottleneck, not the model. Give the room a hard
"zips in by HH:MM" and run the digest while they take a break.

---

## OLOS admin pre-flight (before doors open)

- **Windows** (admin → cycle config): `problem_statement` open from session
  start until after the submission block; `voting` open for the live vote
  slot. The `advance-phase` testing control (requires `testing:use`) is the
  fallback if config edits misbehave live.
- **Budgets**: everyone submits their own statement, so everyone gets
  `submitter_votes` (default 3). Set `non_submitter_votes` equal as the
  safety net for anyone who misses the submission cutoff.
- **Threshold / cap sanity**: with ~N participants there will be ~N
  statements and ~3·N total votes. Check `vote_threshold` (default 5) and
  `max_pods` (default 8) give the shortlist size you actually want.
- **Lab check**: ballot and gallery are partitioned by `metro_id`. Confirm
  the whole cohort shares a lab (or is all in the NULL/HQ bucket), or the
  room will be looking at different ballots.
- **Deploy check**: the map-link field and the proposals gallery ship on
  branch `claude/triangulator-workflow-gaps-yv0dzb` (OLOS). Confirm it's
  merged and deployed before the doors open, or step C.9's URL field won't
  be there.
- **Rehearse finalize**: the shortlist is published by the admin Finalize
  button in the minutes between voting close and forming open. Know who
  clicks it, from which account, and what they should see.

---

## Known gotchas (say them out loud in the room)

- Boards are **per-browser, per-device**. Same laptop, same browser, all
  day.
- **Unlock is one-way** (seed → pod). Fine — but nobody should press it
  "to see what happens" mid-merge.
- Merges are **overlays, not reconciliation**: same evidence mapped by two
  people shows up twice, on purpose. The conversation about which framing
  survives *is* the peer consult.
- The **Meet-the-Pods site/deck export** is publish-only (no `state.json`)
  — it cannot be re-imported. Working folder or canvas zip are the only
  round-trippable exports.
