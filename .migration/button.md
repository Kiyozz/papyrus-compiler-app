# button

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. Migrated to the real Base UI Button primitive.

## Changed

- `src/renderer/components/ui/button.tsx` - `Slot.Root` + `asChild` replaced by
  `@base-ui/react/button`; props typed as `ButtonPrimitive.Props &
VariantProps<typeof buttonVariants>`, which brings `render` in place of
  `asChild`. Project customizations kept: the `type = 'button'` default and the
  `data-variant` / `data-size` attributes the base golden had dropped, plus the
  `secondary` hover colour (`hover:bg-secondary/80` instead of the registry's
  newer `color-mix` value).
- Leftover scan clean: `grep -n "radix-ui|@radix-ui" src/renderer/components/ui/button.tsx` -> no
  match.

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

- No consumer passed `asChild` to `Button`, so nothing had to move to `render`
  at the call sites; `Button` still renders a `<button>` by default.
- Base UI's Button omits `color` from its props (it is a legacy HTML
  attribute). `dialog-compilation-logs.tsx` passed `color="error"`, which had no
  visual effect under Radix either - it was removed rather than translated.

## Verify by hand

1. Click a few buttons across the app: the press animation
   (`active:translate-y-px`) and the disabled state still behave.
2. Tab to a button: the focus ring shows.
3. Check a button used as a menu trigger still gets its `aria-expanded`
   styling.
