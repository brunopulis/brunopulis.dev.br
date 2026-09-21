/*
  Orquestra o E2E com Cypress:
  1. Garante o build estático em _site (fonts + eleventy), sem tocar no index.css versionado.
  2. Sobe um servidor estático local servindo _site.
  3. Roda o Cypress (headless) e repassa o exit code.

  Uso:
    node scripts/e2e.js                     # roda todas as specs
    node scripts/e2e.js --spec <glob>       # roda apenas um subconjunto (ex.: smoke)
*/

const { spawn, spawnSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.E2E_PORT ? Number(process.env.E2E_PORT) : 4173;
const OUT_DIR = path.resolve(__dirname, '../_site');

const args = process.argv.slice(2);
const specIndex = args.indexOf('--spec');
const spec = specIndex !== -1 ? args[specIndex + 1] : null;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8'
};

function fileFor(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  let rel = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '');
  if (rel.endsWith('/')) rel += 'index.html';
  let file = path.join(OUT_DIR, rel);
  if (!file.startsWith(OUT_DIR)) return null;
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    const idx = path.join(file, 'index.html');
    file = fs.existsSync(idx) ? idx : null;
  }
  return file && fs.existsSync(file) ? file : null;
}

function startServer() {
  const server = http.createServer((req, res) => {
    const file = fileFor(req.url);
    if (!file) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      // uma porta já ocupada é suficiente p/ os testes; segue.
      return;
    }
    process.exit(1);
  });
  return new Promise((resolve) => {
    server.listen(PORT, () => resolve(server));
  });
}

function run(cmd, nodeArgs, direct = false) {
  const argv = direct ? [cmd, ...nodeArgs] : [process.execPath, cmd, ...nodeArgs];
  const res = spawnSync(argv[0], argv.slice(1), {
    stdio: 'inherit'
  });
  if (res.status !== 0) {
    process.exit(res.status ?? 1);
  }
}

async function main() {
  run('scripts/copy-fonts.js', []);
  run('node_modules/.bin/eleventy', [], true);

  const server = await startServer();

  const cypressArgs = ['node_modules/.bin/cypress', 'run', '--headless', '--browser', 'electron'];
  if (spec) cypressArgs.push('--spec', spec);
  cypressArgs.push('--config', `baseUrl=http://localhost:${PORT}`);

  const child = spawn(cypressArgs[0], cypressArgs.slice(1), {
    stdio: 'inherit',
    env: { ...process.env, CYPRESS_BASE_URL: `http://localhost:${PORT}` }
  });

  child.on('exit', (code) => {
    server.close(() => process.exit(code ?? 1));
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

process.on('SIGINT', () => process.exit(130));
process.on('SIGTERM', () => process.exit(143));
