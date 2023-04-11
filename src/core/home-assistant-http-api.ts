import { HassConfig } from "@types";
import fetch from "node-fetch-commonjs";

type HttpMethod = "GET" | "POST";

export class HomeAssistantHttpApi {
  public constructor(private hassConfig: HassConfig) {}

  private async request<T, B>(method: HttpMethod, path: string, body?: B) {
    const normalisedHost = this.hassConfig.host.endsWith("/")
      ? this.hassConfig.host.slice(0, -1)
      : this.hassConfig.host;

    const normalisedPath = path.startsWith("/") ? path.slice(1) : path;

    const url = `${normalisedHost}/${normalisedPath}`;

    const response = await fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${this.hassConfig.token}`,
      },
    });

    (await response.json()) as T;
  }

  public async get<T>(path: string) {
    return this.request<T, {}>("GET", path);
  }

  public async post<T, B>(path: string, body: B) {
    return this.request<T, B>("POST", path, body);
  }
}
