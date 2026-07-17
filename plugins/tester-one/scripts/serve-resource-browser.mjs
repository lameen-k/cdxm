import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const browserFile = path.resolve(scriptDir, '../assets/resource-browser.html');
const requestedPort = Number(process.argv.find((arg) => arg.startsWith('--port='))?.split('=')[1] || 0);

const html = await readFile(browserFile);
const server = createServer((request, response) => {
  if (request.url !== '/' && request.url !== '/index.html') {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }
  response.writeHead(200, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store'
  });
  response.end(html);
});

server.listen(requestedPort, '127.0.0.1', () => {
  const address = server.address();
  console.log(`Tester One resource browser: http://127.0.0.1:${address.port}`);
  console.log('Press Ctrl+C to stop the server.');
});

process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
