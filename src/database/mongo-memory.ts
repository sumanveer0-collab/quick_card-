/**
 * Starts an in-memory MongoDB instance when the real URI is unreachable.
 * Used automatically in development when Atlas connection fails.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | null = null;

export async function startMemoryMongo(): Promise<string> {
  mongod = await MongoMemoryServer.create({
    instance: { dbName: 'quickcard', port: 27888 },
  });
  const uri = mongod.getUri();
  console.log(`\n🗄️  In-memory MongoDB started: ${uri}`);
  console.log(`   (Atlas unreachable — using local memory DB for dev)\n`);
  return uri;
}

export async function stopMemoryMongo(): Promise<void> {
  if (mongod) await mongod.stop();
}
