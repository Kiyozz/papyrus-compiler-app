# dropdown-menu

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. Migrated to the Base UI Menu family.

## Changed

- `src/renderer/components/ui/dropdown-menu.tsx` - `radix-ui` DropdownMenu ->
  `@base-ui/react/menu`. `Content` becomes `Portal > Positioner > Popup`, `Sub`
  becomes `SubmenuRoot` / `SubmenuTrigger`, `Label` becomes `GroupLabel`, and
  `CheckboxItem` / `RadioItem` use `ItemIndicator`.
- Consumers updated: `groups-menu.tsx` and `groups-list-item-menu.tsx` -
  `DropdownMenuTrigger asChild` -> `render={<Button ... />}` with the icon and
  label moved to the trigger's children.
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

- Base UI menus still close on item press, but the reason is reported through
  `onOpenChange` event details rather than through `onSelect`'s event. No
  consumer relied on preventing that.

## Verify by hand

1. Compilation page: open the "Groupe" dropdown, hover through the items, pick
   one with the mouse and one with Enter.
2. Groups page: open a row's "..." menu, check the destructive item's colour,
   and that Escape closes the menu and returns focus to the trigger.
