import VideoRepository from "../repositories/VideoRepository.js";

const videoRepository = new VideoRepository();

export default class HomeController {
    index(req, res) {
        videoRepository.all().then(videos => {
            res.render("index", {
                isLogin: req.session.user_id ? true : false,
                videos: videos,
            });
        });
    }
}