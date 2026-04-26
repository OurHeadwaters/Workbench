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

The handbook is linked to an Expo project:

- **EAS project ID:** `ccfff076-0500-4aa5-be7d-2d71e7953ad2`
- **Owner / slug:** `@headwaters7/codetry-handbook`
- **Dashboard:** https://expo.dev/accounts/headwaters7/projects/codetry-handbook
- **iOS / Android bundle id:** `ca.codetry.handbook`

The project ID is committed in `app.config.js` (it's not a secret) and the
owner is set to `headwaters7`, so any machine with valid Expo credentials
will build against the same project.

`eas.json` has four profiles:

| Profile             | Use                                                               |
| ------------------- | ----------------------------------------------------------------- |
| `development`       | Dev client (local Expo Go-style); iOS simulator allowed.          |
| `preview`           | Internal distribution: APK on Android, ad-hoc / TestFlight on iOS.|
| `preview-simulator` | Same as `preview` but produces an iOS Simulator `.app`.           |
| `production`        | Store-ready: Android `.aab`, iOS App Store build.                 |

### Authenticating

You need either an interactive `eas login` or an `EXPO_TOKEN` env var (an
access token from
https://expo.dev/accounts/headwaters7/settings/access-tokens). The Replit
project sets `EXPO_TOKEN` as a secret so EAS commands run from this
workspace authenticate automatically.

### Running builds

```bash
# Internal preview builds (APK / .ipa):
pnpm --filter @workspace/codetry-handbook run build:preview:android
pnpm --filter @workspace/codetry-handbook run build:preview:ios

# iOS Simulator build (no Apple Developer account needed):
pnpm --filter @workspace/codetry-handbook exec eas build \
  --platform ios --profile preview-simulator --non-interactive

# Production store-ready builds:
pnpm --filter @workspace/codetry-handbook run build:android
pnpm --filter @workspace/codetry-handbook run build:ios
```

Add `--no-wait` to fire and forget — EAS prints a build URL and the build
runs on Expo's cloud regardless of whether the local CLI is still attached.

### iOS device builds need Apple Developer credentials

> **Status (2026-04-26):** BLOCKED on Apple Developer Program enrollment.
> No one on the project has paid Apple the ~$99/yr USD (~$129/yr CAD)
> enrollment fee yet, so steps 1–8 below have not been started. Until step 1
> is done, the only iOS build that can be produced from this workspace is
> the simulator build (`build:ios:simulator`). Once enrollment + the
> interactive `eas credentials` step (#5) are complete on a machine outside
> Replit, every later `pnpm --filter @workspace/codetry-handbook run
> build:ios:preview` will run non-interactively from anywhere — including
> this workspace, since `EXPO_TOKEN` is already set.

The `preview` and `production` iOS profiles produce an `.ipa` for a real
device (ad-hoc internal distribution or App Store / TestFlight). Apple
requires a paid Apple Developer Program account (~$99/year USD; ~$129/year
CAD) and the first build needs a one-time interactive setup so EAS can
register devices, generate a distribution certificate, and create a
provisioning profile.

This setup **cannot** be done from this Replit workspace because Apple
requires interactive sign-in with a 2FA code that gets pushed to a trusted
Apple device. The steps below need to be run from a machine (Mac strongly
preferred, but Linux/Windows works too — the EAS CLI handles the cert
generation in the cloud) signed into the Apple ID that will own the app.

#### One-time runbook (do this once per Apple Developer account)

1. **Enroll in the Apple Developer Program** at
   https://developer.apple.com/programs/enroll/. Use the Apple ID that
   will own the handbook on the App Store. For an organization (vs.
   individual), Apple needs a D-U-N-S number — request one for free at
   https://developer.apple.com/enroll/duns-lookup/. Approval is usually
   1–2 business days.

2. **Register the bundle id in the Apple Developer portal, then create
   the App Store Connect app record.** Apple splits this in two:

   a. Go to https://developer.apple.com/account/resources/identifiers/list
      → *+* → *App IDs* → *App* → *Continue*. Description: "Codetry
      Practitioner's Handbook". Bundle ID: *Explicit* →
      `ca.codetry.handbook`. Leave all capabilities at their defaults
      and click *Register*. (You can also let `eas credentials` create
      this for you in step 5, but doing it by hand first avoids one
      round-trip during the interactive flow.)

   b. Then go to https://appstoreconnect.apple.com → *Apps* → *+* →
      *New App*. Pick *iOS*, name it "Codetry Handbook" (or whatever
      you'd like the public title to be), primary language English,
      **bundle ID dropdown → select `ca.codetry.handbook`** (the entry
      you just registered in step 2a), and SKU to anything memorable
      (e.g. `codetry-handbook-1`). Don't fill in the rest yet — you
      only need the app record to exist so TestFlight will accept the
      build.

3. **Install the EAS CLI on your machine** (skip if you already have a
   recent one):
   ```bash
   npm install -g eas-cli
   ```

4. **Pull this repo down** (or just `cd` into the existing checkout) and
   from the repo root run:
   ```bash
   pnpm install
   pnpm --filter @workspace/codetry-handbook exec eas login
   # log in as the Expo user that owns @headwaters7 — or run `eas whoami`
   # first to confirm you're already signed in.
   ```

5. **Set up iOS credentials interactively.** From the repo root:
   ```bash
   pnpm --filter @workspace/codetry-handbook exec eas credentials
   ```
   Pick the prompts in this order:
   - Platform → **iOS**
   - Profile → **preview** (do this again later for **production** when
     you're ready for the App Store)
   - "What do you want to do?" → **Build credentials: Set up a new
     build profile**
   - When asked, let EAS **generate a new distribution certificate** and
     **a new provisioning profile**.
   - When asked for Apple credentials, sign in with the Apple ID you
     enrolled in step 1 and paste the 2FA code from your Apple device.
     EAS uploads the cert + profile to its servers and ties them to this
     project — you only have to do this once.

6. **Register the test device's UDID** so the ad-hoc `.ipa` will install
   on it (skip if you'll only use TestFlight):
   ```bash
   pnpm --filter @workspace/codetry-handbook exec eas device:create
   ```
   Open the printed URL on the iPhone in Safari and follow the profile
   install prompt; the UDID will appear in EAS within a minute.

7. **Run the first iOS device build:**
   ```bash
   pnpm --filter @workspace/codetry-handbook run build:ios:preview
   ```
   Builds run on Expo's cloud and take ~15–25 minutes. Watch the live log
   at the URL EAS prints (also under the
   [project's builds dashboard](https://expo.dev/accounts/headwaters7/projects/codetry-handbook/builds)).
   When it finishes, EAS gives you a `.ipa` download link **and** an
   install link for the registered device.

8. **(Optional) Push the build to TestFlight.** Once the `.ipa` exists:
   ```bash
   pnpm --filter @workspace/codetry-handbook exec eas submit \
     --platform ios --latest
   ```
   Sign in to App Store Connect when prompted; the build will appear in
   *TestFlight* → *iOS* under "Processing" within ~10 minutes, then
   becomes installable via the TestFlight app once Apple finishes the
   automated scan.

After this one-time setup, every later `build:ios:preview` run works
non-interactively from any machine (including this Replit workspace, since
`EXPO_TOKEN` is already set as a secret) — the cert and provisioning
profile live on Expo's servers.

Until step 5 is done from outside this workspace, use the
`preview-simulator` profile (see "Running builds" above) to verify the
iOS bundle still compiles and runs against Xcode's iOS Simulator.

#### On-device acceptance checks for the first iOS build

Once the `.ipa` is on a real iPhone (via TestFlight invite or the EAS
ad-hoc install link), confirm:

- [ ] The saltbox icon appears on the home screen (cream background,
      dark green roof) — not the default Expo placeholder.
- [ ] Launching shows the cream `#f4ede0` splash with the saltbox, then
      lands on the table of contents.
- [ ] Tapping a chapter opens it and the back gesture returns to the TOC.
- [ ] Bookmarking a chapter, force-quitting the app, and reopening shows
      the bookmark still set.
- [ ] Changing the font size in the reader settings persists across a
      relaunch.
- [ ] Putting the iPhone in airplane mode and reopening every chapter
      still works (no spinner, no error). All content is bundled —
      nothing should hit the network at runtime.

### First builds (already on EAS)

The first preview builds were produced on 2026-04-26 from the
`headwaters7` Expo account:

| Platform                  | Build ID                                | Artifact                                                          |
| ------------------------- | --------------------------------------- | ----------------------------------------------------------------- |
| Android preview (`.apk`)  | `24ccd766-9dfa-4154-8a8e-47a069de3a1c`  | https://expo.dev/artifacts/eas/5xyPVwDbD19cLyCR4BPJNy.apk         |
| iOS Simulator (`.tar.gz`) | `576a1264-0a07-49e4-a217-fd9af5a3363d`  | https://expo.dev/artifacts/eas/bN51CKcvSw2Vb9XWPKrt36.tar.gz      |
| iOS device (`.ipa`)       | _pending_ — blocked on Apple Developer enrollment (see status note above) | _pending_                                                         |

Both Android and Simulator builds also live under the project's
[builds dashboard](https://expo.dev/accounts/headwaters7/projects/codetry-handbook/builds).
EAS artifact URLs expire ~14 days after the build, after which the
builds are still listed but you'd re-download from the dashboard or
re-run them.

The iOS device (`.ipa`) preview build has **not** been produced yet
because it requires the one-time Apple Developer credentials setup
described above (which itself is blocked on the paid Apple Developer
Program enrollment — see the status callout in the "iOS device builds
need Apple Developer credentials" section). The simulator build above
proves the iOS bundle compiles and runs against Xcode's iOS Simulator
end-to-end.

When the iOS device build does land, update this table with the build
ID and the EAS artifact URL printed at the end of `build:ios:preview`,
and remove the status callout above.

### First-build gotchas we hit and fixed

- `eas.json` cannot use `""` as an env value — use omission or a real
  string. We removed the empty `EXPO_PUBLIC_BASE_URL` from the `base` profile.
- With `appVersionSource: "remote"`, EAS owns `versionCode` / `buildNumber`
  remotely and warns about the local fields in `app.config.js`. They've been
  removed.
- iOS builds prompt for `ITSAppUsesNonExemptEncryption` in App Store
  Connect; we now declare `ios.infoPlist.ITSAppUsesNonExemptEncryption =
  false` so App Store Connect won't block submission.
- The `preview` profile names the channel `preview`, but the `expo-updates`
  package isn't installed yet, so EAS prints a warning. Channel routing only
  matters once OTA updates ship — see "Follow-ups" below.

### Verifying the build on-device

Once a build finishes:

- **Android:** EAS hosts a signed `.apk` at the build URL. Download it on
  the test phone, allow installs from the browser, tap to install. Confirm:
  the saltbox icon appears, the reader opens to the table of contents,
  bookmarking a chapter survives a hard close, font-size changes persist,
  and turning the device to airplane mode still lets every chapter open.
- **iOS:** internal builds install via TestFlight invite or
  ad-hoc / UDID-registered device through the EAS install link. Same
  on-device checks as Android.

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
