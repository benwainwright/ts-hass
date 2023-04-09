import { CalendarState } from "./states/calendar-state";
import { ClimateState } from "./states/climate-state";
import { LightState } from "./states/light-state";
import { SwitchState } from "./states/switch-state";

export type State = CalendarState | LightState | ClimateState | SwitchState;
