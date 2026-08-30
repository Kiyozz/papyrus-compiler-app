# scroll-area

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. Straight primitive swap; the project's layout fix survives.

## Changed

- `src/renderer/components/ui/scroll-area.tsx` - `radix-ui` ScrollArea ->
  `@base-ui/react/scroll-area`; `Scrollbar` replaces `ScrollAreaScrollbar` and
  the orientation data attributes become `data-horizontal` / `data-vertical`.
- All three project customizations were preserved by the merge: the forwarded
  `ref` onto the viewport, the `flex flex-col` + `min-h-0 flex-1` sizing, and
  the comment explaining why the viewport cannot use a percentage height.
- The now-unused `import * as React` was dropped.
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

None expected; the scrollbar is still overlay-styled and hover-revealed.

## Verify by hand

1. Open the compilation page with enough scripts to overflow, and the logs
   dialog: both must scroll, and the last row must not be cut off.
2. Check the scrollbar thumb appears on hover and drags correctly.
