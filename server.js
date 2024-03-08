import express from "express";
import session from "express-session";
import { fileURLToPath } from 'url';
import path from 'path';
import MongoStore from "connect-mongo";
import dotenv from 'dotenv';
import { mongoClientPromise } from './database.config.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/public", express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs'); // Sử dụng ejs là template engine
app.set('views', path.join(__dirname, 'views')) // Chỉ định thư mục chứa views cho expressjs

/**
 * Sử dụng middleware hỗ trợ xử lý dữ liệu từ các thư viện như axios, ajax(Jquery), XMLHTTPRequest,... gửi lên và gán dữ liệu đó vào req.body
 */
app.use(express.json());
/**
 * Sử dụng middleware hỗ trợ xử lý dữ liệu từ form gửi lên và gán dữ liệu đó vào req.body
 */
app.use(express.urlencoded({extended: true}));

/**
 * Sử dụng middleware hỗ trở xử lý session
 **/
app.use(session({
    secret: "User secret Object Id",
    store: MongoStore.create({
        // mongoUrl: process.env.MONGO_CONNECTION,
        clientPromise: mongoClientPromise,
        dbName: process.env.MONGO_DATABASE,
        collectionName: 'sessions',
        touchAfter: 24 * 3600, // Lazy session update when client F5
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000,
        // secure: true
    }
}));

export default app;