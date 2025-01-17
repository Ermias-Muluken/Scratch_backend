import { BaseEnergySource } from '../base/index.js';

export class BatterySource extends BaseEnergySource {
  constructor(core, config) {
    super(core, config);
    this.charge_level = 100;
    this.charge_power = 0;
    this.discharge_power = 0;
    this.temperature = 25;
    this.state = 'idle';
  }

  async updateMeasurements() {
    const loadDemand = this.core.getEnergyDemand?.() || Math.random() * 2000;
    const solarProduction = this.core.getSolarProduction?.() || Math.random() * 3000;
    
    if (solarProduction > loadDemand && this.charge_level < 100) {
      this.state = 'charging';
      this.charge_power = Math.min(
        this.config.max_charge_rate || 5000,
        solarProduction - loadDemand
      );
      this.discharge_power = 0;
      this.power = this.charge_power;
      
      const energyStored = (this.charge_power * (5 / 3600)) / 1000;
      this.charge_level = Math.min(100, this.charge_level + (energyStored / this.config.capacity * 100));
    } else if (loadDemand > solarProduction && this.charge_level > 0) {
      this.state = 'discharging';
      this.discharge_power = Math.min(
        this.config.max_discharge_rate || 5000,
        loadDemand - solarProduction
      );
      this.charge_power = 0;
      this.power = -this.discharge_power;
      
      const energyUsed = (this.discharge_power * (5 / 3600)) / 1000;
      this.charge_level = Math.max(0, this.charge_level - (energyUsed / this.config.capacity * 100));
    } else {
      this.state = 'idle';
      this.charge_power = 0;
      this.discharge_power = 0;
      this.power = 0;
    }

    this.voltage = 48 + (Math.random() * 2);
    this.current = this.power / this.voltage;
    this.temperature = 25 + (Math.abs(this.power) / 1000) + (Math.random() * 2);
    
    this.setState({
      charge_level: this.charge_level,
      charge_power: this.charge_power,
      discharge_power: this.discharge_power,
      temperature: this.temperature,
      state: this.state
    });
  }
}

export const setup = async (core, manifest) => {
  core.sources.register('battery', BatterySource);
};