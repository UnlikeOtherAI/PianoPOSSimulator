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
- Without a database, per-day caps are approximated using a deterministic \"magic number\" per item. These caps are statistical guidance only (e.g., a `daily cap` of 1–3 means "roughly 1–3 per day", not a hard limit).
- Magic number algorithm:
  - `base = 30 + (hash(date|establishment|item) % 61)` (range 30-90).
  - Adjust by price: very expensive items reduce the number; very cheap items increase it.
  - Adjust by daily cap: low caps reduce the number; high caps slightly increase it.
  - Clamp to 5-95 to avoid extremes.
- When selecting items, compute a per-slot roll `1-100` from `hash(date|establishment|item|slot|attempt)` and include the item only if `roll <= magicNumber`.
- If all attempts fail, fall back to a random item from the same category.

## Trigger Behavior

Each call to `/sim/trigger` generates 0+ purchases per establishment based on the weekly busyness profiles:

- Counts are derived per 5-minute slot from the weekly min/max ranges.
- If the establishment is closed for the current slot, no purchases are generated.

## Randomization Principles

- Use weekly busyness profiles (`API/public/data/busyness-weekly-*.json`) to estimate demand per hour.
- Convert hourly min/max ranges into per-5-minute expectations and draw counts with a Poisson sample.
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
- Only one fuel line item is allowed per purchase.

## Burrito Truck (La Mordida) Rules

- Open Fri-Sun only.
- Peak demand: 11:00 to 14:00 and 20:00 to 22:00.
- Item mix target:
  - 45% burritos
  - 25% tacos
  - 15% sides
  - 15% drinks
- Basket sizes: 1-3 items.

## Reasonable Sales Volume

- Weekly busyness files define hourly min/max per day; use them as the primary demand signal.

- Do not exceed any per-item `daily cap`.
- Use per-hour throttles so total sales volumes align with opening hours and the rate targets above.
- If a transaction would violate caps, swap items or reduce quantities.
