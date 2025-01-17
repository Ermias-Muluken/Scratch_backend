import { BaseSource } from '../base_source.js';

export class GridSource extends BaseSource {
  constructor(core, config) {
    super(core, config);
    this.importPower = 0;
    this.exportPower = 0;
    this.voltage = 230;
    this.frequency = 50;
    this.dailyImport = 0;
    this.dailyExport = 0;
  }

  async initialize() {
    await super.initialize();
    this.startDataCollection();
  }

  startDataCollection() {
    setInterval(() => this.updateMeasurements(), 5000);
  }

  async updateMeasurements() {
    // Simulate grid interaction
    const loadDemand = Math.random() * 5000;
    const localGeneration = Math.random() * 6000;

    if (localGeneration > loadDemand) {
      this.exportPower = localGeneration - loadDemand;
      this.importPower = 0;
      this.dailyExport += this.exportPower * (5 / 3600);
    } else {
      this.importPower = loadDemand - localGeneration;
      this.exportPower = 0;
      this.dailyImport += this.importPower * (5 / 3600);
    }

    this.voltage = 230 + (Math.random() * 10 - 5);
    this.frequency = 50 + (Math.random() * 0.2 - 0.1);

    this.core.stateManager.setState(this.id, {
      import_power: this.importPower,
      export_power: this.exportPower,
      voltage: this.voltage,
      frequency: this.frequency,
      daily_import: this.dailyImport,
      daily_export: this.dailyExport
    });
  }

  async getImportPower() {
    return this.importPower;
  }

  async getExportPower() {
    return this.exportPower;
  }
}