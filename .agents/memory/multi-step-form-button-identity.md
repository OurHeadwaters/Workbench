---
name: Multi-step form button identity
description: Prevents a step-advance click from becoming an unintended form submission when React reuses a button node.
---

In multi-step forms, give the advance button and final submit button distinct React keys when they occupy the same conditional position.

**Why:** React can reuse the same DOM node and change its `type` from `button` to `submit` during the advance click. The browser's default action may then submit the form with that same click, causing premature or duplicate delivery.

**How to apply:** Whenever a conditional swaps a non-submit action for a submit action inside one form, use distinct keys or separate stable DOM positions, and cover the transition with a browser test.