import { EventEmitter } from 'events';

export class BaseSensor extends EventEmitter {
  constructor(core, config) {
    super();
    this.core = core;
    this.config = config;
    this.id = config.id;
    this.type = config.type;
    this.name = config.name;
    this.device_class = config.device_class;
    this.unit_of_measurement = config.unit_of_measurement;
    this.state = null;
  }

  async setup() {
    // Override in child classes
  }

  async start() {
    // Override in child classes
  }

  async stop() {
    // Override in child classes
  }

  setState(value) {
    this.state = value;
    this.emit('state_changed', {
      sensor: this.id,
      state: this.state
    });
  }

  getState() {
    return this.state;
  }
}

export const setup = async (core, manifest) => {
  core.sensors.register('base', BaseSensor);
};