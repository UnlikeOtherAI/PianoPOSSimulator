# Piano POS Simulator Plan

## Purpose

Build a Node.js API simulator that mimics the Piano integration API defined in `Docs/piano.api.json`. The simulator supports local development and CI-driven end-to-end tests by returning deterministic, schema-accurate responses. A GitHub Action triggers data seeding and scenario setup via a non-specified endpoint at `/sim/trigger`.

## Goals

- Provide a predictable simulator for the OpenAPI-defined endpoints.
- Support GitHub Action-driven scenarios via `/sim/trigger`.
- Store simulated state in PostgreSQL for repeatable data and realistic flows.
- Keep responses aligned with the OpenAPI schemas.

## Non-Goals

- Production-grade auth/security (use test-only controls).
- Full parity with real Piano business logic.
- Public documentation or OpenAPI listing for `/sim/trigger`.

## Inputs

- OpenAPI source of truth: `Docs/piano.api.json`.
- Model reference: `Docs/model-structure.md`.
- Simulator endpoint: `/sim/trigger` (not in OpenAPI).
- Runtime: Node.js API, package manager `pnpm`, database PostgreSQL (`psql`).

## High-Level Design

- HTTP server exposes all OpenAPI paths with stubbed or stateful responses.
- PostgreSQL stores establishments, credentials, tokens, and imported data.
- Scenario loader seeds database and controls response behavior for tests.
- `/sim/trigger` accepts a scenario payload and seeds data accordingly.

## Endpoint Coverage Plan

- Implement all paths in `Docs/piano.api.json` with schema-accurate responses.
- Prioritize the following endpoints for stateful behavior:
  - `POST /api/v1/auth/pair` (creates establishments + credentials)
  - `POST /api/v1/auth/login` (issues tokens for credentials)
  - `GET /api/v1/auth/whoami` (returns linked establishment/user)
  - `PUT /api/v1/orders` (stores orders, returns 202)
  - `PUT /api/v1/documents` (stores documents, returns 202)
  - `PUT /api/v1/inventory/state` (stores inventory, returns 202)
- Remaining endpoints can return static, schema-valid fixtures.

## `/sim/trigger` (CI-only)

- Not included in OpenAPI or public docs.
- Called by GitHub Actions to reset and seed the simulator.
- Request body fields:
  - `scenario`: string (e.g., `happy-path`, `invalid-token`, `empty-establishment`)
  - `seed`: optional integer for deterministic data
  - `options`: optional overrides (counts, dates, error modes)
- Behavior:
  - Truncate simulator tables (non-destructive to schema).
  - Seed establishments, credentials, and sample data based on scenario.
  - Return a summary payload (counts, credentials, tokens).

## Data Model (Initial)

- establishments: id, source_id, name, metadata
- credentials: establishment_id, client_id, client_secret
- tokens: token, establishment_id, expires_at
- orders/documents/inventory: raw payloads + created_at

## Auth Simulation

- Pairing creates credentials and always succeeds.
- Login always succeeds and returns a fixed access token.
- OAuth token endpoints always succeed and return fixed access/refresh tokens.
- `Authorization: Bearer` token will be required later for data endpoints.
- `whoami` returns a fixed account context.

## Scenario Design

- `happy-path`: valid pairing, login, and data ingestion flows.
- `invalid-token`: seeded invalid/expired tokens for negative tests.
- `empty-establishment`: no existing establishments, pairing required.
- Allow override fields to tailor dates, counts, or failure modes.

## Implementation Steps

1. Scaffold Node.js API with `pnpm`, Express (or equivalent).
2. Define database schema and migrations (PostgreSQL).
3. Implement `/sim/trigger` for scenario seeding.
4. Implement auth endpoints (pair, login, whoami).
5. Implement import endpoints (orders, documents, inventory).
6. Add static fixtures for remaining endpoints.
7. Add request validation against OpenAPI schemas.
8. Add CI workflow usage notes and example payloads.

## Testing

- Unit tests for scenario seeding and auth flows.
- Contract tests ensuring response schemas match OpenAPI.
- CI test that calls `/sim/trigger` and runs a basic flow.

## Open Questions

- Which scenarios are needed in the first GitHub Action?
- Expected token lifetime and refresh behavior?
- Any endpoint-specific edge cases to model beyond schema validation?
