import { BaseSource } from '../../base/index.js';

export class BaseEnergySource extends BaseSource {
  constructor(core, config) {
    super(core, config);
    this.power = 0;
    this.voltage = 0;
    this.current = 0;
    this.frequency = 0;
    this.energy_today = 0;
    this.energy_total = 0;
    this.last_reset = new Date().toISOString();
  }

  async setup() {
    await super.setup();
    this.startDataCollection();
  }

  startDataCollection() {
    this.dataInterval = setInterval(() => this.updateMeasurements(), 5000);
  }

  async stop() {
    if (this.dataInterval) {
      clearInterval(this.dataInterval);
    }
  }

  async updateMeasurements() {
    // Override in child classes
  }

  setState(state) {
    super.setState({
      power: this.power,
      voltage: this.voltage,
      current: this.current,
      frequency: this.frequency,
      energy_today: this.energy_today,
      energy_total: this.energy_total,
      last_reset: this.last_reset,
      ...state
    });
  }
}

export const setup = async (core, manifest) => {
  core.sources.register('energy_base', BaseEnergySource);
};