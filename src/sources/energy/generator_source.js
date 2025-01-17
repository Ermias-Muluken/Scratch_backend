import { BaseSource } from '../base_source.js';

export class GeneratorSource extends BaseSource {
  constructor(core, config) {
    super(core, config);
    this.running = false;
    this.power = 0;
    this.fuelLevel = 100;
    this.temperature = 25;
    this.runtime = 0;
    this.maxPower = config.maxPower || 8000; // Watts
  }

  async initialize() {
    await super.initialize();
    this.startDataCollection();
  }

  startDataCollection() {
    setInterval(() => this.updateMeasurements(), 5000);
  }

  async start() {
    if (this.fuelLevel > 0) {
      this.running = true;
      this.core.stateManager.setState(this.id, { state: 'running' });
    }
  }

  async stop() {
    this.running = false;
    this.power = 0;
    this.core.stateManager.setState(this.id, { state: 'stopped' });
  }

  async updateMeasurements() {
    if (this.running) {
      this.power = Math.min(this.maxPower, Math.random() * this.maxPower);
      this.fuelLevel = Math.max(0, this.fuelLevel - 0.01);
      this.temperature = 60 + (Math.random() * 20);
      this.runtime += 5;

      if (this.fuelLevel === 0) {
        await this.stop();
      }
    }

    this.core.stateManager.setState(this.id, {
      running: this.running,
      power: this.power,
      fuel_level: this.fuelLevel,
      temperature: this.temperature,
      runtime: this.runtime
    });
  }

  async getPower() {
    return this.power;
  }

  async getFuelLevel() {
    return this.fuelLevel;
  }
}