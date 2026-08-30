# sheet

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. Migrated to Backdrop/Popup; titlebar offsets and the wheel guard replayed.

## Changed

- `src/renderer/components/ui/sheet.tsx` - `radix-ui` Dialog -> `@base-ui/react/dialog`.
  `Overlay` -> `Backdrop`, `Content` -> `Popup`, `SheetClose` uses `render`.
  Enter/exit animation classes move from `data-open` / `data-closed` to the base
  golden's `data-starting-style` / `data-ending-style`.
- Project customizations replayed onto the base golden by hand: the backdrop's
  `inset-x-0 top-(--titlebar-height) bottom-0`, the `side=left` panel's
  `top-(--titlebar-height) bottom-0 h-page-with-titlebar`, and the `onWheel`
  handler that stops propagation so a sheet nested in a dialog can scroll. Its
  parameter is now typed from the Base UI prop (`BaseUIEvent<...>`).
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

- The open/close transition is now a CSS transition driven by
  `data-starting-style` / `data-ending-style` rather than a tw-animate-css
  keyframe animation. Same direction and duration, slightly different feel.

## Verify by hand

1. Open the mobile sidebar sheet (narrow the window): it slides in from the
   left, starts below the titlebar, and covers the full remaining height.
2. Scroll inside it while a dialog is open - the wheel must not be swallowed.
3. Close it with Escape, with the close button, and by clicking the backdrop.
