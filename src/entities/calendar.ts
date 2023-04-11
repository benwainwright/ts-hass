import { Client, BaseEntity } from "@core";
import { CalendarEvent, CalendarState } from "@types";
import { IdType } from "../types/entity";

type StartEventCallback = (eventDetails: CalendarEvent) => void;
type FinishEventCallback = () => void;

export class Calendar<I extends `calendar.${string}`> {
  private entity: BaseEntity<I, CalendarState>;

  constructor(private id: I, client: Client) {
    this.entity = new BaseEntity(this.id, client);
  }

  public static isId(id: IdType): id is `calendar.${string}` {
    return id.startsWith("calendar.");
  }

  isEventCurrentlyHappening() {
    return this.entity.state.state === "on";
  }

  get currentEvent() {
    if (this.entity.state.entity_id !== this.id) {
      throw new Error("State id did not match id. Something has gone wrong");
    }
    return this.parseAttributes(this.entity.state.attributes);
  }

  private parseAttributes(
    attributes: CalendarState["attributes"]
  ): CalendarEvent {
    return {
      ...attributes,
      message: attributes?.message ?? "",
      description: attributes?.description ?? "",
      location: attributes?.location ?? "",
      start: new Date(attributes?.start_time ?? 0),
      end: new Date(attributes?.end_time ?? 0),
    };
  }

  public onStartEvent(callback: StartEventCallback) {
    this.entity.onStateChanged((oldState, newState) => {
      if (oldState.state === "off" && newState.state === "on") {
        if (newState.entity_id === this.id) {
          callback(this.parseAttributes(newState.attributes));
        }
      }
    });
  }

  public onFinishEvent(callback: FinishEventCallback) {
    this.entity.onStateChanged((oldState, newState) => {
      if (oldState.state === "on" && newState.state === "off") {
        callback();
      }
    });
  }
}
