import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import { SolarSource } from './sources/energy/solar_source.js';
import { BatterySource } from './sources/energy/battery_source.js';
import { GridSource } from './sources/energy/grid_source.js';
import { GeneratorSource } from './sources/energy/generator_source.js';
import { SwitchSource } from './sources/switch_source.js';
import { SensorSource } from './sources/sensor_source.js';

export class SourceManager {
  constructor(core) {
    this.core = core;
    this.sources = new Map();
    this.sourceTypes = new Map();
  }

  async initialize() {
    console.log('Initializing Source Manager');
    // Register built-in source types
    this.registerSourceType('switch', SwitchSource);
    this.registerSourceType('sensor', SensorSource);
    this.registerSourceType('solar', SolarSource);
    this.registerSourceType('battery', BatterySource);
    this.registerSourceType('grid', GridSource);
    this.registerSourceType('generator', GeneratorSource);
  }

  registerSourceType(type, sourceClass) {
    this.sourceTypes.set(type, sourceClass);
  }

  async createSource(type, config) {
    const SourceClass = this.sourceTypes.get(type);
    if (!SourceClass) {
      throw new Error(`Unknown source type: ${type}`);
    }

    const source = new SourceClass(this.core, config);
    await source.initialize();
    
    const sourceId = `${type}.${config.id}`;
    this.sources.set(sourceId, source);
    
    this.core.entityRegistry.registerEntity(sourceId, {
      type,
      ...config
    });

    return source;
  }

  async generateSource(type, template) {
    const timestamp = new Date().getTime();
    const sourceId = `${type}_${timestamp}`;
    
    const sourceConfig = {
      id: sourceId,
      name: `${type} ${timestamp}`,
      ...template
    };

    // Generate source file
    const sourceCode = this.generateSourceCode(type, sourceConfig);
    const filename = `${sourceId}.yaml`;
    
    await fs.writeFile(
      path.join('config/sources', filename),
      yaml.stringify(sourceConfig)
    );

    return this.createSource(type, sourceConfig);
  }

  generateSourceCode(type, config) {
    const templates = {
      solar: `
class ${config.id}Solar extends SolarSource {
  constructor(core, config) {
    super(core, config);
  }
}`,
      battery: `
class ${config.id}Battery extends BatterySource {
  constructor(core, config) {
    super(core, config);
  }
}`,
      grid: `
class ${config.id}Grid extends GridSource {
  constructor(core, config) {
    super(core, config);
  }
}`,
      generator: `
class ${config.id}Generator extends GeneratorSource {
  constructor(core, config) {
    super(core, config);
  }
}`,
      switch: `
class ${config.id}Switch extends SwitchSource {
  constructor(core, config) {
    super(core, config);
  }
}`,
      sensor: `
class ${config.id}Sensor extends SensorSource {
  constructor(core, config) {
    super(core, config);
  }
}`
    };

    return templates[type] || '';
  }
}