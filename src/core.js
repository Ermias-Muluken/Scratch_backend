import { Registry } from './core/registry.js';
import { ComponentLoader } from './core/loader.js';
import { EventEmitter } from 'events';

export class HomeAutomationCore {
  constructor() {
    // Core event bus
    this.events = new EventEmitter();
    
    // Component registries
    this.sources = new Registry();
    this.sensors = new Registry();
    this.devices = new Registry();
    this.protocols = new Registry();
    
    // Component loader
    this.loader = new ComponentLoader(this);
    
    // Setup event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Handle state changes from all components
    ['sources', 'sensors', 'devices'].forEach(type => {
      this[type].on('state_changed', (event) => {
        this.events.emit('state_changed', {
          type,
          ...event
        });
      });
    });
  }

  async start() {
    console.log('Starting Home Automation Core...');
    
    // Discover available components
    await this.loader.discoverComponents();
    
    // Load base components
    await this.loader.loadComponent('sources', 'base');
    await this.loader.loadComponent('sensors', 'base');
    await this.loader.loadComponent('devices', 'base');
    await this.loader.loadComponent('protocols', 'base');
    
    console.log('Home Automation Core is running');
  }

  async stop() {
    console.log('Stopping Home Automation Core...');
    // Cleanup and stop all components
    for (const registry of [this.sources, this.sensors, this.devices, this.protocols]) {
      for (const item of registry.getAll()) {
        if (item.stop) await item.stop();
      }
    }
  }

  async loadComponent(type, id, config = {}) {
    const component = await this.loader.loadComponent(type, id);
    if (component) {
      await component.setup(config);
      return component;
    }
    throw new Error(`Failed to load component ${type}.${id}`);
  }
}