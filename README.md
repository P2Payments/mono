# p2pay/mono

Monorepo pnpm workspace for the **P2Pay** open-source multi-rail payment software.

Each workspace package is a self-contained Nuxt 4 module. The root app (`apps/mono`) assembles rails, flows, and shared packages by listing them in `nuxt.config.js`, with minimal glue code.

## Workspace layout

```text
mono/
├── apps/          standalone Nuxt applications
├── packages/      core shared modules
├── rails/         payment rail modules
├── flows/         business flow modules
└── utils/         shared utilities
```

## Workspace overview

- `apps/mono` — standalone Nuxt app that uses the mono packages, rails, and flows
- `packages/mono` — core Nuxt module for shared app logic
- `rails/template` — reference rail module used to scaffold new rails
- `rails/peach` — Peach rail module
- `rails/robosats` — RoboSats rail module
- `flows/booking` — booking flow module with standard and embedded views

## Quick start

```bash
pnpm install
cd apps/mono
pnpm dev
```

## Apps

| App | Description |
|-----|-------------|
| `apps/mono` | Root Nuxt 4 app that assembles packages, rails, and flows |

## Packages

| Package | Route | Description |
|---------|-------|-------------|
| `@p2payto/mono` (`packages/mono`) | `/mono` | Core module, injects base page and `/api/mono` endpoint |

## Rails

Rails are pluggable payment-rail modules. Each one can inject pages, composables, and server handlers into the host Nuxt app.

| Package | Page | API | Description |
|---------|------|-----|-------------|
| `@p2payto/template` (`rails/template`) | `/rails/template` | `/api/rails/template` | Reference rail used to scaffold new integrations |
| `@p2payto/peach` (`rails/peach`) | `/rails/peach` | `/api/rails/peach` | [Peach](https://peachbitcoin.com) P2P Bitcoin rail |
| `@p2payto/robosats` (`rails/robosats`) | `/rails/robosats` | `/api/rails/robosats/*` | [RoboSats](https://robosats.com) P2P Bitcoin rail with client-side identity generation and server-side Tor proxying |

## Flows

Flows are higher-level business logic modules. They can include pages, components, composables, and server handlers.

| Package | Page | Description |
|---------|------|-------------|
| `@p2payto/booking` (`flows/booking`) | `/flows/booking`, `/flows/booking/embed` | Booking and scheduling UI with calendar, time slots, extras, and embeddable iframe variant |

## Module anatomy

Every rail and flow follows the same pattern:

```text
<type>/<name>/
├── package.json        name: @p2payto/<name>
├── module.js           defineNuxtModule — wires pages, handlers, composables
└── runtime/
    ├── pages/          injected via pages:extend hook
    ├── components/     injected via addComponentsDir (flows only)
    ├── composables/    injected via addImportsDir
    └── handlers/       registered via addServerHandler (rails + some flows)
```

The host app needs only two changes to add a module:

1. In `package.json`, add `"@p2payto/<name>": "workspace:*"` to `dependencies`
2. In `nuxt.config.js`, add `'@p2payto/<name>'` to the `modules` array

## Environment variables

| Variable | Default | Used by |
|----------|---------|---------|
| `NUXT_TOR_SOCKS_URL` | `socks5h://127.0.0.1:9050` | `@p2payto/robosats` |
| `NUXT_ROBOSATS_COORDINATOR_URL` | RoboSats onion address | `@p2payto/robosats` |
| `NUXT_PEACH_BASE_URL` | `https://api.peachbitcoin.com` | `@p2payto/peach` |
| `NUXT_PEACH_BITCOIN_MNEMONIC` | _(required)_ | `@p2payto/peach` |
| `NUXT_PEACH_PGP_PRIVATE_KEY` | _(required)_ | `@p2payto/peach` |
| `NUXT_PEACH_PGP_PUBLIC_KEY` | _(required)_ | `@p2payto/peach` |
| `NUXT_PEACH_PGP_PASSPHRASE` | _(required)_ | `@p2payto/peach` |
| `NUXT_PEACH_PAYMENT_DETAILS` | `{}` | `@p2payto/peach` |
| `NUXT_PEACH_REFERRAL_CODE` | _(empty)_ | `@p2payto/peach` |
| `NUXT_PEACH_FEE_RATE` | `hourFee` | `@p2payto/peach` |
| `NUXT_PEACH_MAX_PREMIUM` | `0` | `@p2payto/peach` |

## License

MIT — [p2pay.to](https://p2pay.to)
