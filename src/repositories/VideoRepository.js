import BaseRepository from "./BaseRepository.js";
import Video from "../models/Video.js";

export default class VideoRepository extends BaseRepository {
    constructor() {
        super(Video);
    }
}