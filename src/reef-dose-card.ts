// Custom Lovelace card: per-slot schedule editing and scaling-group
// management for reef-dose (requirements.md Sections 3 and 5) -
// the two structured actions that never fit a plain HA
// switch/number/button entity (a partial 24-hour slots map, an
// arbitrary pump-id list). Talks only to reef-dose-ha's reef_dose.*
// services (see reef-dose-ha's services.py) - never calls
// reef-dose-service directly, so this card's config never needs an
// API host or key; everything goes through HA's own already-
// authenticated connection.
import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  applyCalibration,
  applyGroupAdjustment,
  autoDivideGroupSchedule,
  autoDivideSchedule,
  createGroup,
  deleteGroup,
  getGroups,
  getGroupSchedule,
  getName,
  getReservoir,
  getSchedule,
  manualDose,
  primePump,
  refillReservoir,
  setName,
  startCalibration,
  updateGroup,
  updateGroupScheduleSlots,
  updateScheduleSlots,
} from "./reef-dose-api";
import {
  HOURS,
  type CardConfig,
  type GroupRecord,
  type HomeAssistant,
  type ReservoirResponse,
  type ScheduleTarget,
} from "./types";

type Tab = "dashboard" | "schedule" | "groups";

// Group membership checkboxes must offer every physical pump (1-6),
// not just whichever subset the card's own pump_ids config happens
// to list for the Schedule tab - those are independent concerns.
// Confirmed live this was a real trap, not just a cosmetic gap: a
// group's actual members can include a pump the card wasn't
// configured to show a schedule tab for, and the old code built this
// checkbox list from pump_ids alone, silently omitting that member -
// saving membership from that view would have dropped it from the
// group without any visible warning.
const ALL_PUMP_IDS = ["1", "2", "3", "4", "5", "6"];

// A single reusable "button opens a popup with one number input, Save
// or Cancel" flow - used for both Auto-Divide and Manual Overall
// Adjustment, so there's one modal implementation instead of two
// slightly-different inline forms with inconsistent cancel behavior.
interface PromptState {
  title: string;
  value: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  saveLabel?: string;
  onSave: (value: number) => Promise<void> | void;
}

// The confirm step ahead of calibration's measurement prompt - no
// input, just "are you sure" with a button that kicks off a live
// device call (start_calibration) before the next screen can open,
// so it needs its own busy state rather than reusing PromptState.
interface ConfirmState {
  title: string;
  message: string;
  confirmLabel: string;
  busy: boolean;
  onConfirm: () => Promise<void> | void;
}

@customElement("reef-dose-card")
export class ReefDoseCard extends LitElement {
  private _hass?: HomeAssistant;
  private _config?: CardConfig;

  @state() private _tab: Tab = "dashboard";
  @state() private _reservoirs: Record<string, ReservoirResponse | null> = {};
  @state() private _reservoirErrors: Record<string, string> = {};
  @state() private _reservoirsLoading = false;
  @state() private _activeTarget: ScheduleTarget | null = null;
  @state() private _scheduleSlots: Record<string, number> | null = null;
  @state() private _scheduleLoading = false;
  @state() private _editingHour: string | null = null;
  @state() private _editValue = "";
  @state() private _pumpNames: Record<string, string> = {};
  @state() private _groups: GroupRecord[] = [];
  @state() private _groupsLoading = false;
  @state() private _showNewGroupForm = false;
  @state() private _newGroupId = "";
  @state() private _newGroupName = "";
  @state() private _newGroupPumpIds = new Set<string>();
  @state() private _editingGroupId: string | null = null;
  @state() private _editGroupPumpIds = new Set<string>();
  @state() private _prompt: PromptState | null = null;
  @state() private _confirm: ConfirmState | null = null;
  @state() private _renamePumpId: string | null = null;
  @state() private _renameValue = "";
  @state() private _error: string | null = null;

  setConfig(config: CardConfig): void {
    if (!config.pump_ids || !Array.isArray(config.pump_ids) || config.pump_ids.length === 0) {
      throw new Error("reef-dose-card: config.pump_ids must be a non-empty array of pump ids, e.g. ['1', '4']");
    }
    this._config = config;
    if (!this._activeTarget) {
      this._activeTarget = { kind: "pump", id: config.pump_ids[0] };
    }
  }

  set hass(hass: HomeAssistant) {
    const firstSet = !this._hass;
    this._hass = hass;
    if (firstSet) {
      void this._loadDashboard();
      void this._loadActiveSchedule();
      void this._loadGroups();
      void this._loadPumpNames();
    }
  }

  // All 6 physical pumps, not just this._config.pump_ids - the Groups
  // tab's membership checkboxes/member lists (see ALL_PUMP_IDS) can
  // reference any pump regardless of which ones this card's Schedule
  // tab was configured to show. A pump that errors (offline, no name
  // set) just keeps its "Pump N" fallback rather than failing the
  // whole batch.
  private async _loadPumpNames(): Promise<void> {
    if (!this._hass) return;
    const entries = await Promise.all(
      ALL_PUMP_IDS.map(async (id) => {
        try {
          return [id, await getName(this._hass!, id)] as const;
        } catch {
          return null;
        }
      }),
    );
    const names: Record<string, string> = {};
    for (const entry of entries) {
      if (entry) names[entry[0]] = entry[1];
    }
    this._pumpNames = names;
  }

  getCardSize(): number {
    return 8;
  }

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 16px;
    }
    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      border-bottom: 1px solid var(--divider-color, #333);
    }
    .tab {
      padding: 8px 12px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .tab.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    .pump-select {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .pump-chip {
      padding: 4px 10px;
      border-radius: 12px;
      border: 1px solid var(--divider-color, #555);
      cursor: pointer;
      font-size: 0.85em;
    }
    .pump-chip.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color);
    }
    .error {
      background: var(--error-color, #b00020);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 12px;
      font-size: 0.9em;
    }
    .dash-row {
      padding: 12px 0;
      border-bottom: 1px solid var(--divider-color, #2a2a2a);
    }
    .dash-row:last-child {
      border-bottom: none;
    }
    .dash-name {
      font-weight: 500;
      margin-bottom: 8px;
      cursor: pointer;
    }
    .dash-name:hover {
      text-decoration: underline;
    }
    .dash-meta {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .dash-empty {
      color: var(--secondary-text-color);
      font-size: 0.85em;
    }
    .dash-bar-wrap {
      flex: 1;
      min-width: 0;
    }
    .dash-bar {
      height: 6px;
      border-radius: 3px;
      background: var(--divider-color, #333);
      overflow: hidden;
    }
    .dash-bar-fill {
      height: 100%;
      background: var(--primary-color);
      border-radius: 3px;
    }
    .dash-bar-label {
      margin-top: 4px;
      font-size: 0.8em;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .dash-reservoir-label {
      margin-top: 2px;
      font-size: 0.75em;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .dash-days {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .dash-days-ring {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      /* --dash-pct is the reservoir's remaining/full percentage (same
         ratio as the bar above) - filled portion of the ring, not a
         days-remaining percentage, since there's no fixed "100%
         days" to measure against. */
      background: conic-gradient(
        var(--primary-color) calc(var(--dash-pct, 0) * 1%),
        var(--divider-color, #333) 0
      );
    }
    .dash-days-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--card-background-color, #1c1c1c);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      font-size: 0.85em;
    }
    .dash-days-label {
      font-size: 0.7em;
      color: var(--secondary-text-color);
      text-align: center;
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px solid var(--divider-color, #2a2a2a);
    }
    .row .hour {
      width: 48px;
      font-variant-numeric: tabular-nums;
    }
    .row .ml {
      flex: 1;
      text-align: right;
      margin-right: 8px;
    }
    input[type="number"],
    input[type="text"] {
      background: var(--card-background-color, #1c1c1c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #555);
      border-radius: 4px;
      padding: 4px 6px;
      width: 80px;
    }
    .auto-divide {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--divider-color, #2a2a2a);
    }
    button {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 0.85em;
    }
    button.secondary {
      background: transparent;
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #555);
    }
    button.danger {
      background: var(--error-color, #b00020);
    }
    .group-card {
      border: 1px solid var(--divider-color, #2a2a2a);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 12px;
    }
    .group-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .group-meta {
      color: var(--secondary-text-color);
      font-size: 0.85em;
    }
    .checkbox-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 8px 0;
    }
    .checkbox-list label {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9em;
    }
    .actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal {
      background: var(--card-background-color, #1c1c1c);
      color: var(--primary-text-color);
      border-radius: 8px;
      padding: 20px;
      min-width: 320px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }
    .modal h3 {
      margin: 0 0 12px;
    }
    .modal .field {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .modal input[type="number"] {
      width: 120px;
    }
    .modal input[type="text"] {
      width: 100%;
      box-sizing: border-box;
    }
  `;

  render(): TemplateResult {
    if (!this._config) return html``;

    return html`
      <ha-card header=${this._config.title ?? "Reef Dose"}>
        <div style="padding: 0 16px 16px">
          ${this._error ? html`<div class="error">${this._error}</div>` : ""}
          <div class="tabs">
            <div class="tab ${this._tab === "dashboard" ? "active" : ""}" @click=${() => this._switchTab("dashboard")}>
              Dashboard
            </div>
            <div class="tab ${this._tab === "schedule" ? "active" : ""}" @click=${() => this._switchTab("schedule")}>
              Schedule
            </div>
            <div class="tab ${this._tab === "groups" ? "active" : ""}" @click=${() => this._switchTab("groups")}>
              Groups
            </div>
          </div>
          ${this._tab === "dashboard"
            ? this._renderDashboard()
            : this._tab === "schedule"
              ? this._renderSchedule()
              : this._renderGroups()}
        </div>
      </ha-card>
      ${this._renderPrompt()}
      ${this._renderConfirm()}
      ${this._renderRenamePrompt()}
    `;
  }

  // ---- Shared Save/Cancel prompt modal -----------------------------

  private _openPrompt(opts: Omit<PromptState, "value"> & { initialValue: number }): void {
    const { initialValue, ...rest } = opts;
    this._prompt = { ...rest, value: String(initialValue) };
  }

  private _renderPrompt(): TemplateResult {
    if (!this._prompt) return html``;
    const p = this._prompt;
    return html`
      <div class="modal-overlay" @click=${(e: Event) => e.target === e.currentTarget && this._cancelPrompt()}>
        <div class="modal">
          <h3>${p.title}</h3>
          <div class="field">
            <input
              type="number"
              min=${p.min}
              max=${p.max}
              step=${p.step}
              .value=${p.value}
              @input=${(e: InputEvent) => (this._prompt = { ...p, value: (e.target as HTMLInputElement).value })}
            />
            <span>${p.unit}</span>
          </div>
          <div class="actions">
            <button @click=${() => this._savePrompt()}>${p.saveLabel ?? "Save"}</button>
            <button class="secondary" @click=${() => this._cancelPrompt()}>Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  private async _savePrompt(): Promise<void> {
    if (!this._prompt) return;
    const { value, min, max, onSave } = this._prompt;
    const num = Number(value);
    if (!Number.isFinite(num) || num < min || num > max) {
      this._error = `Value must be between ${min} and ${max}.`;
      return;
    }
    this._error = null;
    this._prompt = null;
    await onSave(num);
  }

  private _cancelPrompt(): void {
    this._prompt = null;
  }

  // ---- Shared confirm modal (calibration's "Start Calibration?" step) ----

  private _renderConfirm(): TemplateResult {
    if (!this._confirm) return html``;
    const c = this._confirm;
    return html`
      <div class="modal-overlay" @click=${(e: Event) => e.target === e.currentTarget && this._cancelConfirm()}>
        <div class="modal">
          <h3>${c.title}</h3>
          <p>${c.message}</p>
          <div class="actions">
            <button ?disabled=${c.busy} @click=${() => this._confirmConfirm()}>
              ${c.busy ? "Starting…" : c.confirmLabel}
            </button>
            <button class="secondary" ?disabled=${c.busy} @click=${() => this._cancelConfirm()}>Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  private async _confirmConfirm(): Promise<void> {
    if (!this._confirm || this._confirm.busy) return;
    this._confirm = { ...this._confirm, busy: true };
    await this._confirm.onConfirm();
  }

  // ---- Pump rename (click a Dashboard row's name) ----
  // Own dedicated prompt rather than reusing PromptState - that one's
  // input/validation is numeric-only (min/max/step/Number() parsing,
  // see _savePrompt), which doesn't fit a free-text name.

  private _openRenamePrompt(pumpId: string): void {
    this._renamePumpId = pumpId;
    this._renameValue = this._pumpNames[pumpId] ?? "";
  }

  private _cancelRename(): void {
    this._renamePumpId = null;
  }

  private _renderRenamePrompt(): TemplateResult {
    if (!this._renamePumpId) return html``;
    const pumpId = this._renamePumpId;
    return html`
      <div class="modal-overlay" @click=${(e: Event) => e.target === e.currentTarget && this._cancelRename()}>
        <div class="modal">
          <h3>Rename ${this._pumpLabel(pumpId)}</h3>
          <div class="field">
            <input
              type="text"
              maxlength="40"
              .value=${this._renameValue}
              @input=${(e: InputEvent) => (this._renameValue = (e.target as HTMLInputElement).value)}
              @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this._saveRename()}
            />
          </div>
          <div class="actions">
            <button @click=${() => this._saveRename()}>Save</button>
            <button class="secondary" @click=${() => this._cancelRename()}>Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  private async _saveRename(): Promise<void> {
    if (!this._renamePumpId) return;
    const pumpId = this._renamePumpId;
    const name = this._renameValue.trim();
    if (!name) {
      this._error = "Name can't be empty.";
      return;
    }
    this._error = null;
    try {
      const saved = await setName(this._hass!, pumpId, name);
      this._pumpNames = { ...this._pumpNames, [pumpId]: saved };
      this._renamePumpId = null;
    } catch (err) {
      this._error = this._errorMessage(err);
    }
  }

  private _cancelConfirm(): void {
    this._confirm = null;
  }

  // ---- Calibration flow (confirm -> start_calibration -> measure -> apply_calibration) ----
  // sessionId is threaded through as a closure variable from the
  // start_calibration response into the measure prompt's onSave, so
  // it never needs its own top-level piece of card state.

  private _openCalibratePrompt(pumpId: string): void {
    this._confirm = {
      title: `Calibrate ${this._pumpLabel(pumpId)}`,
      message: "This briefly runs the pump so you can measure how much it actually dispenses.",
      confirmLabel: "Start Calibration",
      busy: false,
      onConfirm: async () => {
        try {
          const sessionId = await startCalibration(this._hass!, pumpId);
          this._confirm = null;
          this._openMeasurePrompt(pumpId, sessionId);
        } catch (err) {
          this._confirm = null;
          this._error = this._errorMessage(err);
        }
      },
    };
  }

  private _openMeasurePrompt(pumpId: string, sessionId: number): void {
    this._openPrompt({
      title: `Calibrate ${this._pumpLabel(pumpId)} - measured volume (mL)`,
      initialValue: 0,
      min: 0.01,
      max: 2000,
      step: 0.01,
      unit: "mL",
      saveLabel: "Apply",
      onSave: async (measuredMl) => {
        try {
          await applyCalibration(this._hass!, pumpId, sessionId, measuredMl);
          await this._loadDashboard();
        } catch (err) {
          this._error = this._errorMessage(err);
        }
      },
    });
  }

  // ---- Schedule tab ----------------------------------------------
  // Target-agnostic: the same 24-row editor works for a single pump's
  // own schedule or a group's shared one (requirements.md Section 5 -
  // a group's schedule is pushed identically to every current
  // member). _activeTarget says which; every load/save/auto-divide
  // call below dispatches on its `kind`.

  private _renderSchedule(): TemplateResult {
    const pumpTargets: ScheduleTarget[] = this._config!.pump_ids.map((id) => ({ kind: "pump", id }));
    const groupTargets: ScheduleTarget[] = (this._config!.group_ids ?? []).map((id) => ({ kind: "group", id }));
    const targets = [...pumpTargets, ...groupTargets];

    return html`
      ${targets.length > 1
        ? html`
            <div class="pump-select">
              ${targets.map(
                (target) => html`
                  <div
                    class="pump-chip ${this._isActiveTarget(target) ? "active" : ""}"
                    @click=${() => this._selectTarget(target)}
                  >
                    ${target.kind === "pump" ? this._pumpLabel(target.id) : this._groupLabel(target.id)}
                  </div>
                `,
              )}
            </div>
          `
        : ""}
      ${this._scheduleLoading
        ? html`<div>Loading…</div>`
        : this._scheduleSlots
          ? this._renderScheduleRows(this._scheduleSlots)
          : html`<div>No schedule loaded.</div>`}
    `;
  }

  private _isActiveTarget(target: ScheduleTarget): boolean {
    return this._activeTarget?.kind === target.kind && this._activeTarget.id === target.id;
  }

  // Groups tab's _groups list already carries display names - reused
  // here so a group's schedule tab shows "Complete Parts" rather than
  // its raw id ("complete-parts"). Falls back to the id itself before
  // _loadGroups has resolved yet.
  private _groupLabel(groupId: string): string {
    return this._groups.find((g) => g.id === groupId)?.name ?? groupId;
  }

  // Populated once from reef_dose.get_name (see _loadPumpNames) rather
  // than guessed from a sensor entity_id - confirmed live, 2026-10-06:
  // a renamed/prefixed config entry produces
  // "sensor.extension_pump_1_label" instead of the assumed
  // "sensor.pump_1_label", so entity_id guessing silently fell back to
  // "Pump N" everywhere. Falls back to "Pump N" itself only before
  // _loadPumpNames has resolved, or for an id it didn't return.
  private _pumpLabel(pumpId: string): string {
    return this._pumpNames[pumpId] ?? `Pump ${pumpId}`;
  }

  private _renderScheduleRows(slots: Record<string, number>): TemplateResult {
    const dailyMl = Object.values(slots).reduce((sum, ml) => sum + ml, 0);
    return html`
      <div class="auto-divide">
        <button @click=${() => this._openAutoDividePrompt(dailyMl)}>Auto-Divide Schedule</button>
        <span class="group-meta">Current total: ${dailyMl.toFixed(2)}mL/day</span>
      </div>
      ${HOURS.map((hour) => {
        const ml = slots[hour] ?? 0;
        const editing = this._editingHour === hour;
        return html`
          <div class="row">
            <span class="hour">${hour}:00</span>
            ${editing
              ? html`
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.01"
                    .value=${this._editValue}
                    @input=${(e: InputEvent) => (this._editValue = (e.target as HTMLInputElement).value)}
                  />
                  <div class="actions">
                    <button @click=${() => this._saveSlot(hour)}>Save</button>
                    <button class="secondary" @click=${() => (this._editingHour = null)}>Cancel</button>
                  </div>
                `
              : html`
                  <span class="ml">${ml.toFixed(2)}mL</span>
                  <button class="secondary" @click=${() => this._startEditSlot(hour, ml)}>Edit</button>
                `}
          </div>
        `;
      })}
    `;
  }

  private _selectTarget(target: ScheduleTarget): void {
    this._activeTarget = target;
    this._editingHour = null;
    void this._loadActiveSchedule();
  }

  // Data is only fetched once on initial hass set (see `set hass`) -
  // re-fetch on every tab switch too, so a change made outside this
  // card instance (Developer Tools -> Actions, curl, another browser
  // tab) is picked up without needing to re-add the card.
  private _switchTab(tab: Tab): void {
    this._tab = tab;
    if (tab === "dashboard") void this._loadDashboard();
    else if (tab === "schedule") void this._loadActiveSchedule();
    else void this._loadGroups();
  }

  // ---- Dashboard tab -----------------------------------------------
  // One row per configured pump - remaining/full reservoir volume as a
  // bar, today's running dosed total (the firmware's own 23:59:00-
  // resetting accumulator - see reef-dose's dosed-pump.yaml), and
  // days-left projected from the current schedule, mirroring the old
  // Dosetronic app's dashboard. A pump the service rejects (no product
  // assigned - requireDosedPump) gets a null entry and renders as
  // "no reservoir data" rather than breaking the whole tab.

  private async _loadDashboard(): Promise<void> {
    if (!this._hass || !this._config) return;
    this._reservoirsLoading = true;
    this._error = null;
    const errors: Record<string, string> = {};
    try {
      const entries = await Promise.all(
        this._config.pump_ids.map(async (pumpId) => {
          try {
            return [pumpId, await getReservoir(this._hass!, pumpId)] as const;
          } catch (err) {
            // No product assigned yet, device still starting up, or
            // (confirmed live, 2026-10-05) the get_reservoir service
            // not yet registered because reef-dose-ha hasn't been
            // updated/reloaded - keep the reason per-pump rather than
            // a page-level error, so one bad pump doesn't hide every
            // other row that loaded fine.
            errors[pumpId] = this._errorMessage(err);
            return [pumpId, null] as const;
          }
        }),
      );
      this._reservoirs = Object.fromEntries(entries);
      this._reservoirErrors = errors;
    } catch (err) {
      this._error = this._errorMessage(err);
    } finally {
      this._reservoirsLoading = false;
    }
  }

  private _renderDashboard(): TemplateResult {
    if (this._reservoirsLoading && Object.keys(this._reservoirs).length === 0) {
      return html`<div>Loading…</div>`;
    }
    return html`${this._config!.pump_ids.map((pumpId) => this._renderDashboardRow(pumpId))}`;
  }

  private _renderDashboardRow(pumpId: string): TemplateResult {
    const reservoir = this._reservoirs[pumpId];
    if (!reservoir) {
      const reason = this._reservoirErrors[pumpId] ?? "No reservoir data - no product assigned yet, or device offline.";
      return html`
        <div class="dash-row">
          <div class="dash-name" @click=${() => this._openRenamePrompt(pumpId)}>${this._pumpLabel(pumpId)}</div>
          <div class="dash-meta dash-empty">${reason}</div>
          <div class="actions">
            <button class="secondary" @click=${() => this._primePump(pumpId)}>Prime</button>
            <button class="secondary" @click=${() => this._openManualDosePrompt(pumpId)}>Manual Dose</button>
          </div>
        </div>
      `;
    }
    // The bar is today's dosing progress (how much of today's
    // scheduled total has actually gone out), NOT reservoir level -
    // that's what the ring below is for instead.
    const dosedTodayMl = reservoir.dosedTodayMl ?? 0;
    const dosedTodayPct =
      reservoir.dailyScheduledMl > 0 ? Math.min(100, Math.max(0, (dosedTodayMl / reservoir.dailyScheduledMl) * 100)) : 0;
    const reservoirPct =
      reservoir.fullMl > 0 ? Math.min(100, Math.max(0, (reservoir.remainingMl / reservoir.fullMl) * 100)) : 0;
    return html`
      <div class="dash-row">
        <div class="dash-name" @click=${() => this._openRenamePrompt(pumpId)}>${this._pumpLabel(pumpId)}</div>
        <div class="dash-meta">
          <div class="dash-bar-wrap">
            <div class="dash-bar"><div class="dash-bar-fill" style="width: ${dosedTodayPct}%"></div></div>
            <div class="dash-bar-label">
              ${dosedTodayMl.toFixed(2)} / ${reservoir.dailyScheduledMl.toFixed(2)} mL today
            </div>
            <div class="dash-reservoir-label">
              ${reservoir.remainingMl.toFixed(1)} / ${reservoir.fullMl.toFixed(1)} mL remaining
            </div>
          </div>
          <div class="dash-days">
            <div class="dash-days-ring" style="--dash-pct: ${reservoirPct}">
              <div class="dash-days-circle">${reservoir.daysRemaining ?? "–"}</div>
            </div>
            <div class="dash-days-label">Days Left</div>
          </div>
          <button class="secondary" @click=${() => this._openRefillPrompt(pumpId, reservoir.fullMl)}>Refill</button>
          <button class="secondary" @click=${() => this._openCalibratePrompt(pumpId)}>Calibrate</button>
          <button class="secondary" @click=${() => this._primePump(pumpId)}>Prime</button>
          <button class="secondary" @click=${() => this._openManualDosePrompt(pumpId)}>Manual Dose</button>
        </div>
      </div>
    `;
  }

  // ---- Prime / Manual Dose (Dashboard row buttons) -----------------
  // Prime just fires the firmware's 10s prime pulse - no confirmation,
  // mirroring the old Dosetronic app and the integration's own Prime
  // button entity. Manual Dose asks for an mL amount capped at 50 -
  // ManualDoseDto's own hard max (reef-dose-service), which the
  // firmware independently re-checks - so the popup can't accept a
  // value that's guaranteed to be rejected on save.

  private async _primePump(pumpId: string): Promise<void> {
    this._error = null;
    try {
      await primePump(this._hass!, pumpId);
    } catch (err) {
      this._error = this._errorMessage(err);
    }
  }

  private _openManualDosePrompt(pumpId: string): void {
    this._openPrompt({
      title: `Manual Dose ${this._pumpLabel(pumpId)} (mL)`,
      initialValue: 0,
      min: 0.01,
      max: 50,
      step: 0.01,
      unit: "mL",
      saveLabel: "OK",
      onSave: async (ml) => {
        try {
          await manualDose(this._hass!, pumpId, ml);
          await this._loadDashboard();
        } catch (err) {
          this._error = this._errorMessage(err);
        }
      },
    });
  }

  // Always asks for the new full volume (pre-filled with the current
  // one as a starting point, not silently reused) - reef-dose-service
  // now requires it on every refill, replacing the old behaviour of
  // resetting remainingMl to whatever fullMl happened to already be
  // configured, which let it drift from the real container size.
  private _openRefillPrompt(pumpId: string, currentFullMl: number): void {
    this._openPrompt({
      title: `Refill ${this._pumpLabel(pumpId)} (new full volume, mL)`,
      initialValue: currentFullMl,
      min: 0,
      max: 20000,
      step: 1,
      unit: "mL",
      onSave: async (fullMl) => {
        try {
          await refillReservoir(this._hass!, pumpId, fullMl);
          await this._loadDashboard();
        } catch (err) {
          this._error = this._errorMessage(err);
        }
      },
    });
  }

  private async _loadActiveSchedule(): Promise<void> {
    if (!this._hass || !this._activeTarget) return;
    this._scheduleLoading = true;
    this._error = null;
    try {
      this._scheduleSlots =
        this._activeTarget.kind === "pump"
          ? (await getSchedule(this._hass, this._activeTarget.id)).slots
          : (await getGroupSchedule(this._hass, this._activeTarget.id)).slots;
    } catch (err) {
      this._error = this._errorMessage(err);
    } finally {
      this._scheduleLoading = false;
    }
  }

  private _startEditSlot(hour: string, currentMl: number): void {
    this._editingHour = hour;
    this._editValue = currentMl.toFixed(2);
  }

  private async _saveSlot(hour: string): Promise<void> {
    const value = Number(this._editValue);
    if (!Number.isFinite(value) || value < 0 || value > 50) {
      this._error = "Slot value must be between 0 and 50ml.";
      return;
    }
    this._error = null;
    try {
      const target = this._activeTarget!;
      if (target.kind === "pump") {
        await updateScheduleSlots(this._hass!, target.id, { [hour]: value });
      } else {
        await updateGroupScheduleSlots(this._hass!, target.id, { [hour]: value });
      }
      this._editingHour = null;
      await this._loadActiveSchedule();
    } catch (err) {
      this._error = this._errorMessage(err);
    }
  }

  private _openAutoDividePrompt(currentDailyMl: number): void {
    const target = this._activeTarget!;
    const label = target.kind === "pump" ? this._pumpLabel(target.id) : this._groupLabel(target.id);
    this._openPrompt({
      title: `Auto-Divide ${label} (mL/day)`,
      initialValue: currentDailyMl,
      min: 0,
      max: 1200,
      step: 0.01,
      unit: "mL/day",
      onSave: async (value) => {
        try {
          if (target.kind === "pump") {
            await autoDivideSchedule(this._hass!, target.id, value);
          } else {
            await autoDivideGroupSchedule(this._hass!, target.id, value);
          }
          await this._loadActiveSchedule();
        } catch (err) {
          this._error = this._errorMessage(err);
        }
      },
    });
  }

  // ---- Groups tab -------------------------------------------------

  private _renderGroups(): TemplateResult {
    return html`
      ${this._groupsLoading ? html`<div>Loading…</div>` : this._groups.map((group) => this._renderGroup(group))}
      ${this._showNewGroupForm ? this._renderNewGroupForm() : html`<button @click=${() => (this._showNewGroupForm = true)}>+ New Group</button>`}
    `;
  }

  private _renderGroup(group: GroupRecord): TemplateResult {
    const editing = this._editingGroupId === group.id;
    return html`
      <div class="group-card">
        <div class="group-header">
          <strong>${group.name}</strong>
        </div>
        <div class="group-meta">id: ${group.id} · members: ${group.pumpIds.map((id) => this._pumpLabel(id)).join(", ") || "none"}</div>
        ${editing
          ? html`
              <div class="checkbox-list">
                ${ALL_PUMP_IDS.map(
                  (id) => html`
                    <label>
                      <input
                        type="checkbox"
                        .checked=${this._editGroupPumpIds.has(id)}
                        @change=${(e: Event) => this._toggleEditPump(id, (e.target as HTMLInputElement).checked)}
                      />
                      ${this._pumpLabel(id)}
                    </label>
                  `,
                )}
              </div>
              <div class="actions">
                <button @click=${() => this._saveGroupMembership(group.id)}>Save</button>
                <button class="secondary" @click=${() => (this._editingGroupId = null)}>Cancel</button>
              </div>
            `
          : html`
              <div class="actions">
                <button class="secondary" @click=${() => this._startEditGroup(group)}>Edit Membership</button>
                <button @click=${() => this._openAdjustmentPrompt(group)}>Manual Overall Adjustment</button>
                <button class="danger" @click=${() => this._confirmRemoveGroup(group)}>Delete</button>
              </div>
            `}
      </div>
    `;
  }

  private _renderNewGroupForm(): TemplateResult {
    return html`
      <div class="group-card">
        <input
          type="text"
          placeholder="group-id"
          .value=${this._newGroupId}
          @input=${(e: InputEvent) => (this._newGroupId = (e.target as HTMLInputElement).value)}
        />
        <input
          type="text"
          placeholder="Display name"
          .value=${this._newGroupName}
          @input=${(e: InputEvent) => (this._newGroupName = (e.target as HTMLInputElement).value)}
        />
        <div class="checkbox-list">
          ${ALL_PUMP_IDS.map(
            (id) => html`
              <label>
                <input
                  type="checkbox"
                  .checked=${this._newGroupPumpIds.has(id)}
                  @change=${(e: Event) => this._toggleNewPump(id, (e.target as HTMLInputElement).checked)}
                />
                ${this._pumpLabel(id)}
              </label>
            `,
          )}
        </div>
        <div class="actions">
          <button @click=${() => this._createGroup()}>Create</button>
          <button class="secondary" @click=${() => (this._showNewGroupForm = false)}>Cancel</button>
        </div>
      </div>
    `;
  }

  private _toggleNewPump(id: string, checked: boolean): void {
    const next = new Set(this._newGroupPumpIds);
    if (checked) next.add(id);
    else next.delete(id);
    this._newGroupPumpIds = next;
  }

  private _toggleEditPump(id: string, checked: boolean): void {
    const next = new Set(this._editGroupPumpIds);
    if (checked) next.add(id);
    else next.delete(id);
    this._editGroupPumpIds = next;
  }

  private _startEditGroup(group: GroupRecord): void {
    this._editingGroupId = group.id;
    this._editGroupPumpIds = new Set(group.pumpIds);
  }

  // Opens the shared prompt modal for a group's delta-based "Manual
  // Overall Adjustment" (requirements.md Section 5, matching the
  // existing Dosetronic app's name for this exact action) - -10
  // decreases the group's CURRENT scale by 10% (compounding, like any
  // "adjust by X%" control), not a target value to type directly. The
  // compounding math is done server-side (apply_group_adjustment),
  // not here against group.scalePercent - that value is a snapshot
  // from whenever this card last fetched it (at most recent tab
  // switch, per _loadGroups), and computing against a stale snapshot
  // silently applies the wrong delta if the group changed out-of-band
  // in between (confirmed live, 2026-10-05).
  private _openAdjustmentPrompt(group: GroupRecord): void {
    this._openPrompt({
      title: `Manual Overall Adjustment — ${group.name} (%)`,
      initialValue: 0,
      min: -100,
      max: 1000,
      step: 1,
      unit: "%",
      onSave: async (delta) => {
        try {
          await applyGroupAdjustment(this._hass!, group.id, delta);
          await this._loadGroups();
        } catch (err) {
          this._error = this._errorMessage(err);
        }
      },
    });
  }

  private async _loadGroups(): Promise<void> {
    if (!this._hass) return;
    this._groupsLoading = true;
    this._error = null;
    try {
      this._groups = await getGroups(this._hass);
    } catch (err) {
      this._error = this._errorMessage(err);
    } finally {
      this._groupsLoading = false;
    }
  }

  private async _createGroup(): Promise<void> {
    if (!this._newGroupId || !this._newGroupName) {
      this._error = "Group id and name are both required.";
      return;
    }
    this._error = null;
    try {
      await createGroup(this._hass!, this._newGroupId, this._newGroupName, [...this._newGroupPumpIds]);
      this._showNewGroupForm = false;
      this._newGroupId = "";
      this._newGroupName = "";
      this._newGroupPumpIds = new Set();
      await this._loadGroups();
    } catch (err) {
      this._error = this._errorMessage(err);
    }
  }

  private async _saveGroupMembership(groupId: string): Promise<void> {
    this._error = null;
    try {
      await updateGroup(this._hass!, groupId, { pumpIds: [...this._editGroupPumpIds] });
      this._editingGroupId = null;
      await this._loadGroups();
    } catch (err) {
      this._error = this._errorMessage(err);
    }
  }

  // Confirmed live this was too easy to hit by accident: Delete sits
  // right next to Edit Membership/Manual Overall Adjustment at equal
  // visual weight, no confirmation, and deleting a group un-tracks
  // its members from any future rescaling with no undo. A native
  // confirm() is minimal but was previously entirely absent.
  private _confirmRemoveGroup(group: GroupRecord): void {
    const memberList = group.pumpIds.map((id) => this._pumpLabel(id)).join(", ") || "no members";
    if (window.confirm(`Delete group "${group.name}"? Members (${memberList}) keep dosing whatever they're currently set to, but will no longer be kept in sync with each other.`)) {
      void this._removeGroup(group.id);
    }
  }

  private async _removeGroup(groupId: string): Promise<void> {
    this._error = null;
    try {
      await deleteGroup(this._hass!, groupId);
      await this._loadGroups();
    } catch (err) {
      this._error = this._errorMessage(err);
    }
  }

  // ---- Shared -------------------------------------------------------

  private _errorMessage(err: unknown): string {
    // HA surfaces a service handler's HomeAssistantError (see
    // reef-dose-ha's services.py) as a rejected promise whose
    // `.message` is already the clean text that error carried.
    if (err instanceof Error) return err.message;
    // hass.connection.sendMessagePromise (used for every response-
    // carrying call, see reef-dose-api.ts) rejects with the raw WS
    // error frame on failure - a plain {code, message} object, NOT an
    // Error instance. String(plainObject) gives the useless
    // "[object Object]" (confirmed live) unless this is unwrapped
    // explicitly first.
    if (err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string") {
      return (err as { message: string }).message;
    }
    return String(err);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "reef-dose-card": ReefDoseCard;
  }
}

// Registers with Lovelace's card picker (optional, but makes the card
// discoverable in the UI editor instead of YAML-only).
(window as unknown as { customCards: unknown[] }).customCards = [
  ...((window as unknown as { customCards?: unknown[] }).customCards ?? []),
  {
    type: "reef-dose-card",
    name: "Reef Dose Card",
    description: "Per-slot schedule editor and scaling-group management for reef-dose.",
  },
];
