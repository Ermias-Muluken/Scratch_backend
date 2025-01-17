import { BaseSource } from './base_source.js';

export class SensorSource extends BaseSource {
  constructor(core, config) {
    super(core, config);
    this.value = null;
  }

  async getValue() {
    return this.value;
  }

  async setValue(value) {
    this.value = value;
    this.core.stateManager.setState(this.id, { state: value });
  }
}