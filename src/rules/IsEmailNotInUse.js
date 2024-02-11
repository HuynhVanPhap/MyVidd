import { Error } from "mongoose";
import UserRepository from "../repositories/UserRepository.js"

const userRepository = new UserRepository();

const IsEmailNotInUse = async (value) => {
    const user = await userRepository.checkEmailIsset(value);

    if (user) {
        throw new Error('E-mail already in use');
    }

    /**
     * Has Error when use following code
     * Error : throw new Error('E-mail already in use');
     * 
     * https://stackoverflow.com/questions/48875776/how-to-use-a-custom-express-validator
     */
    // userRepository.checkEmailIsset(value).then(user => {
    //     console.log(user);
    //     if (user) {
    //         throw new Error('E-mail already in use');
    //     }
    // }).catch(console.error());
}

export default IsEmailNotInUse;