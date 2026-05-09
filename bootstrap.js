/**
 * bootstrap.js — runs BEFORE NestJS starts.
 *
 * Strategy:
 *  1. Try to connect to whatever MONGODB_URI is set (Atlas OR local).
 *  2. If the connection succeeds → use it as-is.
 *  3. If the connection fails (ECONNREFUSED, timeout, etc.)
 *     → start an in-memory MongoDB and patch MONGODB_URI so NestJS uses it.
 *
 * This means the app always starts, even when:
 *  - No local MongoDB is installed / running
 *  - Atlas credentials are wrong / network is offline
 */
require('dotenv').config();

const { MongoClient } = require('mongodb');

async function probeUri(uri, timeoutMs = 5000) {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: timeoutMs });
  try {
    await client.connect();
    await client.db().command({ ping: 1 });
    await client.close();
    return true;
  } catch {
    try { await client.close(); } catch {}
    return false;
  }
}

async function resolveMongoUri() {
  const configuredUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickcard';
  const isLocal = configuredUri.includes('localhost') || configuredUri.includes('127.0.0.1');

  console.log(`🔍 Probing MongoDB: ${isLocal ? 'local' : 'Atlas'}...`);

  const reachable = await probeUri(configuredUri, isLocal ? 3000 : 5000);

  if (reachable) {
    console.log(`✅ MongoDB reachable — using configured URI\n`);
    return; // NestJS will use process.env.MONGODB_URI as-is
  }

  // Connection failed — fall back to in-memory MongoDB
  if (isLocal) {
    console.warn(`⚠️  Local MongoDB not running (ECONNREFUSED on ${configuredUri})`);
  } else {
    console.warn(`⚠️  Atlas unreachable (${configuredUri})`);
  }
  console.log('🗄️  Starting in-memory MongoDB for development...\n');

  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create({
    instance: { dbName: 'quickcard' },
  });
  const memUri = mongod.getUri();
  process.env.MONGODB_URI = memUri;
  console.log(`✅ In-memory MongoDB ready: ${memUri}`);
  console.log(`   (Data is temporary — resets on restart)\n`);

  // Keep the in-memory server alive for the process lifetime
  process.on('exit', () => mongod.stop());
  process.on('SIGINT', async () => { await mongod.stop(); process.exit(0); });
  process.on('SIGTERM', async () => { await mongod.stop(); process.exit(0); });
}

resolveMongoUri().then(() => {
  // Now start NestJS — it will read the (possibly patched) MONGODB_URI
  require('./dist/main');
}).catch(err => {
  console.error('Bootstrap failed:', err.message);
  process.exit(1);
});
