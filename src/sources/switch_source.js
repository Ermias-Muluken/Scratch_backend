import { BaseSource } from './base_source.js';

export class SwitchSource extends BaseSource {
  constructor(core, config) {
    super(core, config);
    this.state = 'off';
  }

  async turnOn() {
    this.state = 'on';
    this.core.stateManager.setState(this.id, { state: this.state });
  }

  async turnOff() {
    this.state = 'off';
    this.core.stateManager.setState(this.id, { state: this.state });
  }
}