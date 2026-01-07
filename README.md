# PianoPOSSimulator

Node.js API simulator for the Piano integration API described in `Docs/piano.api.json`. Intended for local development and CI workflows that need deterministic API behavior.

## What This Is

- A simulator for the Piano POS integration API.
- Backed by PostgreSQL for repeatable test data.
- Triggered in CI via a private endpoint (`/sim/trigger`).
- Live simulator: https://pianosim.unlikeotherai.com

## Status

Basic API scaffold in place with `/sim/trigger` returning `{ "ok": ":)" }`.

## Local Setup

- Install deps: `make install`
- Configure env: copy `API/.env.example` to `API/.env` and set `DATABASE_URL`
- Run API (defaults to port 6080): `make launch`

## DigitalOcean App

- `make read` fetches the live app spec into `app.yaml` (requires `doctl auth init`).
- `make deploy` updates the app using `app.yaml`.
