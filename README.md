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

1. HACS → ⋮ (top right) → **Custom repositories**
2. Add this repo's URL, category **Dashboard** (HACS's current name for Lovelace/frontend card repos)
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
group_ids:
  - "Reef Zelements"
```

- `pump_ids` (required): which pumps' schedules to show, and which pumps are offered as checkboxes
  when creating/editing a group. Order controls the tab order.
- `group_ids` (optional): which scaling groups' own schedules to also show as tabs, alongside the
  pumps above. A group owns one shared 24-hour schedule, pushed identically to every current member
  (requirements.md Section 5) — editing a group's tab here edits that shared schedule directly, the
  same 24-row editor as a pump's tab, just with a different write target. Use the group's `id` (not
  its display name) — `reef_dose.get_groups` or the Groups tab below will show you the right value.
- `title` (optional): card header.

## What it does

Every value-entry action in this card uses the same popup pattern: press a button, a modal appears
with one number field, **Save** commits it, **Cancel** discards it and closes without changing
anything.

**Schedule tab** — pick a pump or group (if more than one target is configured, mixed together as
one tab list), see all 24 hourly slots, tap **Edit** on any row to change that slot's ml amount in
place (Save/Cancel appear inline in that row), matching the existing Dosetronic app's
tap-row-to-edit interaction (requirements.md Section 3). **Auto-Divide Schedule** opens the same
Save/Cancel popup for a daily total ml, pre-filled with the current total — Save evenly splits it
across all 24 slots and writes it straight to the device (the schedule's starting point, individual
rows still editable afterward); Cancel leaves the schedule untouched. Editing a *group*'s tab writes
to the group's own shared schedule, pushed identically to every current member — not to one pump's
schedule.

**Groups tab** — lists every scaling group (name, members, current scale%). **Edit Membership**
toggles which pumps belong to the group (Save/Cancel inline). **Manual Overall Adjustment** opens
the Save/Cancel popup for a **delta** percentage, matching the existing Dosetronic app's own name
for this action (requirements.md Section 5) — enter `-10` and Save to decrease every member pump's
schedule by 10% of whatever it's *currently* at (not 10 percentage points off a fixed 100% base;
compounds like any "adjust by X%" control), or Cancel to back out without applying anything.
**Delete** removes a group, and a **+ New Group** form (id, name, member checkboxes) creates one.

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
