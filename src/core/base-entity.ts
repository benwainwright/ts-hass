import { Client } from "./client";
import { EntityConfig, State } from "@types";

export class BaseEntity<I extends string, SM = {}> {
  private _state: State;
  private stateLoadedListener = this.onStateLoaded.bind(this);

  constructor(
    private id: I,
    private client: Client,
    private config: EntityConfig = { allowNotPresent: false }
  ) {
    this.client.onStateLoaded(this.id, this.stateLoadedListener);
    const state = this.client.cachedStates().get(this.id);

    this.client.onStateChanged(id, (_, newState) => {
      this._state = newState;
    });

    if (!state && this.config.default && this.config.allowNotPresent) {
      this._state = this.config.default;
      return;
    }

    if (!this.config.default && this.config.allowNotPresent) {
      throw new Error(
        "You cannot configure an an entity with 'allowNotPresent' without configuring a default state"
      );
    }

    if (!state) {
      throw new Error(
        "State could not be loaded. That means either the entity id is wrong, or the client has not been initialised"
      );
    }

    this._state = state;
  }

  public async callService<S extends keyof SM>(service: S, fields: SM[S]) {
    const [domain] = this.id.split(".");
    await this.client.callService(domain, service as string, fields);
  }

  public onStateChanged(callback: (oldState: State, newState: State) => void) {
    this.client.onStateChanged(this.id, callback);
  }

  get state(): State {
    return this._state;
  }

  private onStateLoaded(state: State) {
    this._state = state;
    this.client.removeOnStateLoadedCallback(this.id, this.stateLoadedListener);
  }

  stateListener() {}
}
