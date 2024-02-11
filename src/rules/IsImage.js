import { IMAGE_ALLOWED } from "../config/constraint.js";

const IsImage = async (value, { req }) => {
    if(!IMAGE_ALLOWED.includes(req.files['thumbnail'][0].mimetype)) {
        return Promise.reject();
    }
}

export default IsImage;