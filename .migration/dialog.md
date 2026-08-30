# dialog

2026-08-30, golden pair via CLI (shadcn radix-maia -> base-maia) + three-way merge. Migrated to Backdrop/Popup, with the project's fullscreen and sonner guard replayed.

## Changed

- `src/renderer/components/ui/dialog.tsx` - `radix-ui` Dialog -> `@base-ui/react/dialog`.
  `Overlay` -> `Backdrop`, `Content` -> `Popup`, and `DialogClose` uses
  `render={<Button />}` instead of `asChild`.
- Project customizations kept: the `fullscreen` prop (and its
  `{!fullscreen && <DialogOverlay />}` branch), the `--titlebar-height` offset
  on the backdrop, the max-height sizing, and the header/footer `shrink-0`
  comment.
- The sonner guard moved from `DialogContent`'s `onInteractOutside` to the
  root's `onOpenChange`: Base UI has no per-part outside-press handler, so the
  wrapper now inspects `eventDetails.reason === 'outside-press'` and calls
  `eventDetails.cancel()` when the press landed inside `[data-sonner-toaster]`.
- Consumers updated: `dialog-compilation-logs.tsx`, `dialog-documentation.tsx`,
  `dialog-recent-files.tsx` (`DialogTrigger` / `DialogClose` `asChild` ->
  `render`, and their `children` prop is now typed `ReactElement` instead of
  being cast), `dialog-setup.tsx` (see below).
- `app-sidebar.tsx`: the footer items used to wrap the whole
  `<SidebarMenuItem>` (an `<li>`) in the dialog, so the trigger's props landed
  on the list item. Base UI's `DialogTrigger` checks this (`nativeButton`) and
  warns; the dialog now wraps the `<SidebarMenuButton>` instead, which is the
  real `<button>`.
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

- `dialog-setup.tsx` lost its `onEscapeKeyDown` / `onInteractOutside`
  guards - Base UI has no equivalent props. They were redundant: that dialog is
  controlled (`open={isOpen}`) and its `onOpenChange` already refuses to close
  while `isBlocking`, so escape and outside presses stay blocked.
- Focus return, scroll lock and the modal behaviour are now Base UI's (`modal`
  defaults to `true`, same as Radix).

## Verify by hand

1. Open the logs dialog from the sidebar: it opens fullscreen, has no
   backdrop, and closes with Escape and with the close button.
2. With the logs dialog open, trigger a toast and dismiss it - the dialog must
   stay open (this is the sonner guard).
3. Open the setup dialog on a blocking step: Escape and clicking outside must
   NOT close it; the close button must be hidden.
4. Close any dialog and confirm focus returns to the element that opened it.
