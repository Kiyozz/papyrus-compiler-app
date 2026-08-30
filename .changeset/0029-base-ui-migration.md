---
'pca': minor
---

Migrate every UI component from Radix UI to Base UI. `radix-ui` is gone from the dependency tree, `components.json` now targets the `base-maia` style, and all 19 wrappers (button, dialog, sheet, select, tooltip, the menu family, sidebar, form...) use `@base-ui/react`. Composition moves from `asChild` to `render`, and popups gain Base UI's `Portal > Positioner > Popup` anatomy. No visible change is expected beyond two details: double-clicking a form label now selects its text (Radix used to block it), and sheet transitions are CSS-driven instead of keyframed.
