# select

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. Migrated to the Positioner/Popup/List anatomy.

## Changed

- `src/renderer/components/ui/select.tsx` - `radix-ui` Select -> `@base-ui/react/select`.
  `SelectContent` was taken wholesale from the base golden: `Content` becomes
  `Positioner > Popup > List`, `position="item-aligned" | "popper"` becomes the
  boolean `alignItemWithTrigger`, and the CSS variables move from
  `--radix-select-content-available-height` /
  `--radix-select-content-transform-origin` to `--available-height` /
  `--transform-origin` / `--anchor-width`. The project's extra `p-1` padding on
  the popup was re-applied.
- Scroll buttons are `SelectPrimitive.ScrollUpArrow` / `ScrollDownArrow`.
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

- No consumer passed `position`, so the switch to `alignItemWithTrigger`
  (default `true`, matching the old `item-aligned` default) is invisible at the
  call sites.

## Verify by hand

1. Settings > game: open the select, check it aligns over the trigger, pick an
   item with the mouse.
2. Reopen and navigate with the arrow keys, then type the first letters of an
   option (typeahead) - selection should follow.
3. Confirm the popup's blur background and the check mark on the selected item
   still render.
