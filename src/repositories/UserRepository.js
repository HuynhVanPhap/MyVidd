import BaseRepository from "./BaseRepository.js";
import User from "../models/User.js";

export default class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async login(email) {
        const user = await this.model.findOne({ email: email }).exec();

        return user;
    }

    async checkEmailIsset(email) {
        const exists = await this.model.exists({ email: email }).exec();

        return exists;
    }
}