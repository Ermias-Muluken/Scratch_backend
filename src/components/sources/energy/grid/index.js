import { BaseEnergySource } from '../base/index.js';

export class GridSource extends BaseEnergySource {
  constructor(core, config) {
    super(core, config);
    this.import_power = 0;
    this.export_power = 0;
    this.daily_import = 0;
    this.daily_export = 0;
    this.state = 'connected';
  }

  async updateMeasurements() {
    const loadDemand = this.core.getEnergyDemand?.() || Math.random() * 5000;
    const localGeneration = this.core.getLocalGeneration?.() || Math.random() * 6000;
    const batteryPower = this.core.getBatteryPower?.() || 0;
    
    const netDemand = loadDemand - localGeneration - batteryPower;

    if (netDemand > 0) {
      this.import_power = netDemand;
      this.export_power = 0;
      this.power = this.import_power;
      this.daily_import += (this.import_power * (5 / 3600)) / 1000;
    } else {
      this.export_power = -netDemand;
      this.import_power = 0;
      this.power = -this.export_power;
      this.daily_export += (this.export_power * (5 / 3600)) / 1000;
    }

    this.voltage = 230 + (Math.random() * 10 - 5);
    this.current = this.power / this.voltage;
    this.frequency = 50 + (Math.random() * 0.2 - 0.1);
    
    this.setState({
      import_power: this.import_power,
      export_power: this.export_power,
      daily_import: this.daily_import,
      daily_export: this.daily_export,
      state: this.state
    });
  }
}

export const setup = async (core, manifest) => {
  core.sources.register('grid', GridSource);
};