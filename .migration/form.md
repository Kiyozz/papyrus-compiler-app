# form

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. No maia golden exists for `form`: migrated by hand with the transformation engine.

## Changed

- `src/renderer/components/ui/form.tsx` - the registry has no `form` item under `radix-maia` /
  `base-maia` (both return an item with no files), so this file was transformed
  directly rather than replayed from a golden.
- `LabelPrimitive.Root` was only used as a type: `FormLabel` is now typed
  `React.ComponentProps<typeof Label>`, matching the native-`<label>` Label.
- `FormControl` no longer uses `Slot.Root`. It keeps its `children`-based API
  (12 call sites unchanged) by passing that single child to `useRender` as the
  `render` element, so the `id`, `aria-describedby` and `aria-invalid` wiring
  still lands on the control.
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

- `FormControl`'s child is now typed as `ReactElement` (it always was one in
  practice); passing text or a fragment is now a type error rather than a
  runtime surprise.
- Pre-existing and unchanged: wrapping a `<Select>` in `<FormControl>` still
  cannot attach the id/aria props, because the select root renders no element.
  Radix's Slot had the same gap.

## Verify by hand

1. Settings: leave a required field empty and submit - the error message still
   appears under the field and the field gets `aria-invalid` styling.
2. Click a field's label: focus moves into the input (the `htmlFor` wiring).
3. Check the folder pickers and the theme radio group still submit their
   values.
