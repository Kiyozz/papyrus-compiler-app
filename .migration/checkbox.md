# checkbox

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. Straight primitive swap.

## Changed

- `src/renderer/components/ui/checkbox.tsx` - `radix-ui` Checkbox -> `@base-ui/react/checkbox`;
  `CheckboxPrimitive.Indicator` keeps the lucide `CheckIcon`. The project's
  class string (which drops the registry's newer
  `group-has-[:focus-visible]/field-label:*` rules) was preserved.
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

- Base UI drives the checked state with `data-checked` / `data-unchecked`
  instead of Radix's `data-state`; the golden classes already use the Base UI
  form, so styling follows.

## Verify by hand

1. Settings: toggle a checkbox with the mouse and with Space.
2. Confirm the checked background and the check icon appear.
