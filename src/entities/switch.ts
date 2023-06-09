import { BaseEntity, Client } from "@core";
import { IdType, SwitchState } from "@types";

interface SwitchServiceMap {
  turn_on: {
    entity_id?: string;
  };
  turn_off: {
    entity_id?: string;
  };
  toggle: {
    entity_id?: string;
  };
}

type StateChangeCallback = (
  oldState: SwitchState,
  newState: SwitchState
) => void;

export class Switch<I extends `switch.${string}`> {
  private entity: BaseEntity<I, SwitchState, SwitchServiceMap>;

  constructor(private id: I, client: Client) {
    this.entity = new BaseEntity(this.id, client);
  }

  public static isId(id: IdType): id is `switch.${string}` {
    return id.startsWith("switch.");
  }

  public async turnOn() {
    await this.entity.setState({
      state: "on",
    });
  }

  public get state() {
    return this.entity.state;
  }

  public async turnOff() {
    await this.entity.setState({
      state: "off",
    });
  }

  public async toggle() {
    await this.entity.callService("toggle", {
      entity_id: this.id,
    });
  }

  public onStateChange(callback: StateChangeCallback) {
    this.entity.onStateChanged((oldState, newState) => {
      if (oldState.entity_id === this.id && newState.entity_id === this.id) {
        callback(oldState, newState);
      }
    });
  }
}
