import { State } from "./state";

export interface EntityConfig {
  allowNotPresent: boolean;
  default?: State;
}
