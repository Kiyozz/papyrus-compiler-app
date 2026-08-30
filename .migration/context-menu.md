# context-menu

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. Migrated to the Base UI ContextMenu + Menu families.

## Changed

- `src/renderer/components/ui/context-menu.tsx` - `radix-ui` ContextMenu ->
  `@base-ui/react/context-menu` for the root and trigger, `@base-ui/react/menu`
  for the popup parts. Same `Portal > Positioner > Popup` reshaping and the same
  part renames as dropdown-menu.
- Leftover scan clean.

`src/renderer/lib/utils.ts` - `cn` now carries two overloads: Base UI types
`className` as `string | ((state) => string | undefined)`, so merging a part's
own classes with an incoming one has to keep that shape. `cn` returns a plain
string unless one of its inputs is a function, in which case it returns a
function of the state. Every wrapper in this migration depends on it.

## Left alone

- No consumer imports `context-menu` today; it was migrated so the wrapper
  set stays coherent and `radix-ui` could be removed.
- `src/renderer/components/ui/sonner.tsx` - sonner, not radix.
- `src/renderer/components/ui/alert.tsx`, `src/renderer/components/ui/input.tsx`, `src/renderer/components/ui/skeleton.tsx` - plain HTML, no radix
  to migrate; left at their current registry revision on purpose.

## Behavior changes

None observed (no consumer).

## Verify by hand

1. Nothing to click in the app today. If you wire a context menu up, check
   right-click opens it at the pointer and Escape closes it.
