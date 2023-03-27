import { getEnv } from "@utils";
import { HassConfig } from "@types";
import {
  HASS_HOST_ENV,
  HASS_PATH_ENV,
  HASS_PORT_ENV,
  HASS_TOKEN_ENV,
  SUPERVISOR_TOKEN_ENV,
} from "./constants";

import dotEnv from "dotenv";

/**
 * Get config from execution environment
 *
 * Note, if called as part of a Home Assistant addon, you don't need
 * to explicitly supply any environment variables
 */
export const getConfig = (): HassConfig => {
  dotEnv.config();
  const supervisorToken = process.env[SUPERVISOR_TOKEN_ENV];

  const path = supervisorToken
    ? `/core/websocket`
    : process.env[HASS_PATH_ENV] ?? `/api/websocket`;

  const host = supervisorToken ? `supervisor` : getEnv(HASS_HOST_ENV);
  const port = supervisorToken ? undefined : process.env[HASS_PORT_ENV] ?? 8123;
  const token = supervisorToken || getEnv(HASS_TOKEN_ENV);

  return { host, port: port ? Number(port) : undefined, token, path };
};
