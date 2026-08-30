# card

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. Migrated by hand from Radix Slot to Base UI `useRender`.

## Changed

- `src/renderer/components/ui/card.tsx` - the project's `asChild` prop (backed by `Slot.Root`)
  became a `render` prop backed by `useRender`, typed
  `useRender.ComponentProps<'div'>`. The rest of the file is the base golden:
  the project's own spacing classes (`gap-6` / `py-6` / `px-6` +
  `group-data-[size=sm]/card:*`) were kept over the registry's newer
  `--card-spacing` variable, which this app does not define.
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

- `asChild` renamed to `render`. `Card` was never used with `asChild` in this
  app (`settings-section.tsx` is the only consumer), so no call site changed.

## Verify by hand

1. Open Settings: each section card keeps its rounded corners, ring and
   padding.
2. Check a `size="sm"` card if one exists - the reduced padding still applies.
