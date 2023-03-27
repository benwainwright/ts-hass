import { BaseState } from "./base-state";

export interface LightState extends BaseState {
  entity_id: `light.${string}`;
}
