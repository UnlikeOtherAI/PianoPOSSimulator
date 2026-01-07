# PianoPOSSimulator

Node.js POS purchase simulator that uses the Piano integration API in `Docs/piano/piano.api.json` as a reference payload spec. Intended for local development and CI workflows that need deterministic POS payloads.

## What This Is

- A simulator for POS purchase payloads (Piano schema as reference only).
- Triggered via `/sim/trigger`, which generates order data per establishment.
- Live simulator: https://pianosim.unlikeotherai.com

## Status

`/sim/trigger` returns generated orders per business (used by CI and the UI).

![OAuth simulator UI](API/public/assets/auth_screenshot.png)

## Swagger UI

- Local: `http://localhost:6080/swagger`
- Deployed: `https://pianosim.unlikeotherai.com/swagger`

## UI

- Homepage tabs show each establishment with charts and menu.
- "Make Sale" triggers `/sim/trigger` and shows generated purchases.

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

- Purchases appear only during each establishment’s opening hours.
- The pub crosses midnight; purchases can appear between 00:00 and 02:00 GMT.
- `/sim/trigger` uses the weekly busyness profiles to determine how many purchases to generate.

### Trigger Usage

```bash
# Trigger all businesses
curl -s -X POST https://pianosim.unlikeotherai.com/sim/trigger \\
  -H "Content-Type: application/json" \\
  -d '{"businessIds":[]}'

# Trigger specific businesses
curl -s -X POST https://pianosim.unlikeotherai.com/sim/trigger \\
  -H "Content-Type: application/json" \\
  -d '{"businessIds":["urn:establishment:sim-pub-001","urn:establishment:sim-truck-001"]}'

# Optional auth (if SIM_TRIGGER_USERNAME/SIM_TRIGGER_PASSWORD are set)
curl -s -X POST https://pianosim.unlikeotherai.com/sim/trigger \\
  -H "Content-Type: application/json" \\
  -H "x-sim-username: $SIM_TRIGGER_USERNAME" \\
  -H "x-sim-password: $SIM_TRIGGER_PASSWORD" \\
  -d '{"businessIds":[]}'
```

## Local Setup

- Install deps: `make install`
- Run API (defaults to port 6080): `make launch`

## Makefile Targets

- `make install`: install API dependencies with `pnpm`.
- `make launch`: install deps and start the API server.
- `make test`: run the local purchase simulation summary.
- `make read [staging]`: fetch the DigitalOcean app spec into `app.yaml` (or `app.staging.yaml`).
- `make deploy [staging]`: deploy the DigitalOcean app from the spec file.

## DigitalOcean App

- `make read` fetches the live app spec into `app.yaml` (requires `doctl auth init`).
- `make deploy` updates the app using `app.yaml`.
