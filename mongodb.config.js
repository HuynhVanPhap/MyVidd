import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection strings
const url = process.env.MONGO_CONNECTION;

export const mongoClient = new MongoClient(url);

export const connect = async () => {
    // await MongoClient.connect(url)
    await mongoClient.connect()
    .then(() => console.log(`Database (${process.env.MONGO_DATABASE}) on connecting`))
    .catch(() => console.error);
}