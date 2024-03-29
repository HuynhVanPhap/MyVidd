import { VIDEO_ALLOWED } from "../config/constraint.js";

const IsVideo = async (value, { req }) => {
    if (req.files['video'] != undefined) {
        if(!VIDEO_ALLOWED.includes(req.files['video'][0].mimetype)) {
            return Promise.reject();
        }
    }
}

export default IsVideo;