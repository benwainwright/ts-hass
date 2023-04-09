import { BaseState } from "../base-state";

export interface SwitchState extends BaseState {
  entity_id: `switch.${string}`;
  state: "on" | "off";
  attributes: {
    icon: string;
    friendly_name: string;
  };
}
