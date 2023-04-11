import { HassConfig, Logger } from "@types";
import fetch from "node-fetch-commonjs";

type HttpMethod = "GET" | "POST";

export class HomeAssistantHttpApi {
  public constructor(private hassConfig: HassConfig) {}

  private async request<T, B>(method: HttpMethod, path: string, body?: B) {
    const normalisedHost = this.hassConfig.host.endsWith("/")
      ? this.hassConfig.host.slice(0, -1)
      : this.hassConfig.host;

    const normalisedPath = path.startsWith("/") ? path.slice(1) : path;

    const url = `http://${normalisedHost}${this.hassConfig.httpPath}/${normalisedPath}`;
    const params = {
      method,
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${this.hassConfig.token}`,
      },
    };

    console.log(params);
    const response = await fetch(url, params);
    console.log(response.text());
    return (await response.json()) as T;
  }

  public async get<T>(path: string) {
    return await this.request<T, {}>("GET", path);
  }

  public async post<T, B>(path: string, body: B) {
    return await this.request<T, B>("POST", path, body);
  }
}
