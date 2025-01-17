export class StateManager {
  constructor(core) {
    this.core = core;
    this.states = new Map();
  }

  async initialize() {
    console.log('Initializing State Manager');
  }

  setState(entityId, state) {
    const oldState = this.states.get(entityId);
    this.states.set(entityId, {
      state,
      lastChanged: new Date()
    });
    
    this.core.eventBus.emit('state_changed', {
      entityId,
      oldState,
      newState: state
    });
  }

  getState(entityId) {
    return this.states.get(entityId);
  }

  getAllStates() {
    return Array.from(this.states.entries()).map(([entityId, state]) => ({
      entityId,
      ...state
    }));
  }
}