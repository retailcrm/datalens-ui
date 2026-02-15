---
name: navigation-refinery
description: Use this skill when replacing browser-driven internal navigation in datalens-ui with router/history transitions.
---

# Navigation Refinery

Use this skill for internal navigation cleanup in `src/ui`.

## Source of Truth

- Router utilities: `src/ui/navigation/router.ts`, `src/ui/navigation/history.ts`

## Preferred Transitions

- Internal same-tab navigation:
  - `router.push(...)`
  - `router.replace(...)`
  - `history.push(...)`
  - `history.replace(...)`
- Reading route state:
  - `useLocation()/getLocation()`

## Avoid for Internal SPA Transitions

- `window.history.replaceState(...)`
- `window.location.assign(...)`
- native `<a href="/...">` for same-tab internal routes
- raw `window.open(...)` if new-tab behavior is not required

## Allowed Browser Navigation Cases

- External links (for example docs/help pages), including `target="_blank"` or `router.openTab(...)`.
- Intentional new-tab UX for internal links only when product behavior explicitly requires it.
- Full reload behavior required by product logic

## URL Assembly for `href` and Buttons

Use these patterns when refactoring internal URLs before passing them into link/button props.

- Normalize incoming URL first with `new URL(...)`.
  - For absolute or mixed input: `new URL(rawHref, window.location.origin)`.
  - For pure path parsing without real origin: `new URL(pathLikeValue, 'http://sample.test')`.
- For `href` props, build router-compatible href from parsed parts:
  - `router.history.createHref({pathname, search, hash})`.
- If helper must return only internal path, return parsed `pathname` (or `pathname + search` if needed), not absolute origin URL.
- Preserve existing tab behavior (`target`, `rel`) while changing only URL preparation.
- Avoid manual string slicing/concatenation when `URL`/router helpers can preserve query/hash safely.
- If code context does not clearly show whether the URL must stay absolute/external or become internal normalized path, do not guess. Keep the current behavior and leave the normalization decision to a human reviewer.

Short examples:

```ts
// 1) Mixed/absolute input -> safe href for Link/Button
const url = new URL(rawHref, window.location.origin);
const href = router.history.createHref({
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
});
```

```ts
// 2) Path-like value -> parse without relying on real origin
const url = new URL(pathLikeValue ?? '/', 'http://sample.test');
const href = history.createHref({pathname: url.pathname, search: url.search});
```

```ts
// 3) Helper returns internal route only
return new URL(rawInternalUrl, window.location.origin).pathname;
```

## Refactor Checklist

1. Confirm target URL is internal.
2. Confirm whether the URL is internal or external; `target="_blank"` alone is not enough.
3. If internal/external intent is ambiguous from codebase context, do not force normalization; escalate decision to human.
4. Preserve tab behavior (`_self` vs `_blank`).
5. Replace browser API call with router/history equivalent.
6. Keep analytics/callback side effects unchanged.
7. Run targeted checks for changed files.
