import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_CONNECTION;

export const connect = async () => {
    await MongoClient.connect(url)
    .then(() => console.log(`Database (${process.env.MONGO_DATABASE}) on connecting`))
    .catch(() => console.error);
}