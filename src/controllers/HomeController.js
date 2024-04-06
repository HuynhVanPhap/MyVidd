import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UserRepository from "../repositories/UserRepository.js";
import VideoRepository from "../repositories/VideoRepository.js";
import useAuthData from '../hook/useAuthData.js';

const videoRepository = new VideoRepository();
const userRepository = new UserRepository();
export default class HomeController {
    index(req, res) {
        videoRepository.all().then(videos => {
            if (req.session.user_id) {
                res.render("index", {
                    isLogin: true,
                    auth: useAuthData(req.session),
                    videos: videos,
                });
            } else {
                res.render("index", {
                    isLogin: false,
                    videos: videos,
                });
            }

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
                    auth: useAuthData(req.session),
                });
            }
        }).catch(err => console.log(`Channel : Error when get User ${err}`));
    }

    settingView(req, res) {
        if (req.session.user_id) {
            userRepository.getById(req.session.user_id).then(user => {
                res.render('setting', {
                    isLogin: true,
                    user: user,
                    request: req.query,
                    auth: useAuthData(req.session),
                });
            }).catch(err => console.log(`settingView : Error when get User ${err}`));
        } else {
            res.redirect('/login');
        }
    }

    setting(req, res) {
        if (req.session.user_id) {
            userRepository.getById(req.session.user_id).then(user => {
                const password = (req.body.password == '') ? user.password : bcrypt.hashSync(req.body.password, 10);

                userRepository.update(user._id, {
                    $set: {
                        name: req.body.name,
                        password: password
                    }
                });

                userRepository.updateMany({
                    'subscriptions._id': req.session.user_id
                }, {
                    $set: {
                        'subscriptions.$.name': req.body.name
                    }
                });

                videoRepository.updateMany({
                    'user._id': new mongoose.mongo.ObjectId(req.session.user_id)
                }, {
                    $set: {
                        'user.name': req.body.name
                    }
                });

                res.redirect('/setting?message=success');
            }).catch(err => console.log(`setting : Error when get User ${err}`));
        } else {
            res.redirect('/login');
        }
    }
}