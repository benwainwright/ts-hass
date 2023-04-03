import { Client, BaseEntity } from "@core";
import { ClimateState } from "../types/climate-state";
import { ServiceCommand } from "../core/service-command";
import { IdTypes } from "src/types/entity";

type StateChangeCallback = (
  oldState: ClimateState,
  newState: ClimateState
) => void;

type SetTemperatureArgs = {
  temperature?: number;
  target_temp_high?: number;
  target_temp_low?: number;
  hvac_mode?: string;
};

export class Climate<I extends `climate.${string}`> {
  private entity: BaseEntity<I>;
  private setHvacModeCommand: ServiceCommand<"climate.set_hvac_mode">;
  private setPresetModeCommand: ServiceCommand<"climate.set_preset_mode">;
  private setAuxHeatCommand: ServiceCommand<"climate.set_aux_heat">;
  private setTemperatureCommand: ServiceCommand<"climate.set_temperature">;

  constructor(private id: I, client: Client) {
    this.entity = new BaseEntity(this.id, client);

    this.setAuxHeatCommand = new ServiceCommand("climate.set_aux_heat", client);

    this.setHvacModeCommand = new ServiceCommand(
      "climate.set_hvac_mode",
      client
    );

    this.setPresetModeCommand = new ServiceCommand(
      "climate.set_preset_mode",
      client
    );

    this.setTemperatureCommand = new ServiceCommand(
      "climate.set_temperature",
      client
    );
  }

  public static isId<T extends IdTypes>(id: T): id is `climate.${string}` {
    return id.startsWith("climate.");
  }

  public async setTemperature(args: SetTemperatureArgs) {
    this.setTemperatureCommand.call({ ...args, entity_id: this.id });
  }

  public async setAuxHeat(auxHeat: string) {
    this.setAuxHeatCommand.call({
      entity_id: this.id,
      aux_heat: auxHeat,
    });
  }

  public async setHvacMode(mode: string) {
    this.setHvacModeCommand.call({
      entity_id: this.id,
      hvac_mode: mode,
    });
  }

  public async setPresetMode(mode: string) {
    this.setPresetModeCommand.call({
      entity_id: this.id,
      preset_mode: mode,
    });
  }

  public onStateChange(callback: StateChangeCallback) {
    this.entity.onStateChanged((oldState, newState) => {
      if (oldState.entity_id === this.id && newState.entity_id === this.id) {
        callback(oldState, newState);
      }
    });
  }
}
