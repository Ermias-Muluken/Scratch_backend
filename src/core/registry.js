import { EventEmitter } from 'events';

export class Registry extends EventEmitter {
  constructor() {
    super();
    this.items = new Map();
  }

  register(id, item) {
    this.items.set(id, item);
    this.emit('item_registered', { id, item });
  }

  unregister(id) {
    const item = this.items.get(id);
    if (item) {
      this.items.delete(id);
      this.emit('item_unregistered', { id, item });
    }
  }

  get(id) {
    return this.items.get(id);
  }

  getAll() {
    return Array.from(this.items.values());
  }
}