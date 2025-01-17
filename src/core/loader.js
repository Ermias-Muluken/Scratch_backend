import fs from 'fs/promises';
import path from 'path';
import { Manifest } from './manifest.js';

export class ComponentLoader {
  constructor(core) {
    this.core = core;
    this.loadedComponents = new Map();
    this.componentPaths = new Map();
  }

  async loadComponent(type, id) {
    const componentPath = this.componentPaths.get(`${type}.${id}`);
    if (!componentPath) {
      throw new Error(`Component ${type}.${id} not found`);
    }

    const manifest = await this.loadManifest(componentPath);
    const module = await import(componentPath);
    
    if (!module.setup) {
      throw new Error(`Component ${id} must export a setup function`);
    }

    await this.validateDependencies(manifest);
    await module.setup(this.core, manifest);
    
    this.loadedComponents.set(`${type}.${id}`, {
      manifest,
      module
    });

    return module;
  }

  async loadManifest(componentPath) {
    const manifestPath = path.join(componentPath, 'manifest.json');
    const manifestData = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    return Manifest.fromObject(manifestData);
  }

  async validateDependencies(manifest) {
    for (const dep of manifest.dependencies) {
      if (!this.loadedComponents.has(dep)) {
        await this.loadComponent('component', dep);
      }
    }
  }

  async discoverComponents() {
    const types = ['sources', 'sensors', 'devices', 'protocols'];
    for (const type of types) {
      const basePath = path.join(process.cwd(), 'components', type);
      try {
        const entries = await fs.readdir(basePath, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            this.componentPaths.set(
              `${type}.${entry.name}`, 
              path.join(basePath, entry.name, 'index.js')
            );
          }
        }
      } catch (error) {
        console.warn(`No ${type} directory found`);
      }
    }
  }
}