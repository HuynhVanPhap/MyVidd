import SessionRepository from "../repositories/SessionRepository.js";

const iOMiddleware = io => {
    io.use((socket, next) => {
        const userId = socket.handshake.auth.userId;

        if (userId != undefined) {
            socket.userId = userId;
        }

        next();
    });
};

export default iOMiddleware;