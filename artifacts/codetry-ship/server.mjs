import express from 'express';
import { createServer } from 'node:http';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const DIST = join(__dirname, 'dist/public');

app.set('trust proxy', true);

app.use((req, res, next) => {
  const raw = req.headers['x-forwarded-host'] || req.headers.host || '';
  const first = Array.isArray(raw) ? raw[0] : raw;
  const hostname = first.split(',')[0].trim().toLowerCase().replace(/:.*$/, '').replace(/\.$/, '');
  if (hostname === 'www.codetry.ca') {
    const target = 'https://codetry.ca' + req.originalUrl;
    return res.redirect(301, target);
  }
  next();
});

const REDIRECTS = [
  { from: /^\/listen\/?$/, to: 'https://ourheadwaters.ca/' },
  { from: /^\/tsp\/?$/, to: 'https://ourheadwaters.ca/' },
  { from: /^\/codetry-ship\/?$/, to: '/' },
  { from: /^\/codetry-ship\/(.*)$/, to: (m) => '/' + m[1] },
  { from: /^\/library$/, to: '/library/' },
  { from: /^\/guide\/?$/, to: '/practitioners-guide-v2/' },
  { from: /^\/guide\/(.*)$/, to: (m) => '/practitioners-guide-v2/' + m[1] },
  { from: /^\/handbook\/?$/, to: '/codetry-handbook/' },
  { from: /^\/handbook\/(.*)$/, to: (m) => '/codetry-handbook/' + m[1] },
  { from: /^\/books\/?$/, to: '/headwaters-books/' },
  { from: /^\/books\/(.*)$/, to: (m) => '/headwaters-books/' + m[1] },
  { from: /^\/print\/?$/, to: '/print-marketing/' },
  { from: /^\/print\/(.*)$/, to: (m) => '/print-marketing/' + m[1] },
];

app.use((req, res, next) => {
  for (const rule of REDIRECTS) {
    const match = req.path.match(rule.from);
    if (match) {
      const dest = typeof rule.to === 'function' ? rule.to(match) : rule.to;
      return res.redirect(301, dest);
    }
  }
  next();
});

app.use(express.static(DIST));

app.get('*', (_req, res) => {
  res.sendFile(join(DIST, 'index.html'));
});

createServer(app).listen(PORT, '0.0.0.0', () => {
  console.log(`codetry-ship serving on port ${PORT}`);
});
