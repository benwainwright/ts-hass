import { BaseState } from "../base-state";

export interface InputBooleanState extends BaseState {
  entity_id: `input_boolean..${string}`;
  state: "on" | "off";
  attributes?: Partial<{
    icon: string;
    friendly_name: string;
  }>;
}
