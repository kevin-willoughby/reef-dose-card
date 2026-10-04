# Reef Dose Card

Custom Lovelace card for [reef-dose-ha](https://github.com/kevin-willoughby/reef-dose-ha): a per-slot
schedule editor and scaling-group manager — the two structured actions
(a partial 24-hour slots map, an arbitrary pump-id list) that don't fit a plain HA
switch/number/button entity.

This card never talks to `reef-dose-service` directly and has no API host/key in its config — it
calls `reef-dose-ha`'s `reef_dose.*` services over HA's own already-authenticated connection, the
same way any other Lovelace card calls a service. `reef-dose-ha` must be installed and configured
first.

## Installation (via HACS)

1. HACS → Frontend → ⋮ (top right) → **Custom repositories**
2. Add this repo's URL, category **Lovelace**
3. Install **Reef Dose Card**
4. Edit a dashboard → **+ Add Card** → search **Reef Dose Card** (or add manually, see below)

## Configuration

```yaml
type: custom:reef-dose-card
title: Dosing Schedule
pump_ids:
  - "1"
  - "4"
  - "2"
  - "3"
```

- `pump_ids` (required): which pumps' schedules to show, and which pumps are offered as checkboxes
  when creating/editing a group. Order controls the tab order.
- `title` (optional): card header.

## What it does

**Schedule tab** — pick a pump (if more than one is configured), see all 24 hourly slots, tap
**Edit** on any row to change that slot's ml amount in place (Save/Cancel), matching the existing
Dosetronic app's tap-row-to-edit interaction (requirements.md Section 3). A **Daily Total
(Auto-Divide)** field at the top evenly splits a given ml/day across all 24 slots in one action —
the schedule's starting point, individual rows still editable afterward.

**Groups tab** — lists every scaling group (name, members, current scale%), with **Edit**
(membership + scale%) and **Delete** per group, and a **+ New Group** form (id, name, member
checkboxes) for creating one (requirements.md Section 5).

## Development

```bash
npm install
npm run build    # bundles src/reef-dose-card.ts -> reef-dose-card.js (committed, not gitignored -
                  # HACS fetches this file directly from the repo, no release/CI pipeline)
npm run watch     # rebuild on change, for local iteration
```

No test suite — this is a thin UI layer over `reef-dose-ha`'s already-tested
`reef_dose.*` services (see `reef-dose-ha`'s own test coverage for the logic those
services wrap). Verify changes by loading the built `reef-dose-card.js` as a HACS
custom repository pointed at a local branch, or by copying it into HA's
`www/` folder and adding it as a dashboard resource manually, then exercising
both tabs against a real `reef-dose-service` instance.
