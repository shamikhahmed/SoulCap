#!/usr/bin/env node
/**
 * Static docs/ server for Playwright finish-matrix.
 * Python http.server drops concurrent GETs (ERR_CONNECTION_RESET on app.js).
 * Plain Node reads the full file then responds — stable under Chromium asset storms.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', 'docs');
const PORT = Number(process.env.SOULCAP_PORT || 8788);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const file = path.resolve(ROOT, rel);
  if (!file.startsWith(ROOT + path.sep) && file !== ROOT) {
    res.writeHead(403);
    res.end('forbidden');
    return;
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Content-Length': data.length,
    });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  process.stderr.write(`SoulCap static http://127.0.0.1:${PORT}/ -> ${ROOT}\n`);
});
