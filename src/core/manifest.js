export class Manifest {
  constructor(data) {
    this.name = data.name;
    this.version = data.version;
    this.description = data.description;
    this.dependencies = data.dependencies || [];
    this.config_schema = data.config_schema || {};
    this.documentation = data.documentation || '';
    this.source_code = data.source_code || '';
  }

  static fromObject(data) {
    return new Manifest(data);
  }

  validate() {
    if (!this.name) throw new Error('Manifest must have a name');
    if (!this.version) throw new Error('Manifest must have a version');
    return true;
  }
}