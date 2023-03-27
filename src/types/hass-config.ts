export interface HassConfig {
  /**
   * Home Assistant host
   */
  host: string;

  /**
   * Home Assistant port
   */
  port?: number;

  /**
   * Home assistant token
   */
  token: string;

  /**
   * Path to Websocket API
   */
  path: string;
}
