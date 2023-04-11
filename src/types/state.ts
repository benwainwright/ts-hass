import { Expand, IdType } from "@types";
import { CalendarState } from "./states/calendar-state";
import { ClimateState } from "./states/climate-state";
import { LightState } from "./states/light-state";
import { SwitchState } from "./states/switch-state";

export type State = CalendarState | LightState | ClimateState | SwitchState;

type MatchingState<T extends IdType, S extends State> = S extends {
  entity_id: infer ID;
}
  ? T extends ID
    ? S
    : never
  : never;

export type StateForId<T extends IdType> = Expand<MatchingState<T, State>>;

type bar = StateForId<`switch.foo`>;
