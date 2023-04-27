import { BaseEntity, Client } from "@core";
import { IdType, InputBooleanState } from "@types";

interface InputBooleanServiceMap {
  turn_on: {
    entity_id?: string;
    area_id?: string;
  };
  turn_off: {
    entity_id?: string;
    area_id?: string;
  };
  toggle: {
    entity_id?: string;
    area_id?: string;
  };
  reload: {};
}

type StateChangeCallback = (
  oldState: InputBooleanState,
  newState: InputBooleanState
) => void;

export class InputBoolean<I extends `input_boolean.${string}`> {
  private entity: BaseEntity<I, InputBooleanState, InputBooleanServiceMap>;

  constructor(private id: I, client: Client) {
    this.entity = new BaseEntity(this.id, client);
  }

  public static isId(id: IdType): id is `input_boolean.${string}` {
    return id.startsWith("input_boolean.");
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
