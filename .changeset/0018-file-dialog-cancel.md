---
'pca': patch
---

Fix the add scripts button staying disabled after closing the file picker without selecting anything. The picker fires `cancel` in that case, never `change`, so the flag tracking the open dialog was never cleared.
