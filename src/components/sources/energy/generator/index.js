import { BaseEnergySource } from '../base/index.js';

export class GeneratorSource extends BaseEnergySource {
  constructor(core, config) {
    super(core, config);
    this.fuel_level = 100;
    this.runtime = 0;
    this.maintenance_required = false;
    this.state = 'standby';
  }

  async start() {
    if (this.state !== 'running' && this.fuel_level > 0) {
      this.state = 'starting';
      await new Promise(resolve => setTimeout(resolve, 5000));
      this.state = 'running';
      this.setState({ state: this.state });
    }
  }

  async stop() {
    if (this.state === 'running') {
      this.state = 'stopping';
      await new Promise(resolve => setTimeout(resolve, 3000));
      this.state = 'standby';
      this.power = 0;
      this.setState({ state: this.state });
    }
  }

  async updateMeasurements() {
    if (this.state === 'running') {
      this.power = this.config.rated_power * (0.8 + Math.random() * 0.2);
      this.voltage = 230 + (Math.random() * 10 - 5);
      this.current = this.power / this.voltage;
      this.frequency = 50 + (Math.random() * 0.2 - 0.1);
      this.fuel_level = Math.max(0, this.fuel_level - 0.01);
      this.runtime += 5;
      this.energy_today += (this.power * (5 / 3600)) / 1000;
      this.energy_total += (this.power * (5 / 3600)) / 1000;
      
      if (this.runtime >= this.config.maintenance_interval || this.fuel_level === 0) {
        this.maintenance_required = true;
      }

      if (this.fuel_level === 0) {
        await this.stop();
      }
    }

    this.setState({
      fuel_level: this.fuel_level,
      runtime: this.runtime,
      maintenance_required: this.maintenance_required
    });
  }

  async refuel() {
    this.fuel_level = 100;
    this.setState({ fuel_level: this.fuel_level });
  }

  async maintenance() {
    if (this.state === 'running') {
      await this.stop();
    }
    this.maintenance_required = false;
    this.runtime = 0;
    this.setState({
      maintenance_required: this.maintenance_required,
      runtime: this.runtime
    });
  }
}

export const setup = async (core, manifest) => {
  core.sources.register('generator', GeneratorSource);
};