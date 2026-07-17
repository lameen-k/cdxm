import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const browserFile = path.resolve(scriptDir, '../assets/resource-browser.html');
const requestedPort = Number(process.argv.find((arg) => arg.startsWith('--port='))?.split('=')[1] || 0);
const customEnvFile = process.argv.find((arg) => arg.startsWith('--credentials-file='))?.split('=')[1];
const envFile = path.resolve(customEnvFile || path.join(process.cwd(), '.env'));
const resetCredentials = process.argv.includes('--reset-credentials');
const apiBase = 'https://jsonplaceholder.typicode.com';
const allowedResources = new Set(['posts', 'comments', 'albums', 'photos', 'todos', 'users']);

function readEnvValue(contents, key) {
  const line = contents.split(/\r?\n/).find((entry) => entry.match(new RegExp(`^${key}=`)));
  if (!line) return '';
  const value = line.slice(key.length + 1).trim();
  if (value.startsWith('"')) {
    try { return JSON.parse(value); } catch { return value.slice(1, -1); }
  }
  return value;
}

function setEnvValue(contents, key, value) {
  const entry = `${key}=${JSON.stringify(value)}`;
  const pattern = new RegExp(`^${key}=.*$`, 'm');
  return pattern.test(contents)
    ? contents.replace(pattern, entry)
    : `${contents.trimEnd()}${contents.trim() ? '\n' : ''}${entry}\n`;
}

async function ask(question) {
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await prompt.question(question);
  prompt.close();
  return answer.trim();
}

async function askSecret(question) {
  if (!process.stdin.isTTY) throw new Error('Credentials are missing. Run this script from an interactive terminal.');
  process.stdout.write(question);
  return new Promise((resolve, reject) => {
    let value = '';
    const wasRaw = process.stdin.isRaw;
    process.stdin.setRawMode(true);
    process.stdin.resume();
    const finish = (error) => {
      process.stdin.off('data', onData);
      process.stdin.setRawMode(wasRaw);
      process.stdout.write('\n');
      error ? reject(error) : resolve(value);
    };
    const onData = (chunk) => {
      for (const key of chunk.toString('utf8')) {
        if (key === '\u0003') return finish(new Error('Credential setup cancelled.'));
        if (key === '\r' || key === '\n') return finish();
        if (key === '\u007f' || key === '\b') { value = value.slice(0, -1); continue; }
        value += key;
      }
    };
    process.stdin.on('data', onData);
  });
}

async function loadCredentials() {
  let contents = '';
  try { contents = await readFile(envFile, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  let username = resetCredentials ? '' : readEnvValue(contents, 'JSONPLACEHOLDER_USERNAME');
  let password = resetCredentials ? '' : readEnvValue(contents, 'JSONPLACEHOLDER_PASSWORD');
  if (!username || !password) {
    if (!process.stdin.isTTY) throw new Error(`Credentials are missing in ${envFile}. Run this script from an interactive terminal.`);
    console.log(`JSONPlaceholder credentials are required for this simulation and will be saved to ${envFile}.`);
    username = await ask('Username: ');
    password = await askSecret('Password: ');
    if (!username || !password) throw new Error('Username and password are both required.');
    contents = setEnvValue(setEnvValue(contents, 'JSONPLACEHOLDER_USERNAME', username), 'JSONPLACEHOLDER_PASSWORD', password);
    await writeFile(envFile, contents, { mode: 0o600 });
    console.log(`Credentials saved to ${envFile}.`);
  }
  return { username, password };
}

const html = await readFile(browserFile);
const credentials = await loadCredentials();
const server = createServer((request, response) => {
  const requestUrl = new URL(request.url, 'http://127.0.0.1');
  if (requestUrl.pathname.startsWith('/api/')) {
    const resource = requestUrl.pathname.slice('/api/'.length).split('/')[0];
    if (request.method !== 'GET' || !allowedResources.has(resource)) {
      response.writeHead(404, { 'content-type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ error: 'Unsupported resource' }));
      return;
    }
    const destination = `${apiBase}${requestUrl.pathname.slice('/api'.length)}${requestUrl.search}`;
    fetch(destination, {
      headers: {
        accept: 'application/json',
        authorization: `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`
      }
    }).then(async (upstream) => {
      const body = Buffer.from(await upstream.arrayBuffer());
      response.writeHead(upstream.status, { 'content-type': upstream.headers.get('content-type') || 'application/json; charset=utf-8', 'cache-control': 'no-store' });
      response.end(body);
    }).catch((error) => {
      response.writeHead(502, { 'content-type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ error: `Unable to reach JSONPlaceholder: ${error.message}` }));
    });
    return;
  }
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
  console.log(`API requests are proxied with credentials from ${envFile}.`);
  console.log('Press Ctrl+C to stop the server.');
});

process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
