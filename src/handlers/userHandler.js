const userHandler = (io, socket) => {
    socket.on("user::login", login => {
        socket.join(`personal-room::${login.userId}`);

        socket.userId = login.userId;

        socket.emit('login-notification', { userId: socket.userId });
    });
}

export default userHandler;