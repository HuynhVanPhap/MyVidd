import UserRepository from "../repositories/UserRepository.js";
import VideoRepository from "../repositories/VideoRepository.js";

const videoRepository = new VideoRepository();
const userRepository = new UserRepository();
export default class HomeController {
    index(req, res) {
        videoRepository.all().then(videos => {
            res.render("index", {
                isLogin: req.session.user_id ? true : false,
                videos: videos,
            });
        });
    }

    channel(req, res) {
        userRepository.getById(req.params._id).then(user => {
            if (user == null) {
                res.send('Channel not found !');
            } else {
                res.render('channel', {
                    isLogin: req.session.user_id ? true : false,
                    user: user,
                    isMyChannel: req.session.user_id == req.params._id,
                });
            }
        }).catch(err => console.log(`Channel : Error when get User ${err}`));
    }
}