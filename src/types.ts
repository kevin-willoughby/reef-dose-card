// Shapes match reef-dose-service's own DTOs exactly (schedule.dto.ts,
// reservoir.dto.ts aren't needed here; group.dto.ts and ScheduleDto
// are) - this card talks to them only indirectly, through
// reef-dose-ha's reef_dose.* services (see services.py), but the
// response payloads pass straight through unchanged.

export const HOURS: readonly string[] = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, "0"));

export interface ScheduleResponse {
  pumpId: string;
  scheduleEnabled: boolean;
  slots: Record<string, number>;
  splitDoseEnabled: boolean;
}

export interface ReservoirResponse {
  pumpId: string;
  remainingMl: number;
  fullMl: number;
  // Running total since the firmware's own daily reset (23:59:00) -
  // see reef-dose-service's PumpsService.getReservoir.
  dosedTodayMl: number;
  dailyScheduledMl: number;
  daysRemaining: number | null;
}

export interface GroupRecord {
  id: string;
  name: string;
  pumpIds: string[];
  scalePercent: number;
}

export interface GroupScheduleResponse {
  id: string;
  scalePercent: number;
  // Effective values (base * scalePercent/100) - what's actually
  // being pushed, identically, to every current member pump.
  slots: Record<string, number>;
}

export interface CardConfig {
  type: string;
  // Which pumps' schedules to show - a subset of the integration's
  // full pump list, since not every pump is necessarily worth a tab
  // on every dashboard view.
  pump_ids: string[];
  // Which scaling groups' own schedules to also show as tabs
  // alongside the pumps above - a group owns one shared 24-hour
  // schedule, pushed identically to every current member (see
  // reef-dose-service's README). Optional - most dashboards only need
  // this once a group actually exists.
  group_ids?: string[];
  title?: string;
}

// One schedule-editable thing this card's Schedule tab can point at -
// either a single pump's own schedule, or a group's shared one. The
// row-rendering/edit/auto-divide code is parameterized by this rather
// than hardcoding "the active pump", so it works identically either
// way.
export type ScheduleTarget = { kind: "pump"; id: string } | { kind: "group"; id: string };

// Minimal slice of HA's frontend `hass` object this card actually
// uses - the real type (from `custom-card-helpers`) is much larger;
// declaring only what's needed avoids a devDependency just for types.
export interface HomeAssistant {
  states: Record<string, { state: string; attributes: Record<string, unknown> }>;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
  ) => Promise<unknown>;
  connection: {
    sendMessagePromise: (message: Record<string, unknown>) => Promise<{ response?: unknown }>;
  };
}
