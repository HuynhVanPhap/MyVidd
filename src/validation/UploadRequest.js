import { ExpressValidator } from "express-validator";
import IsThumbnail from "../rules/IsThumbnail.js";
import IsThumbnailEmpty from "../rules/IsThumbnailEmpty.js";
import IsVideo from "../rules/IsVideo.js";
import IsVideoEmpty from "../rules/IsVideoEmpty.js";

const { checkSchema } = new ExpressValidator({
    IsThumbnail,
    IsThumbnailEmpty,
    IsVideo,
    IsVideoEmpty
});

const uploadRequest = checkSchema({
    title: {
        notEmpty: true,
        errorMessage: 'Title is not empty !',
    },
    description: {
        notEmpty: true,
        errorMessage: 'Description is not empty !',
    },
    tags: {
        notEmpty: true,
        errorMessage: 'Tags is not empty !',
    },
    category: {
        notEmpty: true,
        errorMessage: 'Category is not empty !',
    },
    video: {
        IsVideoEmpty: {
            errorMessage: 'The empty file upload not allowed !'
        },
        IsVideo: {
            errorMessage: 'The uploaded file is not in the correct format !'
        },
    },
    thumbnail: {
        IsThumbnailEmpty: {
            errorMessage: 'The empty file upload not allowed !',
        },
        IsThumbnail: {
            errorMessage: 'The uploaded file is not in the correct format !',
        },
    },
});

export default uploadRequest;