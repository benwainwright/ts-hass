import { State } from "./state";

export interface StateChangedEvent {
  event_type: "state_changed";
  data: {
    entity_id: string;
    old_state: State;
    new_state: State;
  };
}
