const videoHandler = (io, socket) => {
    socket.on("comment::new", comment => {
        socket.broadcast.emit('comment::add', {
            _id: comment.userId,
            name: comment.name,
            image: comment.image,
            content: comment.comment
        });

        socket.to(`personal-room::${comment.channelId}`).emit("comment::notification", {
            _id: comment.notiId,
            video_watch: comment.video_watch,
            user: {
                name: comment.name,
                image: comment.image,
            },
            content: comment.comment,
        });
    });
}

export default videoHandler;