# tooltip

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. Migrated to the Portal > Positioner > Popup anatomy.

## Changed

- `src/renderer/components/ui/tooltip.tsx` - `radix-ui` Tooltip -> `@base-ui/react/tooltip`.
  `TooltipContent` now renders `Portal > Positioner > Popup` with the arrow
  inside the popup; `--radix-tooltip-content-transform-origin` became
  `--transform-origin`. `TooltipProvider` takes `delay` (was `delayDuration`).
- Consumers updated: `dialog-compilation-logs.tsx`, `script-line.tsx`,
  `settings-game-section.tsx`, `settings-page.tsx` - `asChild` -> `render`,
  `disableHoverableContent` -> `disableHoverablePopup`, and every per-tooltip
  `delayDuration` moved onto a local `<TooltipProvider delay={...}>` wrapper
  because Base UI carries the delay on the provider, not on the root.
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

- The golden still carries a dead `data-[state=delayed-open]:*` rule inherited
  from the Radix variant; Base UI never sets that attribute. Kept as-is so the
  file stays diffable against the registry.
- Delay grouping changed shape: a `<TooltipProvider delay={500}>` now wraps a
  single tooltip (one per script row, for instance), so moving the pointer
  between two such tooltips no longer skips the delay the way one shared
  provider did.
- The global provider in `src/renderer/index.tsx` still applies `delay={0}`
  everywhere else.

## Verify by hand

1. Hover the "open compiled folder" button on a script row: the tooltip
   should appear after ~500ms, and the arrow should point at the button.
2. Hover the info icons in Settings > game: ~150ms delay.
3. Hover the header actions in Settings: instant, and the popup must not stay
   open when the pointer moves onto it (`disableHoverablePopup`).
