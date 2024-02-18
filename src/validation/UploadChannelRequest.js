import { ExpressValidator } from "express-validator";
import { IMAGE_ALLOWED } from "../config/constraint";

const { checkSchema } = new ExpressValidator({
    IsImage: (value, { req }) => {
        if (req.files != undefined) {
            if(!IMAGE_ALLOWED.includes(req.files.mimetype)) {
                return Promise.reject();
            }
        }
    }
});

const uploadChannelRequest = checkSchema({
    title: {
        notEmpty: true
    },
    image: {
        IsImage: {
            errorMessage: 'The uploaded file is not in the correct format !',
        },
    },
});

export default uploadChannelRequest;