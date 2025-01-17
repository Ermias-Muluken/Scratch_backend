import { EventEmitter } from 'events';

export class BaseDevice extends EventEmitter {
  constructor(core, config) {
    super();
    this.core = core;
    this.config = config;
    this.id = config.id;
    this.type = config.type;
    this.name = config.name;
    this.manufacturer = config.manufacturer;
    this.model = config.model;
    this.protocol = config.protocol;
    this.connection = null;
  }

  async setup() {
    // Override in child classes
  }

  async connect() {
    // Override in child classes
  }

  async disconnect() {
    // Override in child classes
  }

  async command(cmd, params = {}) {
    // Override in child classes
  }
}

export const setup = async (core, manifest) => {
  core.devices.register('base', BaseDevice);
};