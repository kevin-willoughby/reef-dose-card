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

export interface GroupRecord {
  id: string;
  name: string;
  pumpIds: string[];
  scalePercent: number;
}

export interface CardConfig {
  type: string;
  // Which pumps' schedules to show - a subset of the integration's
  // full pump list, since not every pump is necessarily worth a tab
  // on every dashboard view.
  pump_ids: string[];
  title?: string;
}

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
