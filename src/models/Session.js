import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema({
    name: String,
    email: String,
    password: String,
    coverPhoto: { type: String, default: '' },
    image: { type: String, default: '' },
    subscribers: { type: Number, default: 0 },
    subscriptions: { type: Array, default: [] },
    playlist: { type: Array, default: [] },
    videos: [{
        _id: String,
        title: String,
        views: { type: Number, default: 0 },
        thumbnail: String,
        watch: Number,
    }],
    history: { type: Array, default: [] },
    notification: { type: Array, default: [] },
}, {
    timestamps: true,
});

export default mongoose.model('Session', sessionSchema);