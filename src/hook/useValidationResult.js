import fse from 'fs-extra';
import { validationResult } from "express-validator";

const useValidationResult = (req) => {
    let errorsMapped;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        if (Object.keys(req.files).length > 0) {
            for (const key in req.files) {
                fse.removeSync(req.files[key][0].path);
            }
        }

        errorsMapped = errors.formatWith(error => {
            return {
                msg: error.msg
            };
        }).mapped();
    } else {
        errorsMapped = null;
    }

    return errorsMapped;
}

export default useValidationResult;