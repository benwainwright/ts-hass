import { BaseState } from "./base-state";

export interface CalendarState extends BaseState {
  state: "on" | "off";
  entity_id: `calendar.${string}`;
  attributes: {
    message: string;
    all_day: boolean;
    start_time: string;
    end_time: string;
    location: string;
    description: string;
    offset_reached: boolean;
    friendly_name: string;
    supported_features: number;
  };
}
