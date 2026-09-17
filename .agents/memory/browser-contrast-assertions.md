---
name: Browser contrast assertions
description: How to measure computed contrast reliably when modern Chromium preserves perceptual color spaces.
---

Browser contrast checks must accept modern computed-color formats such as `oklab(...)`, not only legacy `rgb(...)` or `rgba(...)`.

**Why:** Chromium can preserve Tailwind opacity colours in OKLab when returning computed styles. Treating those normalized channels as 0–255 RGB produces a plausible-looking but incorrect contrast ratio.

**How to apply:** Normalize the browser's computed foreground and background colours into one colour space before calculating relative luminance and WCAG contrast.