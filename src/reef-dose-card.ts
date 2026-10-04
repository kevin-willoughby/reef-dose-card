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
  autoDivideSchedule,
  createGroup,
  deleteGroup,
  getGroups,
  getSchedule,
  updateGroup,
  updateScheduleSlots,
} from "./reef-dose-api";
import { HOURS, type CardConfig, type GroupRecord, type HomeAssistant, type ScheduleResponse } from "./types";

type Tab = "schedule" | "groups";

@customElement("reef-dose-card")
export class ReefDoseCard extends LitElement {
  private _hass?: HomeAssistant;
  private _config?: CardConfig;

  @state() private _tab: Tab = "schedule";
  @state() private _activePumpId = "";
  @state() private _schedule: ScheduleResponse | null = null;
  @state() private _scheduleLoading = false;
  @state() private _editingHour: string | null = null;
  @state() private _editValue = "";
  @state() private _dailyTotal = "";
  @state() private _groups: GroupRecord[] = [];
  @state() private _groupsLoading = false;
  @state() private _showNewGroupForm = false;
  @state() private _newGroupId = "";
  @state() private _newGroupName = "";
  @state() private _newGroupPumpIds = new Set<string>();
  @state() private _editingGroupId: string | null = null;
  @state() private _editGroupPumpIds = new Set<string>();
  @state() private _editGroupScale = "";
  @state() private _error: string | null = null;

  setConfig(config: CardConfig): void {
    if (!config.pump_ids || !Array.isArray(config.pump_ids) || config.pump_ids.length === 0) {
      throw new Error("reef-dose-card: config.pump_ids must be a non-empty array of pump ids, e.g. ['1', '4']");
    }
    this._config = config;
    if (!this._activePumpId) {
      this._activePumpId = config.pump_ids[0];
    }
  }

  set hass(hass: HomeAssistant) {
    const firstSet = !this._hass;
    this._hass = hass;
    if (firstSet) {
      void this._loadSchedule();
      void this._loadGroups();
    }
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
  `;

  render(): TemplateResult {
    if (!this._config) return html``;

    return html`
      <ha-card header=${this._config.title ?? "Reef Dose"}>
        <div style="padding: 0 16px 16px">
          ${this._error ? html`<div class="error">${this._error}</div>` : ""}
          <div class="tabs">
            <div class="tab ${this._tab === "schedule" ? "active" : ""}" @click=${() => this._switchTab("schedule")}>
              Schedule
            </div>
            <div class="tab ${this._tab === "groups" ? "active" : ""}" @click=${() => this._switchTab("groups")}>
              Groups
            </div>
          </div>
          ${this._tab === "schedule" ? this._renderSchedule() : this._renderGroups()}
        </div>
      </ha-card>
    `;
  }

  // ---- Schedule tab ----------------------------------------------

  private _renderSchedule(): TemplateResult {
    const pumpIds = this._config!.pump_ids;
    return html`
      ${pumpIds.length > 1
        ? html`
            <div class="pump-select">
              ${pumpIds.map(
                (id) => html`
                  <div
                    class="pump-chip ${id === this._activePumpId ? "active" : ""}"
                    @click=${() => this._selectPump(id)}
                  >
                    Pump ${id}
                  </div>
                `,
              )}
            </div>
          `
        : ""}
      ${this._scheduleLoading
        ? html`<div>Loading…</div>`
        : this._schedule
          ? this._renderScheduleRows(this._schedule)
          : html`<div>No schedule loaded.</div>`}
    `;
  }

  private _renderScheduleRows(schedule: ScheduleResponse): TemplateResult {
    const dailyMl = Object.values(schedule.slots).reduce((sum, ml) => sum + ml, 0);
    return html`
      <div class="auto-divide">
        <input
          type="number"
          min="0"
          max="1200"
          step="0.01"
          placeholder="Daily total ml"
          .value=${this._dailyTotal}
          @input=${(e: InputEvent) => (this._dailyTotal = (e.target as HTMLInputElement).value)}
        />
        <button @click=${() => this._applyAutoDivide()}>Auto-Divide</button>
        <span class="group-meta">Current total: ${dailyMl.toFixed(2)}mL/day</span>
      </div>
      ${HOURS.map((hour) => {
        const ml = schedule.slots[hour] ?? 0;
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

  private _selectPump(pumpId: string): void {
    this._activePumpId = pumpId;
    this._editingHour = null;
    void this._loadSchedule();
  }

  // Data is only fetched once on initial hass set (see `set hass`) -
  // re-fetch on every tab switch too, so a change made outside this
  // card instance (Developer Tools -> Actions, curl, another browser
  // tab) is picked up without needing to re-add the card.
  private _switchTab(tab: Tab): void {
    this._tab = tab;
    if (tab === "schedule") void this._loadSchedule();
    else void this._loadGroups();
  }

  private async _loadSchedule(): Promise<void> {
    if (!this._hass || !this._activePumpId) return;
    this._scheduleLoading = true;
    this._error = null;
    try {
      this._schedule = await getSchedule(this._hass, this._activePumpId);
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
      await updateScheduleSlots(this._hass!, this._activePumpId, { [hour]: value });
      this._editingHour = null;
      await this._loadSchedule();
    } catch (err) {
      this._error = this._errorMessage(err);
    }
  }

  private async _applyAutoDivide(): Promise<void> {
    const value = Number(this._dailyTotal);
    if (!Number.isFinite(value) || value < 0 || value > 1200) {
      this._error = "Daily total must be between 0 and 1200ml.";
      return;
    }
    this._error = null;
    try {
      await autoDivideSchedule(this._hass!, this._activePumpId, value);
      await this._loadSchedule();
    } catch (err) {
      this._error = this._errorMessage(err);
    }
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
          <span class="group-meta">${group.scalePercent}%</span>
        </div>
        <div class="group-meta">id: ${group.id} · members: ${group.pumpIds.map((id) => `Pump ${id}`).join(", ") || "none"}</div>
        ${editing
          ? html`
              <div class="checkbox-list">
                ${this._config!.pump_ids.map(
                  (id) => html`
                    <label>
                      <input
                        type="checkbox"
                        .checked=${this._editGroupPumpIds.has(id)}
                        @change=${(e: Event) => this._toggleEditPump(id, (e.target as HTMLInputElement).checked)}
                      />
                      Pump ${id}
                    </label>
                  `,
                )}
              </div>
              <input
                type="number"
                min="0"
                max="1000"
                .value=${this._editGroupScale}
                @input=${(e: InputEvent) => (this._editGroupScale = (e.target as HTMLInputElement).value)}
              />
              <div class="actions">
                <button @click=${() => this._saveGroup(group.id)}>Save</button>
                <button class="secondary" @click=${() => (this._editingGroupId = null)}>Cancel</button>
              </div>
            `
          : html`
              <div class="actions">
                <button class="secondary" @click=${() => this._startEditGroup(group)}>Edit</button>
                <button class="danger" @click=${() => this._removeGroup(group.id)}>Delete</button>
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
          ${this._config!.pump_ids.map(
            (id) => html`
              <label>
                <input
                  type="checkbox"
                  .checked=${this._newGroupPumpIds.has(id)}
                  @change=${(e: Event) => this._toggleNewPump(id, (e.target as HTMLInputElement).checked)}
                />
                Pump ${id}
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
    this._editGroupScale = String(group.scalePercent);
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

  private async _saveGroup(groupId: string): Promise<void> {
    const scale = Number(this._editGroupScale);
    if (!Number.isFinite(scale) || scale < 0 || scale > 1000) {
      this._error = "Scale must be between 0 and 1000%.";
      return;
    }
    this._error = null;
    try {
      await updateGroup(this._hass!, groupId, {
        pumpIds: [...this._editGroupPumpIds],
        scalePercent: scale,
      });
      this._editingGroupId = null;
      await this._loadGroups();
    } catch (err) {
      this._error = this._errorMessage(err);
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
    // `.message` is already the clean text that error carried - no
    // further unwrapping needed.
    return err instanceof Error ? err.message : String(err);
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
