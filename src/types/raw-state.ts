import { State } from "./state";

export type RawState = State & {
  last_changed: string;
  last_updated: string;
};
