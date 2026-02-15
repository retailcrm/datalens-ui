# AGENTS

## Goals
- Avoid clarification loops by proposing a concrete interpretation when details
  are missing.
- Default to the language of the user's initial message unless they explicitly
  request a different language.
- Match the tone and formality of the user's initial message unless they
  explicitly ask for a change.
- Treat a language switch in the user's message as an explicit request to
  respond in that language.
- If a message is mixed-language, reply in the dominant language unless the
  user specifies otherwise.
- Getter/helper functions must be side-effect free. Side effects are allowed
  only by prior agreement and only when there are strong, explicit reasons.
  This rule is applied for new code and refactoring of old code.

## Skills

Local skill map for the `datalens-ui` repository:

- `commit-workflow`
  - Path: `skills/commit-workflow/SKILL.md`
  - Use when creating commits, splitting changes, and validating commit message format.

- `navigation-refinery`
  - Path: `skills/navigation-refinery/SKILL.md`
  - Use when replacing browser-driven internal navigation with router/history transitions.

- `yarn-lock-conflict-resolution`
  - Path: `skills/yarn-lock-conflict-resolution/SKILL.md`
  - Use when resolving `yarn.lock` conflicts during merge/rebase.

## Activation Rule

- If a task matches one of the scenarios above, open the corresponding `SKILL.md` first, then perform changes.
