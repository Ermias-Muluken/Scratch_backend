import { BaseSource } from '../base_source.js';

export class BatterySource extends BaseSource {
  constructor(core, config) {
    super(core, config);
    this.chargeLevel = 100;
    this.chargePower = 0;
    this.dischargePower = 0;
    this.temperature = 25;
    this.voltage = 48;
    this.capacity = config.capacity || 13500; // Wh
  }

  async initialize() {
    await super.initialize();
    this.startDataCollection();
  }

  startDataCollection() {
    setInterval(() => this.updateMeasurements(), 5000);
  }

  async updateMeasurements() {
    // Simulate battery behavior
    const loadDemand = Math.random() * 2000; // Watts
    const solarInput = Math.random() * 3000; // Watts

    if (solarInput > loadDemand) {
      this.chargePower = solarInput - loadDemand;
      this.dischargePower = 0;
      this.chargeLevel = Math.min(100, this.chargeLevel + (this.chargePower * (5 / 3600) / this.capacity * 100));
    } else {
      this.dischargePower = loadDemand - solarInput;
      this.chargePower = 0;
      this.chargeLevel = Math.max(0, this.chargeLevel - (this.dischargePower * (5 / 3600) / this.capacity * 100));
    }

    this.temperature = 25 + (Math.random() * 10);
    
    this.core.stateManager.setState(this.id, {
      charge_level: this.chargeLevel,
      charge_power: this.chargePower,
      discharge_power: this.dischargePower,
      temperature: this.temperature,
      voltage: this.voltage,
      capacity: this.capacity
    });
  }

  async getChargeLevel() {
    return this.chargeLevel;
  }

  async getChargePower() {
    return this.chargePower;
  }

  async getDischargePower() {
    return this.dischargePower;
  }
}