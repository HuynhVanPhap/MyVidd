import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
    user: {
        _id: String,
        name: String,
        image: String,
        subscribers: Number,
    },
    filePath: String,
    thumbnail: String,
    title: String,
    description: String,
    tags: String,
    category: String,
    hours: Number,
    minutes: Number,
    seconds: Number,
    watch: Number,
    playlist: { type: String, default: '' },
    views: { type: Number, default: 0 },
    likers: { type: Array, default: [] },
    dislikers: { type: Array, default: [] },
    comments: { type: Array, default: [] },
}, {
    timestamps: true,
});

export default mongoose.model('Video', videoSchema);