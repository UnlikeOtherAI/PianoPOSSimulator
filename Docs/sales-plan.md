# Sales Simulation Plan

This document defines how simulated sales should be generated across establishments, including timing rules, item selection, and per-item daily caps (the "magic number" for suspicious volume).

## Establishments

- Shop (Get Naked): `urn:establishment:sim-shop-001`
- Pub (The Rock Bottom): `urn:establishment:sim-pub-001`
- Petrol station (Scottish Diesel): `urn:establishment:sim-petrol-001`

## Opening Hours (GMT)

- Shop: 07:00 to 20:00
- Pub: 14:00 to 02:00 (next day)
- Petrol station: 24/7

## The "Magic Number" (Daily Cap)

- Every catalog item has a `daily cap` value in its establishment document.
- The cap is the upper bound for daily sales volume for that item.
- When generating sales, do not exceed `daily cap` for any item within a 24-hour window.
- If the selection pool is exhausted, fall back to the next best item in the same category with remaining cap.

## Trigger Behavior

Each call to `/sim/trigger` should create exactly one fake sale for each establishment:

- Shop: one retail sale with 1-3 items.
- Pub: one bar tab with 1-4 items (beers, spirits, cocktails, merch).
- Petrol station: one transaction with fuel and/or snacks (rules below).

## Randomization Principles

- Use weighted random selection with a deterministic seed (optional) for repeatable scenarios.
- Favor core items (beer taps, fuel, tees) while allowing long-tail items at lower frequency.
- Apply time-of-day weighting based on opening hours and expected peak times.

## Pub (The Rock Bottom) Rules

- Peak demand: 18:00 to 23:30.
- Item mix target:
  - 55% beers
  - 25% cocktails
  - 15% spirits
  - 5% merch (tees/tickets)
- Beer order sizes:
  - 70% pint
  - 30% half
- Merchandise should appear at most 0-4 times per day (cap already enforces this).

## Shop (Get Naked) Rules

- Peak demand: 11:00 to 13:00 and 16:00 to 19:00.
- Item mix target:
  - 70% t-shirts
  - 20% pants/skirts
  - 5% hoodies/jackets
  - 5% wallets/handbags
- Basket sizes: 1-3 items.
- Keep sizes realistic (use listed sizes only).

## Petrol Station (Scottish Diesel) Rules

- Daytime rate: one sale every 5-20 minutes between 06:00 and 22:00.
- Nighttime rate: one sale per hour between 22:00 and 06:00.
- Transaction mix:
  - 10% snack-only transactions.
  - 90% include fuel (snacks optional).
- Fuel quantities:
  - Car fill: 20-60 liters.
  - Van fill: 60-90 liters.
  - Truck fill: 200-400 liters.
  - 8 truck fills per day, spread across daytime hours.
- LPG bottles: 1-3 total per day, only during daytime.

## Reasonable Sales Volume

- Do not exceed any per-item `daily cap`.
- Use per-hour throttles so total sales volumes align with opening hours and the rate targets above.
- If a transaction would violate caps, swap items or reduce quantities.
