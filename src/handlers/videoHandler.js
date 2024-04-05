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

    socket.on("reply::new", data => {
        socket.broadcast.emit("reply::add", {
            commentId: data.commentId,
            name: data.user.name,
            image: data.user.image,
            reply: data.user.reply,
        });

        socket.to(`personal-room::${data.userCommentId}`).emit("reply::notification", {
            notificationId: data.notificationId,
            videoWatch: data.videoWatch,
            name: data.user.name,
            image: data.user.image,
            reply: data.user.reply,
        });
    });

    socket.on("like::new", event => {
        const channelId = event.channelId;
        delete event.channelId;

        socket.to(`personal-room::${channelId}`).emit("like::add", {
            ...event
        });
    });
}

export default videoHandler;