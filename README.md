# Flenta Mobile

React Native + Expo Router client for Flenta_Backend. The integration follows
Flenta_Desktop/dev: feature API modules, a shared HTTP client, AuthProvider,
KycProvider, and a storage adapter. Backend owns authentication, profiles,
banking rules, money movement, and KYC decisions. Mobile does not connect to
Supabase or the database directly.

## Setup

Use Node.js 24 LTS (Node's TypeScript support runs the tests) and npm.

```sh
npm ci
```

Copy `.env.example` to `.env.local` and set `EXPO_PUBLIC_API_BASE_URL`:

| Device | Development backend address |
| --- | --- |
| Android emulator | `http://10.0.2.2:5080` |
| iOS simulator | `http://127.0.0.1:5080` |
| Physical phone | A reachable HTTPS backend, or the PC's LAN IP during development |
| Web preview | `http://127.0.0.1:5080` |

The value is the backend **origin**, without a path, credentials or query string.
`EXPO_PUBLIC_*` variables are included in the application bundle: never put
Supabase secret/service-role keys, Didit keys or database credentials there.
Restart Expo after changing the environment. Production builds require HTTPS.
On a physical phone, localhost points at the phone, not the development PC.

```sh
npm start
npm run android
npm run ios
npm run web
```

For LAN development the backend must listen on an accessible interface and its
`AllowedHosts` must include the PC's host/IP. Use trusted HTTPS when the installed
app does not permit development HTTP. Do not disable TLS validation. For web
preview add its actual origin (usually `http://localhost:8081`) to Backend's
`Cors:AllowedOrigins`. Native requests do not need browser CORS.

## Backend and email links

Use the corresponding `Maris/mobile-backend-integration` backend branch. Existing
Desktop calls omit `client` and retain their current behavior. Mobile registration
and password recovery send `client: "mobile"` and use the same backend PKCE
exchange endpoint. Configure the backend environment:

```text
Supabase__MobileFrontendUrl=flenta-mobile://app
```

In the existing Supabase project's Auth redirect allowlist add exactly:

```text
flenta-mobile://app/auth/confirm-email
flenta-mobile://app/auth/reset-password
```

Keep the existing Desktop redirect URLs and `Supabase__FrontendUrl`. The mobile
callback is opt-in; the backend returns `auth.mobile_not_configured` until it is
enabled. Registration and recovery must begin in this app and the email link must
be opened on the same installation within one hour, because it holds the PKCE
verifier. A newer registration/recovery replaces the previous pending verifier.

The `flenta-mobile` scheme is registered in `app.json`. Test email callbacks in an
installed development or standalone build; Expo Go does not own this custom
scheme. Build/install with the team's existing native build setup, then test:

1. Register, open the email on the same phone and complete onboarding.
2. Request password recovery, open its link and set a new password.
3. Restart the app and confirm the session is restored.
4. Complete Didit in the system browser and return; the app fetches backend status.
5. Exercise accounts, sandbox cards, top-ups, transfers, exchange, savings and profile.

The existing Backend configuration for Supabase, PostgreSQL and Didit is still
required. This change does not migrate a database or modify a hosted project.

## Structure and lifecycle

```text
src/app/                         Expo Router routes and protected tabs
src/config/api.ts                Backend origin and HTTP composition
src/features/auth/               Auth API, PKCE, session service and provider
src/features/{banking,finance}/   Typed API adapters and native screens
src/features/{profile,kyc}/      Profile and backend-authoritative verification
src/storage/                     Async storage adapter and keys
```

On Android/iOS only the refresh token and temporary PKCE verifier are persisted
in Expo SecureStore. The access token and profile stay in memory. Web preview
uses sessionStorage for the current tab. Startup restore, concurrent 401 refresh,
account switching and logout are guarded against late responses. A transient
network failure preserves the refresh token for retry. Native storage errors are
shown; do not assume logout was persisted until the warning is resolved.

Money operations retain their idempotency key on an ambiguous failure and merge
concurrent identical submissions. Retry on the same screen with unchanged inputs.
Pending keys are kept in memory; after leaving/restarting, check history before
submitting again. Closed/successful/rejected operations release their keys. A fresh
quote requires another user confirmation. Card requisites require password
confirmation and are hidden after 30 seconds, on blur or background.

## Verification

```sh
npm test
npm run typecheck
npm run lint
npx expo export --platform all
```

Export requires a valid production HTTPS `EXPO_PUBLIC_API_BASE_URL`. Tests cover
HTTP errors/headers, mobile callback selection, one-time link parsing, money input,
idempotency and session races using injected APIs and storage. The all-platform
export checks Android/iOS Hermes and web bundles; it is not an APK/IPA build or a
device test. Real email delivery, native SecureStore and the Didit camera flow
need the installed-app checklist above against a configured backend.

References: [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/),
[Expo deep-link rewriting](https://docs.expo.dev/router/advanced/native-intent/),
[Supabase mobile redirects](https://supabase.com/docs/guides/auth/native-mobile-deep-linking).
