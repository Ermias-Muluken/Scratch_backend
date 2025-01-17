export class BaseSource {
  constructor(core, config) {
    this.core = core;
    this.config = config;
    this.id = config.id;
  }

  async initialize() {
    // Base initialization
  }

  async update() {
    // Update source state
  }
}