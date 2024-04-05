const userHandler = (io, socket) => {
    socket.on("user::login", login => {
        socket.join(`personal-room::${login.userId}`);

        socket.userId = login.userId;

        socket.emit('login-notification', { userId: socket.userId });
    });

    socket.on('subscribe::new', event => {
        const channelId = event.channelId;
        delete event.channelId;

        socket.to(`personal-room::${channelId}`).emit("subscribe::add", {
            ...event,
        });
    });
}

export default userHandler;