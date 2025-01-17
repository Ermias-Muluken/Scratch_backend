export class DeviceManager {
  constructor(core) {
    this.core = core;
    this.devices = new Map();
    this.protocols = new Map();
  }

  async initialize() {
    console.log('Initializing Device Manager');
  }

  registerProtocol(name, protocol) {
    this.protocols.set(name, protocol);
  }

  async addDevice(config) {
    const { id, type, protocol: protocolName, connection } = config;
    
    const Protocol = this.protocols.get(protocolName);
    if (!Protocol) {
      throw new Error(`Unknown protocol: ${protocolName}`);
    }

    const protocol = new Protocol(connection);
    await protocol.connect();

    const device = {
      id,
      type,
      protocol,
      config,
      lastSeen: new Date(),
      status: 'connected'
    };

    this.devices.set(id, device);
    return device;
  }

  async removeDevice(id) {
    const device = this.devices.get(id);
    if (device) {
      await device.protocol.disconnect();
      this.devices.delete(id);
    }
  }

  getDevice(id) {
    return this.devices.get(id);
  }

  getAllDevices() {
    return Array.from(this.devices.values());
  }
}