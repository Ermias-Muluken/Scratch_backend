import express from 'express';
import { WebSocketServer } from 'ws';

export class WebServer {
  constructor(core) {
    this.core = core;
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.use(express.json());

    // Component management
    this.app.post('/api/components/:type/:id', async (req, res) => {
      try {
        const { type, id } = req.params;
        const component = await this.core.loadComponent(type, id, req.body);
        res.json({ success: true, component });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    // State management
    this.app.get('/api/states', (req, res) => {
      const states = {};
      ['sources', 'sensors', 'devices'].forEach(type => {
        states[type] = this.core[type].getAll().map(item => ({
          id: item.id,
          type: item.type,
          name: item.name,
          state: item.getState()
        }));
      });
      res.json(states);
    });

    // Component discovery
    this.app.get('/api/components', (req, res) => {
      res.json(Array.from(this.core.loader.componentPaths.entries())
        .map(([id, path]) => ({ id, path })));
    });
  }

  async start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`Web server listening on port ${this.port}`);
    });

    this.setupWebSocket();
  }

  setupWebSocket() {
    const wss = new WebSocketServer({ server: this.server });

    wss.on('connection', (ws) => {
      console.log('New WebSocket connection');

      const handleStateChange = (event) => {
        ws.send(JSON.stringify({
          type: 'state_changed',
          data: event
        }));
      };

      this.core.events.on('state_changed', handleStateChange);

      ws.on('close', () => {
        this.core.events.off('state_changed', handleStateChange);
      });
    });
  }

  async stop() {
    if (this.server) {
      await new Promise((resolve) => this.server.close(resolve));
    }
  }
}