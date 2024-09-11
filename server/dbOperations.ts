import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

if (!mongoUri || !dbName) {
  throw new Error('MongoDB URI or database name is missing');
}

const client = new MongoClient(mongoUri);

async function getCollection(collectionName: string) {
  await client.connect();
  return client.db(dbName).collection(collectionName);
}

export async function insertOne(collectionName: string, document: any) {
  const collection = await getCollection(collectionName);
  return collection.insertOne(document);
}

export async function updateOne(collectionName: string, filter: any, update: any) {
  const collection = await getCollection(collectionName);
  return collection.updateOne(filter, { $set: update });
}

export async function findOne(collectionName: string, filter: any) {
  const collection = await getCollection(collectionName);
  return collection.findOne(filter);
}

export async function findMultiple(collectionName: string, filter: any) {
  const collection = await getCollection(collectionName);
  return collection.find(filter).toArray();
}

export async function deleteOne(collectionName: string, filter: any) {
  const collection = await getCollection(collectionName);
  return collection.deleteOne(filter);
}

export async function updateMultiple(collectionName: string, filter: any, update: any) {
  const collection = await getCollection(collectionName);
  return collection.updateMany(filter, { $set: update });
}

export async function deleteMultiple(collectionName: string, filter: any) {
  const collection = await getCollection(collectionName);
  return collection.deleteMany(filter);
}

export async function insertMultiple(collectionName: string, documents: any[]) {
  const collection = await getCollection(collectionName);
  return collection.insertMany(documents);
}

// Don't forget to close the connection when your application shuts down
export async function closeConnection() {
  await client.close();
}
