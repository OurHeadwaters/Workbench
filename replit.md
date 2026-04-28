# Overview

This project is a pnpm workspace monorepo using TypeScript, designed to support various applications related to the "Northern Food Systems Research Library" and operational planning for a product company. Its core purpose is to provide tools and platforms for research, knowledge sharing, and strategic planning, emphasizing decentralization, permaculture principles, and operational flexibility for Indigenous communities in Canada.

Key capabilities include:
- A React + Vite "Northern Food Systems Research Library" with drag-and-drop, URL ingestion, SHA-256 deduplication, tokenized share-links, and a needs-review queue.
- An Express 5 API for library data management and secure storage.
- A hybrid app and slide deck for practitioner operating plans, structured around a deal-flow approach (Idea → Pitch → Contract → Fulfillment → Impact) with detailed weekly steps and cost review mechanisms.
- An Expo (React Native + web) reader for the "Codetry Practitioner's Handbook," installable as a PWA, Expo Go app, or native binary, ensuring offline access.

The project aims to empower communities through accessible knowledge and self-sufficient operational models, shifting from traditional agency-based services to a product-centric approach that prioritizes local control and value delivery.

# User Preferences

I prefer iterative development with clear validation steps. If a typecheck fails on a critical package, it should block task completion. I need to be able to regenerate API hooks and Zod schemas on demand. Database schema changes should be easy to push in development. I want to ensure that specific hardcoded values for corridor keys are not accidentally reintroduced into the Deer Lake store plan. I also require a mechanism to automatically update a bundled snapshot of the constellation manifest in the Codetry Handbook whenever the canonical source changes, and for typecheck/build processes to fail if these diverge, showing an actionable diff.

# System Architecture

The project is structured as a pnpm workspace monorepo utilizing Node.js 24 and TypeScript 5.9.

**Monorepo Tools & Build:**
- **Monorepo tool**: pnpm workspaces
- **Package manager**: pnpm
- **Build**: esbuild (CJS bundle)
- **Typechecking**: `pnpm run typecheck:gated` for critical paths, with `pnpm run typecheck` for the full workspace.

**API & Data Layer:**
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)

**UI/UX & Feature Specifications:**

- **Northern Food Systems Research Library (`artifacts/library`)**: React + Vite application featuring SHA-256 file deduplication, URL paste ingestion, tokenized contributor share-links, a needs-review queue, search/filter, and public upload portal.
- **Practitioner Operating Plan (`artifacts/practitioner-operating-plan`)**: Hybrid app + slides deck, focused on a product company model. It implements a core deal-flow (Idea → Pitch → Contract → Fulfillment → Impact), includes integrated cost review, and stores user state in `localStorage`. Features a `/codetry` page defining a "metaphor-as-architecture" practice and a `constellation.json` manifest for permaculture zones.
- **Codetry Practitioner's Handbook (`artifacts/codetry-handbook`)**: Expo (React Native + web) reader. Installable as a PWA, Expo Go app, or native binaries with offline access. Uses `AsyncStorage` for persistent state and includes a save-status pill. Part III is built from an auto-generated, bundled snapshot of the constellation manifest.
- **Deer Lake Store Plan (`artifacts/deer-lake-store-plan`)**: Slides deck for operational plan, including financial models. It sources values from `@workspace/cross-reserve-corridor` and includes a guard script to prevent hardcoded corridor keys.
- **Deer Lake Walkthrough (`artifacts/deer-lake-walkthrough`)**: React + Vite application hosting a walkthrough (`/`) and a mobile-first Phase Planner (`/planner`). The walkthrough features a continuous-scroll design with sticky header and in-page jumps. The Phase Planner is a decision tool with "grants" and "self-fund" modes, persisting state in `localStorage` and using UTC date math. It uses a tiny client-side router.
- **`artifacts/api-server`**: Express 5 API mounting `/api/library` (CRUD, stats) and `/api/storage` (presigned uploads, public-objects with local filesystem fallback).
- **Wordpile (`artifacts/wordpile`)**: React + Vite + Tailwind web tool for community word inventories. Supports free-entry, paste-to-extract, "Check my draft" view, and import/export of word piles. Implements optional cloud sync via Clerk + Postgres with a sync queue and status pill. Supports share-links (client-side fragment-only or server-stored short links).

**Database Schema (`lib/db/src/schema/library.ts`):**
Includes tables for `subjects`, `project_buckets`, `producers`, `contributors`, `library_entries` (with unique partial index on `content_hash`), `entry_subjects`, `entry_buckets`, and `share_links`.

**Seeding:**
`pnpm --filter @workspace/scripts exec tsx ./src/seedLibrary.ts` provides an idempotent seed for development.

# External Dependencies

- **Microlink**: For URL metadata and screenshot generation in the library.
- **Cheerio**: Fallback for URL metadata parsing in the library.
- **Expo**: For cross-platform application development of the Codetry Practitioner's Handbook.
- **PostgreSQL**: Primary database.
- **Drizzle ORM**: For database interactions.
- **Express 5**: For the API server.
- **Zod**: For schema declaration and validation.
- **Orval**: For API client code generation.
- **Clerk**: For user authentication and cloud synchronization in Wordpile.