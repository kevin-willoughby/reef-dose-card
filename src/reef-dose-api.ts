// Thin wrapper over hass.connection's raw call_service websocket
// command - used (rather than the newer hass.callService(..., true)
// overload some HA frontend versions support) specifically because
// the low-level `{ type: "call_service", return_response: true }`
// shape is the one documented, version-stable way to get a response
// back from a service call, regardless of which HA core release this
// card happens to be running against.
import type {
  GroupRecord,
  GroupScheduleResponse,
  HomeAssistant,
  ReservoirResponse,
  ScheduleResponse,
} from "./types";

const DOMAIN = "reef_dose";

// A service call that's unregistered (integration not yet updated/
// reloaded to the version that added it) has been observed to hang
// the underlying websocket promise indefinitely instead of rejecting
// cleanly - confirmed live, 2026-10-05: the Dashboard tab's "Loading…"
// never resolved to either data or an error after calling the brand-
// new get_reservoir service before reef-dose-ha had been reloaded.
// This bounds every call so a stale/missing service always surfaces
// as a clear error in the UI instead of a silent permanent spinner.
const RESPONSE_TIMEOUT_MS = 10_000;

async function callWithResponse<T>(
  hass: HomeAssistant,
  service: string,
  serviceData: Record<string, unknown>,
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(
      () =>
        reject(
          new Error(
            `reef_dose.${service} did not respond within ${RESPONSE_TIMEOUT_MS / 1000}s - is reef-dose-ha updated and reloaded?`,
          ),
        ),
      RESPONSE_TIMEOUT_MS,
    );
  });
  const result = await Promise.race([
    hass.connection.sendMessagePromise({
      type: "call_service",
      domain: DOMAIN,
      service,
      service_data: serviceData,
      return_response: true,
    }),
    timeout,
  ]);
  return (result.response as Record<string, unknown>) as T;
}

async function call(hass: HomeAssistant, service: string, serviceData: Record<string, unknown>): Promise<void> {
  await hass.callService(DOMAIN, service, serviceData);
}

export function getSchedule(hass: HomeAssistant, pumpId: string): Promise<ScheduleResponse> {
  return callWithResponse<ScheduleResponse>(hass, "get_schedule", { pump_id: pumpId });
}

export function getReservoir(hass: HomeAssistant, pumpId: string): Promise<ReservoirResponse> {
  return callWithResponse<ReservoirResponse>(hass, "get_reservoir", { pump_id: pumpId });
}

export function refillReservoir(hass: HomeAssistant, pumpId: string, fullMl: number): Promise<void> {
  return call(hass, "refill_reservoir", { pump_id: pumpId, full_ml: fullMl });
}

// Two-step calibration: start_calibration runs the pump briefly and
// hands back a sessionId that must be threaded through to
// apply_calibration - the firmware silently no-ops on a stale/
// mismatched session id, so the card never invents one itself.
export async function startCalibration(hass: HomeAssistant, pumpId: string): Promise<number> {
  const result = await callWithResponse<{ sessionId: number }>(hass, "start_calibration", { pump_id: pumpId });
  return result.sessionId;
}

export function applyCalibration(
  hass: HomeAssistant,
  pumpId: string,
  sessionId: number,
  measuredMl: number,
): Promise<void> {
  return call(hass, "apply_calibration", { pump_id: pumpId, session_id: sessionId, measured_ml: measuredMl });
}

export function updateScheduleSlots(
  hass: HomeAssistant,
  pumpId: string,
  slots: Record<string, number>,
): Promise<void> {
  return call(hass, "update_schedule", { pump_id: pumpId, slots });
}

export function autoDivideSchedule(hass: HomeAssistant, pumpId: string, dailyTotalMl: number): Promise<void> {
  return call(hass, "auto_divide_schedule", { pump_id: pumpId, daily_total_ml: dailyTotalMl });
}

export async function getGroups(hass: HomeAssistant): Promise<GroupRecord[]> {
  const result = await callWithResponse<{ groups: GroupRecord[] }>(hass, "get_groups", {});
  return result.groups;
}

export function createGroup(
  hass: HomeAssistant,
  groupId: string,
  name: string,
  pumpIds: string[],
): Promise<void> {
  return call(hass, "create_group", { group_id: groupId, name, pump_ids: pumpIds });
}

export function updateGroup(
  hass: HomeAssistant,
  groupId: string,
  fields: { name?: string; pumpIds?: string[]; scalePercent?: number },
): Promise<void> {
  const data: Record<string, unknown> = { group_id: groupId };
  if (fields.name !== undefined) data.name = fields.name;
  if (fields.pumpIds !== undefined) data.pump_ids = fields.pumpIds;
  if (fields.scalePercent !== undefined) data.scale_percent = fields.scalePercent;
  return call(hass, "update_group", data);
}

export function deleteGroup(hass: HomeAssistant, groupId: string): Promise<void> {
  return call(hass, "delete_group", { group_id: groupId });
}

export function getGroupSchedule(hass: HomeAssistant, groupId: string): Promise<GroupScheduleResponse> {
  return callWithResponse<GroupScheduleResponse>(hass, "get_group_schedule", { group_id: groupId });
}

export function updateGroupScheduleSlots(
  hass: HomeAssistant,
  groupId: string,
  slots: Record<string, number>,
): Promise<void> {
  return call(hass, "update_group_schedule", { group_id: groupId, slots });
}

export function autoDivideGroupSchedule(hass: HomeAssistant, groupId: string, dailyTotalMl: number): Promise<void> {
  return call(hass, "auto_divide_group_schedule", { group_id: groupId, daily_total_ml: dailyTotalMl });
}

// Server-side compounding - deltaPercent applies onto whatever the group is
// CURRENTLY effectively dosing, computed fresh from the live group record,
// not a value the card may be holding stale. Prefer this over computing a
// new scalePercent client-side and calling updateGroup with it.
export function applyGroupAdjustment(hass: HomeAssistant, groupId: string, deltaPercent: number): Promise<void> {
  return call(hass, "apply_group_adjustment", { group_id: groupId, delta_percent: deltaPercent });
}
