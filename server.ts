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

  // Advanced Multi-Browser Proxy Engine
  app.get('/api/browse', async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) return res.status(400).send('URL is required');

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        let html = await response.text();
        const urlObj = new URL(targetUrl);
        const origin = urlObj.origin;
        const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);

        // 1. Inject Base Tag to fix relative assets
        html = html.replace('<head>', `<head><base href="${origin}/">`);

        // 2. Remove Frame-Blocking Scripts and Headers
        html = html.replace(/X-Frame-Options/gi, 'DISABLED');
        html = html.replace(/frame-ancestors/gi, 'none');
        
        // 3. Inject a script to intercept clicks and keep them in the proxy
        const interceptorScript = `
          <script>
            document.addEventListener('click', function(e) {
              const link = e.target.closest('a');
              if (link && link.href && link.href.startsWith('http')) {
                e.preventDefault();
                const proxyUrl = window.location.origin + '/api/browse?url=' + encodeURIComponent(link.href);
                window.location.href = proxyUrl;
              }
            });
          </script>
        `;
        html = html.replace('</body>', `${interceptorScript}</body>`);

        // 4. Set Headers to allow framing
        res.setHeader('Content-Security-Policy', "frame-ancestors *");
        res.setHeader('X-Frame-Options', 'ALLOWALL');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
      } else {
        // Redirect non-HTML assets directly
        res.redirect(targetUrl);
      }
    } catch (error) {
      res.status(500).send(`
        <div style="font-family: sans-serif; padding: 20px; color: #fff; background: #0a0f1a;">
          <h2 style="color: #ff4444;">Browser Error</h2>
          <p>Unable to load: ${targetUrl}</p>
          <small>${error}</small>
        </div>
      `);
    }
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
