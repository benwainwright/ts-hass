import { ClimateState } from "./states/climate-state";

export interface EntityMap {
  climate: {
    id: `climate.${string}`;
    state: ClimateState;
  };
}
