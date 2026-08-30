# breadcrumb

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. Migrated the one radix part (Slot) to `useRender`.

## Changed

- `src/renderer/components/ui/breadcrumb.tsx` - `BreadcrumbLink` and `BreadcrumbPage`'s
  `Slot.Root` / `asChild` replaced by `useRender` + `mergeProps`; they now take
  a `render` prop. Everything else is plain HTML and unchanged.
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

- `asChild` renamed to `render` on `BreadcrumbLink`. No consumer used it -
  the pages use `BreadcrumbPage` with plain children.

## Verify by hand

1. Settings and the other pages: the header breadcrumb still renders with its
   separator and the current page in the emphasised style.
