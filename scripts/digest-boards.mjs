#!/usr/bin/env node
// digest-boards.mjs — facilitator tool for the anti-matchmaking step of a
// live session (see docs/SESSION-RUNBOOK-2026-07-25.md).
//
// Takes a folder of participants' exported boards — working-folder .zips
// and/or unzipped folders — finds each board's state.json (same
// shallowest-file rule as the app's importer), and compiles ONE compact
// markdown digest of everyone's map: board title, concept, problem
// situations, themes, hunches, starred extracts. Paste the digest into your
// own LLM together with docs/ANTI-MATCHMAKING-PROMPT.md to form minimally
// aligned triads.
//
// Zero dependencies (node:zlib handles deflated entries; the tool's own
// zips are stored/uncompressed). Nothing is uploaded anywhere.
//
// Usage:
//   node scripts/digest-boards.mjs <input-dir> [output.md]
//
//   <input-dir>  folder containing the collected exports
//   [output.md]  where to write the digest (default: <input-dir>/digest.md)

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, basename, extname } from "node:path";
import { inflateRawSync } from "node:zlib";

const TIER_NAMES = {
  0: "Source Extract",
  1: "Evidence / Hunch",
  2: "Pattern",
  3: "Theme",
  4: "Super-theme",
  5: "Tier 5",
  6: "Tier 6",
};

// Mirrors the app's SIT_FIELDS (index.html) — the workbook prose that best
// characterizes where a participant's thinking is heading.
const SIT_FIELDS = [
  ["description", "Description"],
  ["frame", "Frame"],
  ["paradox", "Paradox"],
  ["statusQuoBeneficiaries", "Who benefits from the status quo"],
  ["problematization", "Problematization"],
  ["stakeholderMap", "Stakeholders"],
  ["voicesNeeded", "Voices needed"],
];

// ---------- minimal zip reader (stored + deflate) ----------

function readZipEntries(buf) {
  // Find the End Of Central Directory record: scan backwards through the
  // trailing 64KB (max comment length) for its signature.
  let eocd = -1;
  const start = Math.max(0, buf.length - 65557);
  for (let i = buf.length - 22; i >= start; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("not a zip (no end-of-central-directory)");

  const count = buf.readUInt16LE(eocd + 10);
  let pos = buf.readUInt32LE(eocd + 16);
  const entries = [];
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(pos) !== 0x02014b50) break;
    const method = buf.readUInt16LE(pos + 10);
    const compSize = buf.readUInt32LE(pos + 20);
    const nameLen = buf.readUInt16LE(pos + 28);
    const extraLen = buf.readUInt16LE(pos + 30);
    const commentLen = buf.readUInt16LE(pos + 32);
    const localOffset = buf.readUInt32LE(pos + 42);
    const name = buf.toString("utf8", pos + 46, pos + 46 + nameLen);
    entries.push({ name, method, compSize, localOffset });
    pos += 46 + nameLen + extraLen + commentLen;
  }
  return entries.map((e) => ({
    name: e.name,
    read() {
      // The local header repeats name/extra with its own lengths — trust it,
      // not the central record, for where the data starts.
      const p = e.localOffset;
      const nameLen = buf.readUInt16LE(p + 26);
      const extraLen = buf.readUInt16LE(p + 28);
      const dataStart = p + 30 + nameLen + extraLen;
      const raw = buf.subarray(dataStart, dataStart + e.compSize);
      if (e.method === 0) return raw;
      if (e.method === 8) return inflateRawSync(raw);
      throw new Error(`unsupported zip method ${e.method} for ${e.name}`);
    },
  }));
}

// ---------- state.json discovery (shallowest wins, like the app) ----------

function stateFromZip(path) {
  const entries = readZipEntries(readFileSync(path));
  const candidates = entries
    .filter((e) => basename(e.name) === "state.json")
    .sort((a, b) => a.name.split("/").length - b.name.split("/").length);
  if (!candidates.length) return null;
  return JSON.parse(candidates[0].read().toString("utf8"));
}

function stateFromDir(dir) {
  const found = [];
  (function walk(d, depth) {
    if (depth > 6) return;
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      const st = statSync(p);
      if (st.isDirectory()) walk(p, depth + 1);
      else if (name === "state.json") found.push({ p, depth });
    }
  })(dir, 0);
  if (!found.length) return null;
  found.sort((a, b) => a.depth - b.depth);
  return JSON.parse(readFileSync(found[0].p, "utf8"));
}

// ---------- digest ----------

const clip = (s, n = 280) => {
  const t = (s || "").replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n - 1) + "…" : t;
};

function digestBoard(wrapper, fallbackName) {
  if (!wrapper || wrapper.app !== "triangulator" || !wrapper.state) {
    throw new Error("not a triangulator export (missing app/state)");
  }
  const s = wrapper.state;
  const items = Array.isArray(s.items) ? s.items : [];
  const cards = Array.isArray(s.cards) ? s.cards : [];
  const situations = Array.isArray(s.situations) ? s.situations : [];
  const decisions = s.sorting?.decisions || {};

  const title = (s.settings?.title || "").trim() || fallbackName;
  const lines = [`## ${title}`, ""];
  lines.push(`- Mode: ${s.mode === "pod" ? "Pod (full engine)" : "Seed"}`);
  if ((s.settings?.concept || "").trim())
    lines.push(`- Concept / provisional hunch: ${clip(s.settings.concept)}`);

  const kept = items.filter(
    (it) => decisions[it.id] && decisions[it.id] !== "noise"
  );
  const starred = items.filter((it) => decisions[it.id] === "super");
  lines.push(
    `- Extracts: ${items.length} total, ${kept.length} kept as signal (${starred.length} starred)`
  );

  for (const sit of situations) {
    lines.push("", `### Problem situation: ${clip(sit.title) || "Untitled"}`);
    for (const [key, label] of SIT_FIELDS) {
      if ((sit[key] || "").trim()) lines.push(`- ${label}: ${clip(sit[key])}`);
    }
    if (Array.isArray(sit.paradoxes) && sit.paradoxes.length) {
      lines.push(
        `- Paradoxes: ${sit.paradoxes
          .map((p) => clip(p.text, 160))
          .filter(Boolean)
          .join(" | ")}`
      );
    }
    if (Array.isArray(sit.fieldActors) && sit.fieldActors.length) {
      lines.push(
        `- Field actors: ${sit.fieldActors
          .map((a) => `${a.name}${a.role ? ` (${a.role})` : ""}`)
          .join(", ")}`
      );
    }
  }

  const upper = cards.filter((c) => c.tier >= 2);
  if (upper.length) {
    lines.push("", "### Patterns & themes");
    for (const c of upper
      .sort((a, b) => b.tier - a.tier)
      .slice(0, 10)) {
      lines.push(
        `- [${TIER_NAMES[c.tier] || `Tier ${c.tier}`}] ${clip(c.title, 100)}${
          (c.description || "").trim() ? ` — ${clip(c.description, 200)}` : ""
        }`
      );
    }
  }

  const tier1 = cards.filter((c) => c.tier === 1);
  if (tier1.length) {
    lines.push("", "### Evidence / hunches");
    for (const c of tier1.slice(0, 8)) {
      lines.push(
        `- ${clip(c.title, 100)}${
          (c.description || "").trim() ? ` — ${clip(c.description, 200)}` : ""
        }${c.cardType ? ` (${c.cardType})` : ""}`
      );
    }
    if (tier1.length > 8) lines.push(`- …and ${tier1.length - 8} more`);
  }

  if (starred.length) {
    lines.push("", "### Starred extracts");
    for (const it of starred.slice(0, 8)) {
      lines.push(`- ${clip(it.title, 100)} — ${clip(it.summary, 180)}`);
    }
    if (starred.length > 8) lines.push(`- …and ${starred.length - 8} more`);
  }

  return lines.join("\n");
}

// ---------- main ----------

const [, , inputDir, outArg] = process.argv;
if (!inputDir) {
  console.error("Usage: node scripts/digest-boards.mjs <input-dir> [output.md]");
  process.exit(1);
}

const sections = [];
const skipped = [];
for (const name of readdirSync(inputDir).sort()) {
  const p = join(inputDir, name);
  const st = statSync(p);
  const fallbackName = basename(name, extname(name));
  try {
    let wrapper = null;
    if (st.isFile() && extname(name).toLowerCase() === ".zip") {
      wrapper = stateFromZip(p);
    } else if (st.isDirectory()) {
      wrapper = stateFromDir(p);
    } else {
      continue;
    }
    if (!wrapper) {
      skipped.push(`${name}: no state.json found`);
      continue;
    }
    sections.push(digestBoard(wrapper, fallbackName));
  } catch (err) {
    skipped.push(`${name}: ${err.message}`);
  }
}

if (!sections.length) {
  console.error("No readable boards found.");
  for (const s of skipped) console.error(`  skipped ${s}`);
  process.exit(1);
}

const out = outArg || join(inputDir, "digest.md");
const header = [
  "# Board digest",
  "",
  `${sections.length} board(s). Paste this whole file into your LLM together`,
  "with docs/ANTI-MATCHMAKING-PROMPT.md to form minimally aligned triads.",
  "",
].join("\n");
writeFileSync(out, header + "\n" + sections.join("\n\n---\n\n") + "\n");

console.log(`Wrote ${out} (${sections.length} boards)`);
for (const s of skipped) console.warn(`  skipped ${s}`);
