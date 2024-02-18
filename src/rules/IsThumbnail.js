import { IMAGE_ALLOWED } from "../config/constraint.js";

const IsThumbnail = async (value, { req }) => {
    if (req.files['thumbnail'] != undefined) {
        if(!IMAGE_ALLOWED.includes(req.files['thumbnail'][0].mimetype)) {
            return Promise.reject();
        }
    }
}

export default IsThumbnail;