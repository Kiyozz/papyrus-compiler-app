# sidebar

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. Largest wrapper; migrated via the golden pair with every project tweak replayed.

## Changed

- `src/renderer/components/ui/sidebar.tsx` - the radix parts (`Slot` for `asChild`, the
  Sheet-backed mobile sidebar, the tooltip on collapsed menu buttons) now go
  through `useRender` / `mergeProps` and the migrated `sheet.tsx` and
  `tooltip.tsx`. `SidebarMenuButton`, `SidebarMenuAction`,
  `SidebarMenuSubButton` and `SidebarGroupLabel` take `render` instead of
  `asChild`.
- Project customizations preserved by the merge: `min-h-page-with-titlebar` on
  the wrapper, the `top-(--titlebar-height)` + `h-page-with-titlebar` fixed
  panel, the explicit `open?: boolean` on the provider props, and the
  `hsl(var(--sidebar-border))` / `hsl(var(--sidebar-accent))` shadow colours.
- Consumer updated: `app-sidebar.tsx` - `<SidebarMenuButton asChild><Link/></>`
  became `<SidebarMenuButton render={<Link />}>` with the icon and label as
  children.
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
- `src/renderer/hooks/use-mobile.ts` - the registry would have rewritten it,
  but it has no radix content; left untouched.

## Behavior changes

- Collapsed-state tooltips now come from the migrated tooltip (provider-based
  delay). They still only show when the sidebar is collapsed and not on
  mobile.

## Verify by hand

1. Collapse the sidebar (icon mode): hover each item, the tooltip must appear
   to the right with the item's label.
2. Click a nav item: it navigates and the active row keeps its accent
   background (`data-[status=active]`).
3. Narrow the window so the sidebar becomes a sheet: open it, click an item,
   confirm it closes.
4. Click the logo button: the titlebar menu still opens at the pointer.
