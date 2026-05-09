import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

export async function startInMemoryMongo(): Promise<string> {
  if (mongoServer) return mongoServer.getUri();

  console.log('🔄 Starting in-memory MongoDB...');
  mongoServer = await MongoMemoryServer.create({
    instance: { port: 27017, dbName: 'quickcard' },
  });

  const uri = mongoServer.getUri();
  console.log(`✅ In-memory MongoDB started: ${uri}`);
  return uri;
}

export async function stopInMemoryMongo() {
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
}
