# Codetry Practitioner's Handbook

The handbook ships as an Expo project that can be opened three ways:

1. **As a web Progressive Web App (PWA)** — installable to the home screen on
   iOS Safari, Android Chrome, and desktop. Once it has loaded once, the
   service worker keeps the entire bundle on-device, so the book opens with
   no network connection at all.
2. **Through Expo Go** — useful for quick previews on a phone before the
   native binary is shipped. The `/install` route on the deployed site shows a
   QR code that hands off to Expo Go.
3. **As a native iOS / Android binary built with EAS** — for shipping to
   the App Store, Play Store, or as a sideloaded `.apk`.

All three surfaces read the same bundled data (no network calls at runtime),
share the `Codetry::handbook` colour palette, and persist reader state under
the `codetry-handbook:v1` AsyncStorage namespace. On the web that namespace
maps to `localStorage`, so bookmarks and font settings survive across
browser sessions.

## Local development

```bash
pnpm install
pnpm --filter @workspace/codetry-handbook run dev
```

This boots the Expo dev server. The Replit preview pane shows the running app
through the Expo dev domain.

## Building the deployable bundle

```bash
pnpm --filter @workspace/codetry-handbook run build
```

This produces three things under `static-build/`:

- `static-build/web/` — the static web export with `manifest.webmanifest`,
  `sw.js`, and the patched `index.html` that registers the service worker.
- `static-build/<timestamp>/_expo/static/js/{ios,android}/` — the Expo Go
  bundle for native preview.
- `static-build/{ios,android}/manifest.json` — the per-platform Expo Go
  manifest.

Then serve everything from a single port:

```bash
pnpm --filter @workspace/codetry-handbook run serve
```

`serve.js` routes browser traffic to the PWA, traffic with the
`expo-platform` header to the right manifest, and the `/install` path to the
QR/install page for Expo Go.

## Installing as a PWA

After deploying, share the artifact URL (e.g.
`https://<your-deploy>.replit.app/codetry-handbook/`) with practitioners.

- **iOS Safari**: tap the share button → *Add to Home Screen*.
- **Android Chrome**: tap the menu (⋮) → *Install app* (or *Add to Home
  Screen*).
- **Desktop Chrome / Edge**: click the install icon in the address bar.

Once installed, the handbook launches in standalone mode (no browser chrome),
opens in portrait, uses the cream background `#f4ede0`, and the saltbox
icon. The first launch caches every JS, font, and asset; later launches work
offline.

## Shipping a native binary with EAS

The repo includes `eas.json` with three profiles (`development`, `preview`,
`production`). To build native binaries:

```bash
# One-time setup, on a machine with the Expo account credentials:
pnpm exec eas login
pnpm exec eas init                    # links the app to an EAS project ID
pnpm exec eas credentials             # configure code-signing, keystore, etc.

# Internal preview builds (APK / TestFlight):
pnpm --filter @workspace/codetry-handbook run build:preview:android
pnpm --filter @workspace/codetry-handbook run build:preview:ios

# Production store-ready builds:
pnpm --filter @workspace/codetry-handbook run build:android
pnpm --filter @workspace/codetry-handbook run build:ios
```

Set `EAS_PROJECT_ID` in the environment (or paste it under
`expo.extra.eas.projectId` after running `eas init`) so the EAS CLI can find
the project. Bundle identifiers default to `ca.codetry.handbook` for both
iOS and Android — change them in `app.config.js` before the first
production build if you need a different reverse-DNS owner.

The native build inherits the same Expo project, the same constants, the
same fonts, and the same `codetry-handbook:v1` AsyncStorage namespace as the
web PWA, so practitioners can move between web and native without losing
their bookmarks (within a given device).

## Updating the PWA after a deploy

Browsers automatically check `sw.js` on every navigation. The service worker
is generated with the build timestamp baked into its cache name
(`codetry-handbook-<timestamp>`), so a redeploy always invalidates the old
cache and pulls down the new bundle on the next visit. There is nothing
extra to wire up.
