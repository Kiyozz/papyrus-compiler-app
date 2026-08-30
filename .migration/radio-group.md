# radio-group

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. Straight primitive swap; the item primitive moved to its own package path.

## Changed

- `src/renderer/components/ui/radio-group.tsx` - `radix-ui` RadioGroup ->
  `@base-ui/react/radio-group` for the root and `@base-ui/react/radio` for the
  items (Base UI splits them). Project class string preserved.
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

- Same `data-checked` / `data-unchecked` shift as checkbox and switch.

## Verify by hand

1. Settings > theme: pick each option with the mouse, then with the arrow
   keys - arrow navigation should move the selection, not just focus.
