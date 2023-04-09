import hass, { HassApi, HassWsOptions } from "homeassistant-ws";
import WebSocket from "isomorphic-ws";
import { HassConfig } from "../types/hass-config";

export class HomeAssistantApi {
  private hassApi: HassApi | undefined;

  public constructor(private hassConfig: HassConfig) {}

  public get websocket() {
    if (!this.hassApi) {
      throw new Error("Hass API has not been initialised. Please call .init()");
    }

    return this.hassApi;
  }

  public close() {
    this.hassApi = undefined;
  }

  public async init() {
    if (!this.hassApi) {
      const ws = !this.hassConfig.port
        ? {
            ws: (opts: HassWsOptions) => {
              return new WebSocket(
                `${opts.protocol}://${opts.host}${opts.path}`
              );
            },
          }
        : {};

      this.hassApi = await hass({
        host: this.hassConfig.host,
        token: this.hassConfig.token,
        port: this.hassConfig.port,
        path: this.hassConfig.path,
        ...ws,
      });
    }
  }
}
