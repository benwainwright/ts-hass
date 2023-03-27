import { Client } from "./client";

export interface ServiceCommandMap {
  "climate.set_hvac_mode": {
    entity_id?: string;
    hvac_mode: string;
  };
  "climate.set_preset_mode": {
    entity_id?: string;
    preset_mode: string;
  };
  "climate.set_aux_heat": {
    entity_id?: string;
    aux_heat: string;
  };
  "climate.set_temperature": {
    entity_id?: string;
    temperature?: number;
    target_temp_high?: number;
    target_temp_low?: number;
    hvac_mode?: string;
  };
}

export class ServiceCommand<I extends keyof ServiceCommandMap> {
  constructor(private id: I, private client: Client) {}

  public async call(fields: ServiceCommandMap[I]) {
    const [domain, service] = this.id.split(".");
    await this.client.callService(domain, service, fields);
  }
}
