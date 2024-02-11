import { ExpressValidator } from "express-validator";
import IsImage from "../rules/IsImage.js";
import IsVideo from "../rules/IsVideo.js";

const { checkSchema } = new ExpressValidator({});

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
        custom: {
            options: IsVideo,
            errorMessage: 'The uploaded file is not in the correct format !'
        },
    },
    thumbnail: {
        custom: {
            options: IsImage,
            errorMessage: 'The uploaded file is not in the correct format !'
        },
    },
});

export default uploadRequest;