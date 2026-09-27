const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function handler(req, res) {
  let reqPath = req.url ? req.url.split('?')[0] : '/';
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const rootDir = process.cwd();
  const filePath = path.join(rootDir, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      // Fallback: serve index.html for SPA/root routes
      fs.readFile(path.join(rootDir, 'index.html'), (err2, indexContent) => {
        if (err2) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('404 Not Found');
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(indexContent);
        }
      });
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(content);
    }
  });
}

// Export handler for Vercel Serverless Function runtime
module.exports = handler;

// If executed directly from CLI (e.g., node server.js), start standalone server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const server = http.createServer(handler);
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}/`);
  });
}
