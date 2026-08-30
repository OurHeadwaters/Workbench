---
name: Artifact release gates
description: Where deploy-blocking validation belongs in this multi-artifact workspace and how external target URLs are selected.
---

Put validation that must block one artifact's deployment in that artifact's own production build command, not only in a root workspace build or a dormant package script.

**Why:** The root build spans unrelated artifacts and can fail before reaching a final appended check, while an artifact deployment runs the artifact's own build command. A release gate must execute on that actual path to protect the artifact.

**How to apply:** Keep the check runnable on its own for local diagnosis, invoke it from the relevant artifact build, and honor `PLAYWRIGHT_BASE_URL` for pre-release or production targets without starting a local test server.