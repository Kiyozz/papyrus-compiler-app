# badge

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. Migrated to Base UI `useRender`.

## Changed

- `src/renderer/components/ui/badge.tsx` - `Slot.Root` + `asChild` replaced by `useRender` /
  `mergeProps` from `@base-ui/react`; the component now takes a `render` prop.
  The project's extra `success` variant is preserved.
- Leftover scan clean.

`src/renderer/lib/utils.ts` - `cn` now carries two overloads: Base UI types
`className` as `string | ((state) => string | undefined)`, so merging a part's
own classes with an incoming one has to keep that shape. `cn` returns a plain
string unless one of its inputs is a function, in which case it returns a
function of the state. Every wrapper in this migration depends on it.

## Left alone

- `src/renderer/components/ui/sonner.tsx` - sonner, not radix.
- `src/renderer/components/ui/alert.tsx`, `src/renderer/components/ui/input.tsx`, `src/renderer/components/ui/skeleton.tsx` - plain HTML, no radix
  to migrate; left at their current registry revision on purpose.

## Behavior changes

- `asChild` is gone from the public API; use `render={<a />}`. No consumer
  used it, so no call site changed.

## Verify by hand

1. Open the compilation page: badges render at the right size and colour.
2. Check the `success` badge still shows green in both light and dark theme.
