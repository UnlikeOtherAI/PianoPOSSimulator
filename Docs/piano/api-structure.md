# Piano POS Simulator API Structure

This document explains how the POS purchase simulator API is organized and how the simulated business data should behave.

## API Overview

- The simulator mirrors the Piano OpenAPI definition in `Docs/piano/piano.api.json` as a reference payload spec.
- Authentication endpoints always succeed and return fixed tokens.
- Data ingestion endpoints accept payloads and respond with schema-accurate success responses.
- Simulator-only controls live under `/sim/trigger`.

## Auth Surface

- OAuth endpoints:
  - `GET /oauth/authorize`
  - `POST /oauth/token`
  - `POST /oauth/revoke`
  - `POST /oauth/introspect`
  - `POST /oauth/register`
  - `GET /oauth/userinfo`
  - `GET /.well-known/oauth-authorization-server`
  - `GET /.well-known/oauth-protected-resource/mcp`
- Application auth endpoints:
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/whoami`
  - `POST /api/v1/auth/pair`

## Data Surface (OpenAPI)

- Orders import: `PUT /api/v1/orders`
- Documents import: `PUT /api/v1/documents`
- Inventory state import: `PUT /api/v1/inventory/state`

## Simulated Establishments

The simulator represents three establishments:

1. Shop (retail) - open 7:00 to 20:00 GMT
2. Pub - open 14:00 to 02:00 GMT
3. Petrol station - open 00:00 to 24:00 GMT (always open)

## Purchase Simulation Rules

- After authentication, the simulator should surface purchases during the opening hours for each establishment.
- Orders outside opening hours should not be generated for that establishment.
- The pub operates across midnight; its closing time is 02:00 GMT the next day.

## Tokens

Fixed tokens are documented in `Docs/piano/model-structure.md` and should be reused for authenticated access in later endpoints.
