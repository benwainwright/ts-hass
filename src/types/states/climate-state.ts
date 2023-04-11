import { BaseState } from "@types";

export interface ClimateState extends BaseState {
  state: "heat" | "cool" | "off";
  entity_id: `climate.${string}`;
  attributes?: Partial<{
    hvac_modes: string[];
    min_temp: number;
    max_temp: number;
    target_temp_stemp: number;
    preset_modes: string[];
    current_temperature: number;
    temperature: number;
    hvac_action: string;
    preset_mode: string;
    icon: string;
    friendly_name: string;
    supported_features: number;
  }>;
}
