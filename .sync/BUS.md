# Sync Bus Protocol

A lightweight way to keep multiple Claude nodes working on this repo coherent.
There is no live message broker — **GitHub is the bus**, and the shared files in
the repo are the messages. Nodes never talk directly; they exchange state by
reading and writing the repo.

## Nodes

| Node            | What it is                                             |
|-----------------|--------------------------------------------------------|
| `github`        | The transport / durable shared store (the bus itself). |
| `claude-local`  | Claude Code running on this machine.                   |
| `claude-remote` | Claude Code in the cloud (claude.ai/code) on the repo. |

## The messages (shared files)

- **`SPEC.md`** — the contract. What the product *should* be.
- **`.sync/state.json`** — the heartbeat. Who synced last, when, and what each
  node is currently focused on. This is the "presence + status" channel.
- The **git history** — the event log. Commit messages are the events.

## Protocol — every work session

1. **PULL** `git pull --rebase` to load the latest spec + state before working.
2. **READ** `SPEC.md` and `.sync/state.json` to see the current contract and
   what the other node last did.
3. **WORK SPEC-First** — edit `SPEC.md` before code (see `CLAUDE.md`).
4. **HEARTBEAT** — update your node's entry in `.sync/state.json`
   (`last_sync` = today's date, `focus` = one line on what you're doing,
   `spec_version` = the version you worked against).
5. **COMMIT** spec + code + state together. Use the message convention below.
6. **PUSH** to GitHub so the other node sees it on its next PULL.

## Commit message convention (the event format)

```
<node>: <type>(<scope>) <summary>   [spec:<version>]

# examples
claude-local: feat(releases) add genre filter            [spec:1.1.0]
claude-remote: docs(spec) clarify Bandcamp embed params  [spec:1.1.1]
```

`type` ∈ feat | fix | docs | chore | refactor.

## Conflict resolution

- `SPEC.md` is authoritative — reconcile code to the spec, not the reverse.
- Prefer small, frequent pushes to keep the two nodes from diverging.
- If `state.json` conflicts, keep **both** nodes' entries (merge the objects).

## Connecting GitHub (one-time)

`gh` is not installed on claude-local yet. To wire up the bus, either:

- **A.** Install + auth GitHub CLI, then create the repo:
  `gh auth login` → `gh repo create sontra-records --private --source=. --push`
- **B.** Create an empty repo on github.com and point this clone at it:
  `git remote add origin <URL>` → `git push -u origin main`

Then on **claude-remote**, open the same repo — `CLAUDE.md` makes it follow this
protocol automatically.
