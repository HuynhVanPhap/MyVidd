import { Server } from 'socket.io';
import { routes } from './routes/index.js';
import app from './server.js';
import { connect } from './database.config.js';
import dotenv from 'dotenv';
import videoHandler from './src/handlers/videoHandler.js';
import iOMiddleware from './src/middleware/iOMiddleware.js';
import userHandler from './src/handlers/userHandler.js';

dotenv.config();

const port = process.env.APP_PORT;

routes(app);

connect();

// Return a server instance
const server = app.listen(port, () => {
    console.log(`MyVidd listening on port ${port}`);
});

export const io = new Server(server, {
    // connectionStateRecovery: {}
});

const onConnection = socket => {
    if (socket.userId != undefined) {
        socket.join(`personal-room::${socket.userId}`);
    }

    userHandler(io, socket);
    videoHandler(io, socket);
};

iOMiddleware(io);

io.on('connection', onConnection);