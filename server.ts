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

  // Advanced Multi-Browser Proxy Engine with Full URL Rewriting
  app.get('/api/browse', async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) return res.status(400).send('URL is required');

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        redirect: 'follow'
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        let html = await response.text();
        const urlObj = new URL(targetUrl);
        const origin = urlObj.origin;
        const currentProxyBase = `${req.protocol}://${req.get('host')}/api/browse?url=`;

        // 1. Inject Base Tag
        html = html.replace('<head>', `<head><base href="${origin}/">`);

        // 2. Rewrite Links, Forms, and Sources to keep everything inside the proxy
        // This is a more robust way than just an interceptor script
        html = html.replace(/(href|src|action)="((?!https?:\/\/|data:|mailto:|#)[^"]+)"/g, (match, p1, p2) => {
          const absoluteUrl = new URL(p2, targetUrl).href;
          return `${p1}="${currentProxyBase}${encodeURIComponent(absoluteUrl)}"`;
        });

        // 3. Script to handle dynamic redirects and frame busting
        const bootstrapScript = `
          <script>
            // Intercept all clicks globally
            document.addEventListener('click', function(e) {
              const link = e.target.closest('a');
              if (link && link.href && !link.href.includes('/api/browse?url=')) {
                if (link.href.startsWith('http')) {
                  e.preventDefault();
                  window.location.href = window.location.origin + '/api/browse?url=' + encodeURIComponent(link.href);
                }
              }
            }, true);

            // Intercept form submissions
            document.addEventListener('submit', function(e) {
              const form = e.target;
              if (form.action && !form.action.includes('/api/browse?url=')) {
                // For GET forms, we append query params to our proxy
                if (form.method.toLowerCase() === 'get') {
                  e.preventDefault();
                  const formData = new FormData(form);
                  const params = new URLSearchParams(formData);
                  const fullUrl = form.action + '?' + params.toString();
                  window.location.href = window.location.origin + '/api/browse?url=' + encodeURIComponent(fullUrl);
                }
              }
            }, true);

            // Protect against frame-busting scripts
            window.onbeforeunload = function() { return null; };
            Object.defineProperty(window, 'top', { get: function() { return window.self; } });
            Object.defineProperty(window, 'parent', { get: function() { return window.self; } });
          </script>
        `;
        
        html = html.replace('</head>', `${bootstrapScript}</head>`);

        // 4. Set Headers to bypass security
        res.setHeader('Content-Security-Policy', "frame-ancestors *");
        res.setHeader('X-Frame-Options', 'ALLOWALL');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
      } else {
        res.redirect(targetUrl);
      }
    } catch (error) {
      res.status(500).send(`
        <div style="font-family: sans-serif; padding: 40px; color: #fff; background: #05080f; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
          <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
          <h2 style="color: #3b82f6; margin-bottom: 10px; font-weight: 900; text-transform: uppercase;">Connection Error</h2>
          <p style="color: #64748b; max-width: 400px; line-height: 1.6;">The website <b>${targetUrl}</b> refused to connect or is currently unavailable via proxy.</p>
          <button onclick="window.location.reload()" style="margin-top: 30px; padding: 12px 30px; background: #3b82f6; border: none; border-radius: 12px; color: white; font-weight: 900; cursor: pointer;">RETRY CONNECTION</button>
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
