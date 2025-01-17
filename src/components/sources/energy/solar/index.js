import { BaseEnergySource } from '../base/index.js';

export class SolarSource extends BaseEnergySource {
  constructor(core, config) {
    super(core, config);
    this.efficiency = 0;
    this.panel_temperature = 0;
    this.inverter_state = 'unknown';
  }

  async updateMeasurements() {
    // Simulate solar panel behavior based on time of day
    const hour = new Date().getHours();
    const baseOutput = hour >= 6 && hour <= 18 ? Math.sin((hour - 6) * Math.PI / 12) : 0;
    
    this.power = Math.max(0, baseOutput * this.config.capacity * (0.7 + Math.random() * 0.3));
    this.voltage = 220 + (Math.random() * 10);
    this.current = this.power / this.voltage;
    this.efficiency = 0.15 + (Math.random() * 0.05);
    this.panel_temperature = 25 + (baseOutput * 20) + (Math.random() * 5);
    this.energy_today += (this.power * (5 / 3600)) / 1000; // kWh
    this.energy_total += (this.power * (5 / 3600)) / 1000;
    
    this.setState({
      efficiency: this.efficiency,
      panel_temperature: this.panel_temperature,
      inverter_state: this.power > 0 ? 'producing' : 'idle'
    });
  }
}

export const setup = async (core, manifest) => {
  core.sources.register('solar', SolarSource);
};