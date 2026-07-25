# Anti-matchmaking prompt — minimally aligned triads

Facilitator tool for the live sprint (see
[SESSION-RUNBOOK-2026-07-25.md](SESSION-RUNBOOK-2026-07-25.md)). Per the
BYO-LLM rule there is no in-app AI: **you** run this in your own model,
against the digest produced by `scripts/digest-boards.mjs`.

Usage: paste the prompt below, then paste the full contents of `digest.md`
underneath it. Read the output *before* announcing groups — you are the
editor, not the model.

---

## The prompt

```
You are forming peer-consultation groups for a sensemaking workshop. Below
is a digest of each participant's evidence map: their working concept,
problem situations, themes, hunches, and starred evidence. The board title
is the participant's name.

Form groups of 3 (triads) that are MINIMALLY aligned — this is
anti-matchmaking. People who are mapping the same problem, the same domain,
or the same framing must NOT be grouped together. The goal is that each
person consults on maps as different from their own as possible: an outside
reader forces assumptions into the open, and nobody's thinking collapses
into groupthink before the vote.

Judge alignment ONLY from map content, on these axes:
1. Problem domain (what part of the world the map is about)
2. Framing and themes (how they conceptualize what is going on)
3. Evidence base (which kinds of sources and observations they lean on)
4. Actors and standpoints (whose voices and which players appear)

Rules:
- Every participant appears in exactly one group.
- If the count is not divisible by 3, make one or two groups of 4 — never
  a group of 2, never anyone left over.
- Maximize the MINIMUM pairwise difference within each group: no pair in a
  triad should share a primary domain or a central theme if any other
  arrangement avoids it.
- If a board is too thin to judge (few extracts, no situations or themes),
  say so and place the person where they add the most difference anyway;
  flag them for the facilitator.
- Use nothing but the digest — no assumptions about people from their
  names, and no demographic guesses of any kind.

Output:
1. A numbered list of groups. For each: the member names, then one
   sentence — "Productively misaligned because…" — naming the axis on
   which each member differs most from the other two.
2. A short "watch list": thin boards you had to place on little evidence,
   and any pair you could not fully de-align (with the shared ground named,
   so the facilitator can decide whether to swap).
3. A one-line sanity check: total participants, total placed, group sizes.
```

---

## After the model answers

- Scan the watch list first; swap by hand where you know the room better
  than the digest does.
- Two boards can look different in the digest and still be the same project
  (e.g., one mapped the clients, one mapped the caseworkers). If you know
  of pairs like that, tell the model and rerun, or just swap manually.
- Announce groups by name from a slide or the room mic — group membership
  lives nowhere in the tool and doesn't need to.
