/**
 * start.js — QuickCard unified launcher
 *
 * Starts:
 *   1. MongoDB (in-memory on 27017, or Atlas if reachable)
 *   2. NestJS backend  → http://localhost:3000
 *   3. Next.js frontend → http://localhost:3001
 *
 * Usage:  node start.js          (dev — with watch)
 *         node start.js --prod   (production — serves built frontend)
 */

require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

const isProd = process.argv.includes('--prod');

// ─── Colour helpers ──────────────────────────────────────────────────────────
const c = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue:  '\x1b[34m',
  cyan:  '\x1b[36m',
  yellow:'\x1b[33m',
  red:   '\x1b[31m',
  bold:  '\x1b[1m',
};
const tag = (label, color) => `${color}${c.bold}[${label}]${c.reset}`;
const DB  = tag('DB       ', c.cyan);
const BE  = tag('BACKEND  ', c.green);
const FE  = tag('FRONTEND ', c.blue);
const SYS = tag('SYSTEM   ', c.yellow);

function prefixStream(stream, prefix) {
  const { Transform } = require('stream');
  const t = new Transform({
    transform(chunk, _enc, cb) {
      const lines = chunk.toString().split('\n');
      const out = lines
        .filter(l => l.trim())
        .map(l => `${prefix} ${l}`)
        .join('\n');
      if (out) cb(null, out + '\n');
      else cb();
    },
  });
  stream.pipe(t).pipe(process.stdout);
}

// ─── MongoDB ─────────────────────────────────────────────────────────────────
async function startMongo() {
  const configuredUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickcard';
  const isAtlas = configuredUri.includes('mongodb+srv') || configuredUri.includes('mongodb.net');

  if (isAtlas) {
    console.log(`${DB} Testing Atlas connection...`);
    try {
      const { MongoClient } = require('mongodb');
      const client = new MongoClient(configuredUri, { serverSelectionTimeoutMS: 5000 });
      await client.connect();
      await client.db().command({ ping: 1 });
      await client.close();
      console.log(`${DB} ✅ Atlas connected — ${configuredUri.split('@')[1]?.split('/')[0] || 'Atlas'}`);
      return null; // no local mongod needed
    } catch (e) {
      console.log(`${DB} ⚠️  Atlas unreachable (${e.message.split('\n')[0]})`);
      console.log(`${DB} 🔄 Falling back to in-memory MongoDB...`);
    }
  } else {
    // Local URI — probe it first; only skip in-memory if it's actually reachable
    console.log(`${DB} Probing local MongoDB (${configuredUri})...`);
    try {
      const { MongoClient } = require('mongodb');
      const client = new MongoClient(configuredUri, { serverSelectionTimeoutMS: 3000 });
      await client.connect();
      await client.db().command({ ping: 1 });
      await client.close();
      console.log(`${DB} ✅ Local MongoDB reachable — using ${configuredUri}`);
      return null; // real local MongoDB is running, use it
    } catch (e) {
      console.log(`${DB} ⚠️  Local MongoDB not running (${e.message.split('\n')[0]})`);
      console.log(`${DB} 🔄 Starting in-memory MongoDB instead...`);
    }
  }

  // Start in-memory MongoDB
  const { MongoMemoryServer } = require('mongodb-memory-server');
  console.log(`${DB} Starting in-memory MongoDB on port 27017...`);
  let mongod;
  try {
    mongod = await MongoMemoryServer.create({
      instance: { port: 27017, dbName: 'quickcard', ip: '127.0.0.1' },
    });
  } catch {
    // Port 27017 taken — try a random port
    console.log(`${DB} Port 27017 busy, using random port...`);
    mongod = await MongoMemoryServer.create({
      instance: { dbName: 'quickcard', ip: '127.0.0.1' },
    });
  }
  process.env.MONGODB_URI = mongod.getUri();
  console.log(`${DB} ✅ MongoDB ready: ${mongod.getUri()}`);
  return mongod;
}

// ─── Spawn helper ─────────────────────────────────────────────────────────────
function spawnProc(cmd, args, opts, prefix) {
  const proc = spawn(cmd, args, { shell: true, ...opts });
  if (proc.stdout) prefixStream(proc.stdout, prefix);
  if (proc.stderr) prefixStream(proc.stderr, prefix);
  return proc;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${SYS} ⚡ QuickCard starting (${isProd ? 'PRODUCTION' : 'DEVELOPMENT'})...\n`);

  // 1. MongoDB
  const mongod = await startMongo();

  // 2. Backend
  let backendProc;
  if (isProd) {
    console.log(`${BE} Building backend...`);
    const build = spawn('npx', ['nest', 'build'], { shell: true, cwd: __dirname, stdio: 'inherit' });
    await new Promise((res, rej) => { build.on('exit', c => c === 0 ? res() : rej(new Error('Build failed'))); });
    backendProc = spawnProc('node', ['dist/main'], { cwd: __dirname }, BE);
  } else {
    // Check if dist/main.js exists; if not, build first
    const fs = require('fs');
    if (!fs.existsSync(path.join(__dirname, 'dist', 'main.js'))) {
      console.log(`${BE} Building backend (first run)...`);
      const build = spawn('npx', ['nest', 'build'], { shell: true, cwd: __dirname, stdio: 'inherit' });
      await new Promise((res, rej) => { build.on('exit', code => code === 0 ? res() : rej(new Error('Build failed'))); });
    } else {
      console.log(`${BE} Using existing dist (run 'npx nest build' to rebuild)...`);
    }
    backendProc = spawnProc('node', ['dist/main'], { cwd: __dirname }, BE);
  }

  // 3. Frontend
  let frontendProc;
  const feDir = path.join(__dirname, 'frontend');

  if (isProd) {
    console.log(`${FE} Building frontend...`);
    const build = spawn('npm', ['run', 'build'], { shell: true, cwd: feDir, stdio: 'inherit' });
    await new Promise((res, rej) => { build.on('exit', c => c === 0 ? res() : rej(new Error('FE build failed'))); });
    frontendProc = spawnProc('npm', ['run', 'start'], { cwd: feDir }, FE);
  } else {
    frontendProc = spawnProc('npm', ['run', 'dev'], { cwd: feDir }, FE);
  }

  // ─── Ready banner ───────────────────────────────────────────────────────────
  setTimeout(() => {
    console.log(`\n${SYS} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`${SYS}  🚀 QuickCard is running!`);
    console.log(`${SYS}  Frontend  → http://localhost:3000`);
    console.log(`${SYS}  Backend   → http://localhost:3001/api/v1`);
    console.log(`${SYS}  Health    → http://localhost:3001/api/v1/health`);
    console.log(`${SYS} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`${SYS}  Demo login: demo@quickcard.app / Demo@1234`);
    console.log(`${SYS} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  }, 5000);

  // ─── Cleanup ────────────────────────────────────────────────────────────────
  const cleanup = async (signal) => {
    console.log(`\n${SYS} Shutting down (${signal})...`);
    backendProc?.kill();
    frontendProc?.kill();
    if (mongod) await mongod.stop();
    process.exit(0);
  };

  process.on('SIGINT',  () => cleanup('SIGINT'));
  process.on('SIGTERM', () => cleanup('SIGTERM'));

  backendProc.on('exit',  code => { if (code && code !== 0) console.log(`${BE} exited with code ${code}`); });
  frontendProc.on('exit', code => { if (code && code !== 0) console.log(`${FE} exited with code ${code}`); });
}

main().catch(err => {
  console.error(`\n❌ Startup failed: ${err.message}`);
  process.exit(1);
});
