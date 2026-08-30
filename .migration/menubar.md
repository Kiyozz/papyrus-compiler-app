# menubar

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. Migrated to the Base UI Menubar + Menu families.

## Changed

- `src/renderer/components/ui/menubar.tsx` - `radix-ui` Menubar -> `@base-ui/react/menubar` for
  the root and `@base-ui/react/menu` for each menu's parts, with the same
  `Portal > Positioner > Popup` reshaping as dropdown-menu.
- Leftover scan clean.

`src/renderer/lib/utils.ts` - `cn` now carries two overloads: Base UI types
`className` as `string | ((state) => string | undefined)`, so merging a part's
own classes with an incoming one has to keep that shape. `cn` returns a plain
string unless one of its inputs is a function, in which case it returns a
function of the state. Every wrapper in this migration depends on it.

## Left alone

- No consumer imports `menubar` today; migrated for the same reason as
  context-menu.
- `src/renderer/components/ui/sonner.tsx` - sonner, not radix.
- `src/renderer/components/ui/alert.tsx`, `src/renderer/components/ui/input.tsx`, `src/renderer/components/ui/skeleton.tsx` - plain HTML, no radix
  to migrate; left at their current registry revision on purpose.

## Behavior changes

None observed (no consumer).

## Verify by hand

1. Nothing to click in the app today. If you wire a menubar up, check that
   hovering across top-level items switches menus once one is open.
