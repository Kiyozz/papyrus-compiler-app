---
'pca': patch
---

Telemetry is now opt-in. A dialog asks for explicit consent, and nothing is sent until the user accepts. Every existing install is reset to off and asked again. File paths and usernames are stripped from telemetry payloads, including error messages and stack traces.
