import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    coverPhoto: { type: String, default: '' },
    image: { type: String, default: '' },
    subscribers: { type: Array, default: [] },
    subscriptions: { type: Array, default: [] },
    playlist: { type: Array, default: [] },
    videos: [{
        _id: String,
        title: String,
        views: { type: Number, default: 0 },
        thumbnail: String,
        watch: Number,
        hours: Number,
        minutes: Number,
        seconds: Number,
    }],
    history: { type: Array, default: [] },
    notification: { type: Array, default: [] },
}, {
    timestamps: true,
});

export default mongoose.model('User', userSchema);