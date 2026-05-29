# Contributing to usekit

Thanks for your interest in improving usekit! ❤️ Contributions of all kinds are
welcome — bug reports, docs, new hooks, and tests.

## Getting started

```bash
git clone https://github.com/usekit/usekit.git
cd usekit
npm install
npm test          # run the test suite
npm run demo      # play with the interactive demo
```

## Adding a new hook

Every hook lives in its own file and is exported from the barrel. To add one:

1. **Create** `src/hooks/useYourHook.ts`.
2. **Document** it with a JSDoc block and at least one `@example`.
3. **Export** it (and its public types) from `src/index.ts`.
4. **Test** it in `src/hooks/useYourHook.test.ts` (or `.test.tsx`).
5. **Demo** it (optional but appreciated) by adding an entry to
   `demo/src/demos.tsx`.
6. **List** it in both `README.md` and `README.zh-CN.md`.

### Quality bar

A hook should be:

- **SSR-safe** — never touch `window`/`document` without a guard.
- **Typed** — no `any` in public signatures; export option/return types.
- **Stable** — memoize returned callbacks/objects so consumers can rely on
  referential stability.
- **Cleaned up** — every listener/timer/observer is removed on unmount.

## Commit & PR

- Keep PRs focused — one hook or one fix per PR where possible.
- Make sure `npm test` and `npm run typecheck` pass.
- Describe the motivation and include a usage snippet in the PR description.

## Code of conduct

Be kind and constructive. We're all here to build something useful together.
