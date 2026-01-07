# Piano POS Simulator Plan

## Purpose

Build a Node.js POS purchase simulator that sends realistic payloads to downstream backends for processing. The simulator still mirrors the Piano integration API defined in `Docs/piano/piano.api.json` for compatibility, but Piano is now treated as a reference payload spec rather than the core system.

## Goals

- Provide a predictable POS purchase simulator that can push payloads to external backends.
- Support GitHub Action-driven scenarios via `/sim/trigger`.
- Keep payloads aligned with the Piano OpenAPI schemas (reference spec).

## Non-Goals

- Production-grade auth/security (use test-only controls).
- Full parity with real Piano business logic.
- Database-backed simulator state.
- Public documentation or OpenAPI listing for `/sim/trigger`.

## Inputs

- OpenAPI reference spec: `Docs/piano/piano.api.json`.
- Model reference: `Docs/piano/model-structure.md`.
- Sales and catalog plan: `Docs/sales-plan.md` and `Docs/establishments/`.
- Simulator endpoint: `/sim/trigger` (not in OpenAPI).
- Runtime: Node.js API, package manager `pnpm`.

## High-Level Design

- HTTP server exposes `/sim/trigger` plus static assets for the UI.
- `/sim/trigger` generates POS orders from menu and busyness profiles.
- Generated orders follow the Piano payload shape as a reference spec.

## `/sim/trigger` (CI-only)

- Not included in OpenAPI or public docs.
- Called by GitHub Actions to reset and seed the simulator.
- Request body fields:
  - `businessIds`: array of establishment IDs to generate orders for (empty array = all).
  - `username`/`password`: optional, if credentials are required (also accepted via headers).
- Behavior:
  - Validates requested business IDs against `API/public/data/items.json`.
  - Uses weekly busyness profiles + magic number gating to generate realistic orders.
  - Returns a payload that includes per-business orders.

## Simulated Establishments

- Shop (retail): open 07:00 to 20:00 GMT
- Pub: open 14:00 to 02:00 GMT (next day)
- Petrol station: open 00:00 to 24:00 GMT
- Burrito truck (La Mordida): open Fri-Sun 11:00 to 22:00 GMT

## Auth Simulation

- Optional header/body auth for `/sim/trigger` using `SIM_TRIGGER_USERNAME` and `SIM_TRIGGER_PASSWORD`.
- No OAuth or Piano auth endpoints are exposed.

## Data Sources

- Catalogs: `API/public/data/items.json`.
- Busyness profiles:
  - Daily segments: `API/public/data/busyness-*.json`
  - Weekly distribution: `API/public/data/busyness-weekly-*.json`
