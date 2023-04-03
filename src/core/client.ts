import { FIVE_MINUTES } from "./constants";
import { HomeAssistantApi } from "./home-assistant-api";
import { HassConfig, Logger, RawState, State, StateChangedEvent } from "@types";
import { removeItemAtIndex } from "@utils";
import { getConfig } from "./get-config";
import { EntityType, IdType } from "../types/entity";
import { Calendar, Climate } from "@entities";

type StateLoadCallback = (state: State) => void;
type StateChangedCallback = (oldState: State, newState: State) => void;

export class Client {
  private hassApi: HomeAssistantApi;
  private states: Map<string, State> = new Map<string, State>();
  private timers: NodeJS.Timer[] = [];

  private stateLoadCallbacks: Map<string, StateLoadCallback[]> = new Map<
    string,
    StateLoadCallback[]
  >();

  private stateChangedCallbacks: Map<string, StateChangedCallback[]> = new Map<
    string,
    StateChangedCallback[]
  >();

  /**
   * Create a new Hass client instance.
   */
  public static async start(logger: Logger) {
    const config = getConfig();
    const client = new Client(config, logger);
    await client.init();
    return client;
  }

  public getEntity<T extends IdType>(id: T): EntityType<T> {
    if (Climate.isId(id)) {
      return new Climate<`climate.${string}`>(id, this) as EntityType<T>;
    }

    if (Calendar.isId(id)) {
      return new Calendar<`calendar.${string}`>(id, this) as EntityType<T>;
    }

    throw new Error("Unrecognised ID");
  }

  private constructor(private hassConfig: HassConfig, private logger: Logger) {
    this.hassApi = new HomeAssistantApi(this.hassConfig);

    const loadStateTimers = setInterval(async () => {
      await this.loadStates();
    }, FIVE_MINUTES);

    this.timers.push(loadStateTimers);
  }

  public onStateLoaded(entityId: string, callback: StateLoadCallback) {
    const storedCallbacks = this.stateLoadCallbacks.get(entityId);

    this.stateLoadCallbacks.set(entityId, [
      ...(storedCallbacks ?? []),
      callback,
    ]);
  }

  private stateChangedListener(event: StateChangedEvent) {
    const callbacks = this.stateChangedCallbacks.get(event.data.entity_id);
    callbacks?.forEach((callback) =>
      callback(event.data.old_state, event.data.new_state)
    );
  }

  public onStateChanged(entityId: string, callback: StateChangedCallback) {
    const storedCallbacks = this.stateLoadCallbacks.get(entityId);
    this.stateChangedCallbacks.set(entityId, [
      ...(storedCallbacks ?? []),
      callback,
    ]);
  }

  public async callService<F>(domain: string, service: string, fields?: F) {
    await this.hassApi.get.callService(domain, service, fields);
  }

  public removeStateChangedCallback(
    entityId: string,
    callback: StateChangedCallback
  ) {
    const storedCallbacks = this.stateChangedCallbacks.get(entityId);
    if (storedCallbacks) {
      const index = storedCallbacks.findIndex((needle) => needle === callback);
      this.stateChangedCallbacks.set(
        entityId,
        removeItemAtIndex(storedCallbacks, index)
      );
    }
  }

  public removeOnStateLoadedCallback(
    entityId: string,
    callback: StateLoadCallback
  ) {
    const storedCallbacks = this.stateLoadCallbacks.get(entityId);
    if (storedCallbacks) {
      const index = storedCallbacks.findIndex((needle) => needle === callback);
      this.stateLoadCallbacks.set(
        entityId,
        removeItemAtIndex(storedCallbacks, index)
      );
    }
  }

  private parseState(state: RawState): State {
    return {
      ...state,
      last_changed: new Date(state.last_changed),
      last_updated: new Date(state.last_updated),
    };
  }

  private async loadStates() {
    this.logger.debug(`Loading states`);
    const states: RawState[] = await this.hassApi.get.getStates();
    const stateMap = new Map<string, State>();
    states
      .map((state) => this.parseState(state))
      .forEach((state) => {
        stateMap.set(state.entity_id, state);
        const callbacks = this.stateLoadCallbacks.get(state.entity_id);
        callbacks?.forEach((callback) => callback(state));
      });

    this.logger.debug(`Finished loading states`);
    this.states = stateMap;
  }

  public close() {
    this.hassApi.close();
    this.timers.forEach((timer) => clearInterval(timer));
    this.logger.info(`Hass client closed`);
  }

  public async init() {
    await this.hassApi.init();
    this.hassApi.get.on("state_changed", (event) => {
      try {
        this.stateChangedListener(event);
      } catch (error) {
        if (error instanceof Error) {
          this.logger.error(error.message);
        }
      }
    });
    await this.loadStates();
    this.logger.info("Hass client initialised");
  }

  public cachedStates() {
    return this.states;
  }
}
