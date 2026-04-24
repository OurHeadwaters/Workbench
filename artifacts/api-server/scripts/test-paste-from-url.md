# Paste-from-URL verification (Task #7)

This documents the end-to-end verification of `POST /api/library/entries/from-url`,
which uses Microlink for metadata + screenshot extraction and falls back to a
direct fetch + cheerio parse when Microlink fails.

The script `./test-paste-from-url.sh` reproduces the run.

## Result classes

The script reports three outcomes per URL, because "URL came back without good
metadata" is documented graceful-fallback behavior, not a server-side bug:

- **PASS** — entry was created, `sourceUrl` matches the input, the title is
  not the raw URL, and the summary is non-empty.
- **WARN** — entry was created and `sourceUrl` was persisted, but extraction
  degraded (title is the URL or the summary is empty). This is the expected
  behavior when Microlink fails and the source site can't be fetched
  directly either, or returns a SPA shell with no useful OG tags.
- **FAIL** — the request did not persist a valid entry (no id or wrong
  `sourceUrl`). This would be a real bug.

The script exits non-zero only on FAIL.

## URLs exercised

| Category | URL | Typical Result |
| --- | --- | --- |
| media   | `https://en.wikipedia.org/wiki/Food_security`              | PASS — Microlink success: title, summary, screenshot |
| media   | `https://www.cbc.ca/news/canada/north`                      | PASS / WARN — Microlink screenshot always present, OG metadata sometimes thin (depends on CBC's cache) |
| pdf     | `https://www.w3.org/WAI/ER/tests/.../dummy.pdf`             | PASS — Microlink success: title, summary, screenshot of the PDF |
| producer | `https://www.saputo.com/en`                                 | PASS — Microlink failed silently → cheerio fallback fired and pulled `og:title` + `meta description`; no screenshot |

Latest script run (`3 passed, 1 warned, 0 failed`):

```
=== [media]    https://en.wikipedia.org/wiki/Food_security
  sourceUrl:  https://en.wikipedia.org/wiki/Food_security
  title:      Food security - Wikipedia
  summary:    Food security is the state of having reliable access to a sufficient quantity of affordable, healthy food. The availabil
  screenshot: https://iad.microlink.io/...
  PASS

=== [media]    https://www.cbc.ca/news/canada/north
  sourceUrl:  https://www.cbc.ca/news/canada/north
  title:      north
  summary:
  screenshot: https://iad.microlink.io/...
  WARN — entry created but metadata extraction degraded (graceful fallback)

=== [producer] https://www.saputo.com/en
  sourceUrl:  https://www.saputo.com/en
  title:      Saputo | Dairy Products and Cheese
  summary:    Learn more about Saputo and our commitment to high quality dairy products worldwide.
  screenshot:
  PASS  (cheerio fallback)

=== [pdf]      https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf
  sourceUrl:  https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf
  title:      dummy.pdf
  summary:    Dummy PDF file
  screenshot: https://iad.microlink.io/...
  PASS
```

A previous run had Saputo as the WARN row and CBC as a clean PASS — both
outcomes are valid for the same URLs because Microlink's extraction quality
varies between calls. The acceptance criterion ("Microlink failures
gracefully fall back to cheerio without erroring") holds either way: every
URL produced an HTTP 200 with `sourceUrl` persisted.

## Graceful-fallback evidence

Two Northern-Ontario producer sites that are unreachable from Replit egress
were also tried during initial verification (`lockcitydairies.ca`,
`gaylea.com`). Both returned HTTP 200 with the URL kept as the title and
no screenshot, with warnings logged but no error surfaced to the client.
The warnings are visible in the API server log:

```
WARN  Microlink fetch failed; falling back to direct fetch
       err.type: DOMException  message: The operation was aborted due to timeout
WARN  Direct fetch failed; using URL as title
       err: ConnectTimeoutError  attempted address: www.lockcitydairies.ca:443
```

The two follow-ups proposed alongside this task target the residual rough
edges this exposed:

1. Persist the screenshot to our object storage so cards don't break when
   Microlink rotates URLs or source sites take images down.
2. Surface a "metadata incomplete" signal from the API so curators know
   when an auto-extracted entry needs a hand-written title/description.

## Display verification

After insertion, the resulting entries were inspected in the library web
artifact:

- `/library/entries` rendered all entries as cards with title, summary
  excerpt, and screenshot where available.
- `/library/entries/:id` rendered the Wikipedia entry with the Microlink
  screenshot, full summary, "Visit Source" link, and metadata sidebar.
- `/library/entries/new` "Paste Link" tab rendered the URL form.

## Reproduction

```bash
# Against the live dev domain:
./artifacts/api-server/scripts/test-paste-from-url.sh

# Against a different host:
API_BASE=http://localhost:8080/api/library \
  ./artifacts/api-server/scripts/test-paste-from-url.sh

# Keep the created entries (default is to delete them after the run):
KEEP=1 ./artifacts/api-server/scripts/test-paste-from-url.sh
```
