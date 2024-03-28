import Session from "../models/Session.js";
import BaseRepository from "./BaseRepository.js";

export default class SessionRepository extends BaseRepository {
    constructor() {
        super(Session);
    }
}