import { EventEmitter } from 'events';

export class BaseProtocol extends EventEmitter {
  constructor(core, config) {
    super();
    this.core = core;
    this.config = config;
    this.id = config.id;
    this.type = config.type;
    this.name = config.name;
    this.connected = false;
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

  async send(data) {
    // Override in child classes
  }

  async receive() {
    // Override in child classes
  }
}

export const setup = async (core, manifest) => {
  core.protocols.register('base', BaseProtocol);
};