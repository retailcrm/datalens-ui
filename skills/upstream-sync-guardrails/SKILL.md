---
name: upstream-sync-guardrails
description: Use this skill when syncing fork changes with upstream in datalens-ui and minimizing regressions. Apply it for merge/rebase/cherry-pick intake, risk-focused verification, dependency graph drift control, and baseline budget checks.
---

# Upstream Sync Guardrails

Use this skill for `main <- upstream` sync and for promotion from synced `main` into `release-*`.

## Goals

- Keep sync deterministic and repeatable.
- Catch regressions in high-risk UI zones early.
- Prevent silent architecture drift (cycles and debt metrics growth).

## Required Branch Model

- Keep `main` as sync-only branch.
- Keep product work in `release-*` branches.
- Avoid feature commits in `main`.

## Intake Workflow

1. Sync `main` with upstream.
2. Run quick guardrails:
   - `npm run ci:upstream:quick`
3. If quick pass is clean, run full guardrails:
   - `npm run ci:upstream`
4. Promote into target `release-*` by cherry-pick/rebase policy used in this fork.
5. Run quick guardrails again on the release branch.

## Guardrails Commands

- Quick:
  - `npm run ci:upstream:quick`
- Full:
  - `npm run ci:upstream`

Both commands use:

- `scripts/ci/upstream-sync-checks.sh`
- `scripts/ci/upstream-sync-budgets.json`

## Budget Policy

- Treat budgets as upper bounds.
- Failing condition: any metric above budget.
- Budget decreases are allowed and recommended.
- Budget increases require explicit human approval and separate commit with rationale.

## What The Checks Enforce

- `madge` circular dependencies for:
  - `src/ui`
  - `src/server`
  - `src/shared`
- Debt counters:
  - `@ts-ignore` + `@ts-expect-error`
  - `eslint-disable`
  - `TODO|FIXME|HACK`
- Type safety and build:
  - `npm run typecheck:ui`
  - `npm run typecheck:server` (full mode)
  - `npm run build:lib` (full mode)

## Update Rules

- If upstream changes reduce metrics, update budgets downward.
- If metrics increase due intentional temporary compromise:
  - open a separate budget-update commit;
  - include short reason in commit body;
  - add follow-up task to revert the increase.
