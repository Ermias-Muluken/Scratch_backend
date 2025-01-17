import { EventEmitter } from 'events';

export class BaseSource extends EventEmitter {
  constructor(core, config) {
    super();
    this.core = core;
    this.config = config;
    this.id = config.id;
    this.type = config.type;
    this.name = config.name;
    this.state = {};
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

  setState(state) {
    this.state = { ...this.state, ...state };
    this.emit('state_changed', {
      source: this.id,
      state: this.state
    });
  }

  getState() {
    return this.state;
  }
}

export const setup = async (core, manifest) => {
  core.sources.register('base', BaseSource);
};