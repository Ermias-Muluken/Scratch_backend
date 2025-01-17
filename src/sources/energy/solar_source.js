import { BaseSource } from '../base_source.js';

export class SolarSource extends BaseSource {
  constructor(core, config) {
    super(core, config);
    this.currentPower = 0;
    this.dailyYield = 0;
    this.totalYield = 0;
    this.voltage = 0;
    this.current = 0;
    this.efficiency = 0;
  }

  async initialize() {
    await super.initialize();
    this.startDataCollection();
  }

  startDataCollection() {
    // Simulate real-time data updates every 5 seconds
    setInterval(() => this.updateMeasurements(), 5000);
  }

  async updateMeasurements() {
    // In a real implementation, this would get data from actual solar inverters
    this.currentPower = Math.random() * 5000; // Watts
    this.voltage = 220 + (Math.random() * 10); // Volts
    this.current = this.currentPower / this.voltage;
    this.efficiency = 0.75 + (Math.random() * 0.1);
    this.dailyYield += this.currentPower * (5 / 3600); // Convert 5 seconds to hours
    
    this.core.stateManager.setState(this.id, {
      power: this.currentPower,
      daily_yield: this.dailyYield,
      total_yield: this.totalYield,
      voltage: this.voltage,
      current: this.current,
      efficiency: this.efficiency
    });
  }

  async getPowerOutput() {
    return this.currentPower;
  }

  async getDailyYield() {
    return this.dailyYield;
  }

  async getTotalYield() {
    return this.totalYield;
  }
}