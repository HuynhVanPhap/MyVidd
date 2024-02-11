import { ExpressValidator } from 'express-validator';
import IsEmailNotInUse from '../rules/IsEmailNotInUse.js';

const { checkSchema } = new ExpressValidator({ IsEmailNotInUse });

const userRequest = checkSchema({
    name: {
        notEmpty: true,
        errorMessage: 'Name is not empty !',
    },
    email: {
        isEmail: {
            bail: true,
            errorMessage: 'Email is not format allowed !',
        },
        custom: {
            bail: true,
            options: IsEmailNotInUse,
            errorMessage: 'Email had been registered !'
        }
    },
    password: {
        notEmpty: true,
        errorMessage: 'Password is not empty !'
    }
});

export default userRequest;