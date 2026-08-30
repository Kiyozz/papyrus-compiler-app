# label

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. Radix Label has no Base UI counterpart: replaced by a native `<label>`.

## Changed

- `src/renderer/components/ui/label.tsx` - `LabelPrimitive.Root` replaced by a plain `<label>`
  element, typed `React.ComponentProps<'label'>`; classes unchanged.
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

- Radix's Label prevented text selection on double-click inside the label.
  A native `<label>` does not: double-clicking a label's text now selects it.
  Clicking a label still focuses/toggles its control (native behaviour).

## Verify by hand

1. In Settings, click a checkbox/switch label: the control still toggles.
2. Double-click a label: text now gets selected (expected difference).
