import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const url = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;

export const connect = async () => {
    await mongoose.connect(url)
    .then(() => {
        console.log(`Database (${process.env.MONGO_DATABASE}) on connecting`);
    })
    .catch(error => handleError(error));

    mongoose.connection.on('connected', () => console.log('connected'));
    mongoose.connection.on('open', () => console.log('open'));
    mongoose.connection.on('error', err => logError(err));
    mongoose.connection.on('disconnected', () => console.log('disconnected'));
    mongoose.connection.on('reconnected', () => console.log('reconnected'));
    mongoose.connection.on('disconnecting', () => console.log('disconnecting'));
    mongoose.connection.on('close', () => console.log('close'));
}