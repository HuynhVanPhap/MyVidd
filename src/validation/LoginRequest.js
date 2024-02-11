import { checkSchema } from "express-validator";

const loginRequest = checkSchema({
    email: {
        isEmail: {
            bail: true,
            errorMessage: 'Email is not format allowed !',
        }
    },
    password: {
        notEmpty: true,
        errorMessage: 'Password is not empty !'
    }
});

export default loginRequest;