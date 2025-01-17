export class EntityRegistry {
  constructor(core) {
    this.core = core;
    this.entities = new Map();
  }

  async initialize() {
    console.log('Initializing Entity Registry');
  }

  registerEntity(entityId, config) {
    this.entities.set(entityId, {
      id: entityId,
      config,
      lastUpdated: new Date()
    });
    this.core.eventBus.emit('entity_registered', { entityId, config });
  }

  getEntity(entityId) {
    return this.entities.get(entityId);
  }

  getAllEntities() {
    return Array.from(this.entities.values());
  }
}