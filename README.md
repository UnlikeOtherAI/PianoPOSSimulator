# PianoPOSSimulator

Node.js API simulator for the Piano integration API described in `Docs/piano.api.json`. Intended for local development and CI workflows that need deterministic API behavior.

## What This Is

- A simulator for the Piano POS integration API.
- Backed by PostgreSQL for repeatable test data.
- Triggered in CI via a private endpoint (`/sim/trigger`).
- Live simulator: https://pianosim.unlikeotherai.com

## Status

Basic API scaffold in place with `/sim/trigger` returning `{ "ok": ":)" }`.

## Simulator Rules & Scenarios

### Shops and Hours (GMT)

- Shop (retail): 07:00 to 20:00
- Pub: 14:00 to 02:00 (next day)
- Petrol station: 00:00 to 24:00 (always open)

### Purchase Simulation Rules

- Auth always succeeds and enables access to simulated data.
- Purchases appear only during each establishment’s opening hours.
- The pub crosses midnight; purchases can appear between 00:00 and 02:00 GMT.

### Scenario Control

- `/sim/trigger` seeds deterministic data for CI scenarios.
- Scenarios are defined in `Docs/brief.md`.

## Local Setup

- Install deps: `make install`
- Configure env: copy `API/.env.example` to `API/.env` and set `DATABASE_URL`
- Run API (defaults to port 6080): `make launch`

## DigitalOcean App

- `make read` fetches the live app spec into `app.yaml` (requires `doctl auth init`).
- `make deploy` updates the app using `app.yaml`.
