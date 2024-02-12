import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/UserRepository.js';

const userRepository = new UserRepository();

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
                res.redirect('/');
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

                res.json({
                    status: 'success',
                    message: 'User has been fetched',
                    user: user,
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
                    "notification._id": req.body.notificationId,
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
}