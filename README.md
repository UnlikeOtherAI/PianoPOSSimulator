# PianoPOSSimulator

Node.js POS purchase simulator that uses the Piano integration API in `Docs/piano/piano.api.json` as a reference payload spec. Intended for local development and CI workflows that need deterministic API behavior.

## What This Is

- A simulator for the Piano POS integration API.
- Triggered in CI via a private endpoint (`/sim/trigger`).
- Live simulator: https://pianosim.unlikeotherai.com

## Status

Basic API scaffold in place with `/sim/trigger` returning `{ "ok": ":)" }`.

![OAuth simulator UI](API/public/assets/auth_screenshot.png)

## Swagger UI

- Local: `http://localhost:6080/swagger`
- Deployed: `https://pianosim.unlikeotherai.com/swagger`

## Simulator Rules & Scenarios

### Shops and Hours (GMT)

- Shop (retail): 07:00 to 20:00
- Pub: 14:00 to 02:00 (next day)
- Petrol station: 00:00 to 24:00 (always open)

### Establishment IDs

- Shop: `urn:establishment:sim-shop-001`
- Pub: `urn:establishment:sim-pub-001`
- Petrol station: `urn:establishment:sim-petrol-001`

### Purchase Simulation Rules

- Auth always succeeds and enables access to simulated data.
- Purchases appear only during each establishment’s opening hours.
- The pub crosses midnight; purchases can appear between 00:00 and 02:00 GMT.

### Scenario Control

- `/sim/trigger` seeds deterministic data for CI scenarios.
- Scenarios are defined in `Docs/brief.md`.

### Example Usage

```bash
# OAuth authorize (UI)
open "https://pianosim.unlikeotherai.com/oauth/authorize?redirect_uri=https://example.com/callback&state=demo"

# Login for access token
curl -s -X POST https://pianosim.unlikeotherai.com/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{}'

# WhoAmI using fixed access token
curl -s https://pianosim.unlikeotherai.com/api/v1/auth/whoami \\
  -H "Authorization: Bearer sim_access_token"
```

## Local Setup

- Install deps: `make install`
- Run API (defaults to port 6080): `make launch`

## DigitalOcean App

- `make read` fetches the live app spec into `app.yaml` (requires `doctl auth init`).
- `make deploy` updates the app using `app.yaml`.
