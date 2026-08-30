# Headwaters consulting funnel analytics

The Headwaters front door uses the optional Replit-hosted analytics tracker for
three privacy-safe custom events. Pageviews remain automatic; the app does not
load an analytics script or send form contents to analytics.

## Events

| Description | Event name | Properties |
| --- | --- | --- |
| A visitor chooses a consulting path from the Headwaters page or changes the path in the quote conversation. | `consulting_offer_selected` | `offer`: `initial implementation`, `additional standard tool`, or `needs custom review`; `location`: the UI placement such as `offers_grid` or `quote_form` |
| A visitor opens one of the three practical-work examples from the Headwaters page. | `homepage_practical_example_clicked` | `example`: `co-op`, `care-continuity`, or `small-business`; `destination`: the destination hostname or route |
| The quote intake API accepts a request successfully. | `quote_request_submitted` | `offer`: the submitted path; `mode`: `standard` or `custom` |

These events intentionally exclude names, email addresses, organization names,
addresses, project descriptions, and every other free-form form value. The
shared tracking wrapper is optional and fail-safe: it no-ops when the injected
tracker is unavailable and catches tracker errors so the quote flow continues.

## Useful questions once data accumulates

- Which offer has the strongest path from `consulting_offer_selected` to
  `quote_request_submitted`?
- Do visitors who start from a specific Headwaters placement, such as
  `offers_grid` or `fit_cta`, submit at different rates?
- Are custom-review requests submitted at a different rate than standard quote
  requests?