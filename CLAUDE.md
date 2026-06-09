# CLAUDE.md — Sontra Records operating contract

This repository is worked on by multiple Claude nodes — **claude-local** (this
machine) and **claude-remote** (cloud / claude.ai/code) — that stay in sync
through **GitHub**. Read this before doing anything. Claude Code loads this file
automatically at session start, so the rules below apply to every node.

## Rule: SPEC-First

- **`SPEC.md` is the single source of truth.** Before writing or changing code,
  update `SPEC.md` so the change is specified there *first*.
- Every implementation must trace to a section of `SPEC.md`. If a request is not
  in the spec, add it to the spec, then build.
- Commit the spec change **together** with the code that implements it.
- On any conflict, `SPEC.md` wins — reconcile code to the spec.

## Sync bus (github + claude-local + claude-remote)

**GitHub is the bus.** Full protocol in [`.sync/BUS.md`](.sync/BUS.md). In short,
every work session:

1. **PULL** first — get the latest spec + state from GitHub.
2. Work **SPEC-First** (update `SPEC.md` before code).
3. Update the heartbeat in [`.sync/state.json`](.sync/state.json) (your node id,
   date, current focus, spec version).
4. **COMMIT** spec + code + state together, then **PUSH**.

This keeps claude-local and claude-remote coherent without talking directly:
they exchange state by reading/writing the shared repo.
