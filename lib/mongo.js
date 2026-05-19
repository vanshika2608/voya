import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME || 'voya';

let cached = global._voyaMongo;
if (!cached) cached = global._voyaMongo = { client: null, promise: null };

export async function getDb() {
  if (cached.client) return cached.client.db(dbName);
  if (!cached.promise) cached.promise = new MongoClient(uri).connect();
  cached.client = await cached.promise;
  return cached.client.db(dbName);
}
