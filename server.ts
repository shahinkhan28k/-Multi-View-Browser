import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Proxy Configuration API
  // In a real production app, this would integrate with a service like Bright Data or Oxylabs
  app.get('/api/proxy-config', (req, res) => {
    const count = parseInt(req.query.count as string) || 10;
    const startIndex = parseInt(req.query.startIndex as string) || 0;

    // Simulate unique proxy metadata for each tab
    const locations = ['New York, US', 'London, UK', 'Tokyo, JP', 'Frankfurt, DE', 'Mumbai, IN', 'Singapore, SG', 'Paris, FR', 'Sydney, AU'];
    
    const proxies = Array.from({ length: Math.min(count, 100) }).map((_, i) => {
      const idx = startIndex + i;
      const location = locations[idx % locations.length];
      const ip = `192.168.${Math.floor(idx / 254)}.${idx % 254 + 1}`; // Simulated Unique IP
      
      return {
        id: idx + 1,
        ip,
        location,
        latency: Math.floor(Math.random() * 200) + 50 + 'ms',
        status: 'Connected'
      };
    });

    res.json({
      total: count,
      proxies,
      rotationMode: 'Smart Routing',
      provider: 'Multi-View Backend Bridge'
    });
  });

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(err => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
