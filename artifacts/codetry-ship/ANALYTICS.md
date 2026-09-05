# Headwaters consulting funnel analytics

The Headwaters front door uses the optional Replit-hosted analytics tracker for
privacy-safe custom events. Pageviews remain automatic; the app does not load
an analytics script or send form contents to analytics.

## Events

| Description | Event name | Properties |
| --- | --- | --- |
| A visitor chooses a consulting path from the Headwaters page or changes the path in the quote conversation. | `consulting_offer_selected` | `offer`: `year 1 codetry engagement`, `year 2 codetry engagement`, or `needs custom review`; `location`: the UI placement such as `offers_grid` or `quote_form` |
| A visitor opens one of the three practical-work examples from the Headwaters page. | `homepage_practical_example_clicked` | `example`: `co-op`, `care-continuity`, or `small-business`; `destination`: the destination hostname or route |
| The quote intake API accepts a request successfully. | `quote_request_submitted` | `offer`: the submitted path; `mode`: `standard` or `custom` |

### OTF landing-to-quote funnel

| Description | Event name | Properties |
| --- | --- | --- |
| A visitor clicks an OTF landing-page quote CTA. | `quote_landing_cta_clicked` | `intent`, `source`, and `placement` (`hero` or `footer`) |
| The quote form opens. | `quote_started` | `intent`, `source`, `placement`, `step`, and `offer` |
| A visitor completes a quote step and continues. | `quote_step_completed` | `intent`, `source`, `placement`, `step`, and `offer` |
| A continue or submit attempt is blocked by validation. | `quote_validation_failed` | `intent`, `source`, `placement`, `step`, `offer`, and `error_count` |
| A visitor leaves before the request is accepted. | `quote_abandoned` | `intent`, `source`, `placement`, last reached `step`, and `offer` |
| The quote API request fails. | `quote_submit_failed` | `intent`, `source`, `placement`, `step`, `offer`, and controlled `failure_type` |
| The quote intake is accepted. | `quote_intake_completed` | `intent`, `source`, `placement`, `offer`, `organization_type`, and `result_mode` |
| A standard quote is generated. | `quote_generated` | `intent`, `source`, `placement`, `offer`, `organization_type`, and `result_mode` |
| A custom review is requested. | `formal_review_requested` | `intent`, `source`, `placement`, `offer`, `organization_type`, and `result_mode` |

These events intentionally exclude names, email addresses, organization names,
addresses, project descriptions, and every other free-form form value. The
shared tracking wrapper is optional and fail-safe: it no-ops when the injected
tracker is unavailable and catches tracker errors so the quote flow continues.
Campaign query values are mapped to controlled labels. Unknown values are
recorded as `other`, and missing values as `direct`; raw query-string values are
never sent to analytics.

## Landing page to quote completion funnel

After publishing, filter custom events to `intent = otf-sector-grant`, then
compare unique visitors in this order:

1. `quote_landing_cta_clicked`
2. `quote_started`
3. `quote_step_completed`, grouped by `step`
4. `quote_intake_completed`, grouped by `result_mode`

Use `quote_abandoned` grouped by `step` to identify the last page reached.
Review `quote_validation_failed` by `step` separately to distinguish form
friction from visitors who simply leave. Compare the same funnel by `source` and
CTA `placement` to see which campaign entry points produce accepted requests.

## Useful questions once data accumulates

- Which offer has the strongest path from `consulting_offer_selected` to
  `quote_request_submitted`?
- Do visitors who start from a specific Headwaters placement, such as
  `offers_grid` or `fit_cta`, submit at different rates?
- Are custom-review requests submitted at a different rate than standard quote
  requests?
- At which quote step do OTF prospects abandon most often, and does that match
  the step with the most validation failures?