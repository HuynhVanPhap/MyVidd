import { ExpressValidator } from "express-validator";
import { IMAGE_ALLOWED } from "../config/constraint.js";

const { checkSchema } = new ExpressValidator({
    IsImage: async (value, { req }) => {
        if (req.file != undefined) {
            if(!IMAGE_ALLOWED.includes(req.file.mimetype)) {
                return Promise.reject();
            }
        }
    }
});

const uploadChannelRequest = checkSchema({
    // title: {
    //     notEmpty: true
    // },
    image: {
        IsImage: {
            errorMessage: 'The uploaded file is not in the correct format !',
        },
    },
});

export default uploadChannelRequest;