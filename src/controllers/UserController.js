import mongoose from 'mongoose';
import fse from 'fs-extra';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/UserRepository.js';
import VideoRepository from '../repositories/VideoRepository.js';
import useValidationResult from '../hook/useValidationResult.js';
import { io } from '../../index.js';

const userRepository = new UserRepository();
const videoRepository = new VideoRepository();

export default class UserController {
    signup(req, res) {
        res.render('signup');
    }

    login(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const result = errors.formatWith(error => {
                return {
                    'msg': error.msg
                };
            }).mapped();

            return res.render('login', {
                'errors': {
                    ...result
                },
                'form': {
                    ...req.body
                }
            });
        }

        userRepository.login(req.body.email)
        .then(user => {
            if (user !== null && bcrypt.compareSync(req.body.password, user.password)) {
                // Save session
                req.session.user_id = user._id;
                req.session.user_image = user.image;
                req.session.user_name = user.name;
                req.session.user_email = user.email;

                // res.redirect('/');
                res.json({
                    status: 'Success',
                    userId: user._id,
                });
            } else {
                res.render('login', {
                    'fail': 'Login is fail. Please make sure Email and Password is correct !'
                });
            }
        })
        .catch(error => console.log(error));
    }

    logout(req, res) {
        req.session.destroy();
        res.redirect('/');
    }

    store(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const result = errors.formatWith(error => {
                return {
                    'msg': error.msg
                };
            }).mapped();

            return res.render('signup', {
                'errors': {
                    ...result
                },
                'form': {
                    ...req.body
                }
            });
        }

        const passwordHash = bcrypt.hashSync(req.body.password, 10);

        userRepository.store({
            name: req.body.name,
            email: req.body.email,
            password: passwordHash
        }).then(() => {
            res.redirect('/login');
        }).catch(error => console.log(error));
    }

    getUser(req, res) {
        if (req.session.user_id) {
            userRepository.getById(req.session.user_id).then(user => {
                delete user.password;

                const notifications = user.notification.filter(item => {
                    return item.is_read === false;
                });

                res.json({
                    status: 'success',
                    message: 'User has been fetched',
                    notifications,
                });
            });
        } else {
            res.json({
                status: 'error',
                message: 'Please login to perform this action.'
            });
        }
    }

    readNotification(req, res) {
        if (req.session.user_id) {
            userRepository.updateWhere({
                $and: [{
                    _id: req.session.user_id,
                }, {
                    "notification._id": new mongoose.mongo.ObjectId(req.body.notificationId),
                }]
            }, {
                $set: {
                    "notification.$.is_read": true,
                }
            }).then(data => {
                res.json({
                    status: 'success',
                    message: 'Notification has been marked as read.'
                });
            }).catch(err => console.log(err));
        } else {
            res.json({
                status: 'error',
                message: 'Please login to perform this action.'
            });
        }
    }

    subscribe(req, res) {
        if (req.session.user_id) {
            videoRepository.getById(req.body.videoId).then(video => {
                if (req.session.uer_id == video.user._id) {
                    res.json({
                        status: 'error',
                        message: 'This is your channel. Stupid !'
                    });
                } else {
                    userRepository.getById(req.session.user_id).then(user => {
                        const filter = user.subscriptions.filter(subscribe => {
                            return subscribe._id.toString() == video.user._id.toString();
                        });

                        if (filter.length > 0) {
                            res.json({
                                status: 'error',
                                message: 'Already subscribed'
                            });
                        } else {
                            userRepository.findAndUpdate(video.user._id, {
                                $inc: {
                                    subscribers: 1
                                }
                            }, {
                                returnOriginal: false
                            }).then(userData => {
                                userRepository.update(req.session.user_id, {
                                    $push: {
                                        subscriptions: {
                                            _id: video.user._id,
                                            name: video.user.name,
                                            subscribers: userData.subscribers,
                                            image: userData.image
                                        }
                                    }
                                }).then(data => {
                                    videoRepository.findAndUpdate(req.body.videoId, {
                                        $inc: {
                                            'user.subscribers': 1
                                        }
                                    });

                                    res.json({
                                        status: 'success',
                                        message: 'Subscription has been added'
                                    });
                                }).catch(err => console.log(err));
                            }).catch(err => console.log(err));
                        }
                    }).catch(err => console.log(`Error when get user ${err}`));
                }
            }).catch(err => console.log(`Error when get video ${err}`));
        } else {
            res.json({
                status: 'error',
                message: 'Please login to perform this action.'
            });
        }
    }

    editAvatar(req, res) {
        if (req.session.user_id) {
            const errors = useValidationResult(req);
            
            if (errors !== null) {
                return res.render('/channel/'+req.session.user_id, {
                    isLogin: true,
                    errors: {
                        ...errors,
                    },
                });
            }

            const oldPath = req.file.path;
            const newPath = `public/profiles/${req.session.user_id}-${req.file.originalname}`;

            fse.copyFile(oldPath, newPath).then(() => {
                userRepository.update(req.session.user_id, {
                    $set: {
                        image: newPath
                    }
                });
                userRepository.updateWhere({
                    'subscriptions._id': req.session.user_id
                }, {
                    $set: {
                        'subscriptions.$.image': newPath
                    }
                });
                videoRepository.updateWhere({
                    'user._id': new mongoose.mongo.ObjectId(req.session.user_id)
                }, {
                    'user.image': newPath,
                });
            }).catch(err => `EditAvatar : Error when copy file ${err}`);
            
            fse.removeSync(oldPath);
            res.redirect('/channel/'+req.session.user_id);
        } else {
            res.redirect('/login');
        }
    }

    editCoverAvatar(req, res) {
        if (req.session.user_id) {
            const errors = useValidationResult(req);
            
            if (errors !== null) {
                return res.render('/channel/'+req.session.user_id, {
                    isLogin: true,
                    errors: {
                        ...errors,
                    },
                });
            }
            
            const oldPath = req.file.path;
            const newPath = `public/covers/${req.session.user_id}-${req.file.originalname}`;

            fse.copyFile(oldPath, newPath).then(() => {
                userRepository.update(req.session.user_id, {
                    $set: {
                        coverPhoto: newPath
                    }
                });
            }).catch(err => `EditAvatar : Error when copy file ${err}`);
            
            fse.removeSync(oldPath);
            res.redirect('/channel/'+req.session.user_id);
        } else {
            res.redirect('/login');
        }
    }

    subscribedView(req, res) {
        if (req.session.user_id) {
            userRepository.getById(req.session.user_id).then(user => {
                res.render('subscriptions', {
                    isLogin: true,
                    user: user
                })
            }).catch(err => console.log(`SubscribedView : Error when get user ${err}`));
        } else {
            res.redirect('/login');
        }
    }

    subscribedRemove(req, res) {
        if (req.session.user_id) {
            userRepository.update(req.session.user_id, {
                $pull: {
                    subscriptions: {
                        _id: req.body._id
                    }
                }
            });

            userRepository.update(req.body._id, {
                $inc: {
                        subscribers: -1
                    }
            });

            videoRepository.updateWhere({
                'user._id': req.body._id
            }, {
                $inc: {
                    'user.subscribers': -1
                }
            });

            res.redirect('/user/subscribed');
        } else {
            res.redirect('/login');
        }
    }
}
