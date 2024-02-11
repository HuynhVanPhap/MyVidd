import fse from 'fs-extra';
import { getVideoDurationInSeconds } from 'get-video-duration';
import useValidationResult from '../hook/useValidationResult.js';
import UserRepository from '../repositories/UserRepository.js';
import VideoRepository from "../repositories/VideoRepository.js";

const userRepository = new UserRepository();
const videoRepository = new VideoRepository();

export default class VideoController {
    uploadView(req, res) {
        if (req.session.user_id) {
            res.render('upload', {
                isLogin: true,
            });
        } else {
            res.redirect('/login');
        }
    }

    async upload(req, res) {
        if (req.session.user_id) {
            const errors = useValidationResult(req);
            
            if (errors !== null) {
                return res.render('upload', {
                    isLogin: true,
                    errors: {
                        ...errors,
                    },
                    form: {
                        ...req.body
                    }
                });
            }

            const oldPathThumbnail = req.files['thumbnail'][0].path;
            const pathThumbnail = `public/thumbnails/${new Date().getTime()}-${req.files['thumbnail'][0].originalname}`;
            const oldPathVideo = req.files['video'][0].path;
            const pathVideo = `public/videos/${new Date().getTime()}-${req.files['video'][0].originalname}`;

            fse.copyFile(oldPathThumbnail, pathThumbnail)
                .then(() => {
                    console.log('Thumbnail upload done !');
                })
                .catch(err => console.log(`Error when thumbnail rename ${err}`));
    
            fse.copyFile(oldPathVideo, pathVideo)
                .then(() => {
                    userRepository.getById(req.session.user_id, '_id name email').then(user => {
                        const currentTime = new Date().getTime();
    
                        getVideoDurationInSeconds(pathVideo).then(duration => {
                            const hours = Math.floor(duration / 60 / 60);
                            const minutes = Math.floor(duration / 60) - (hours * 60);
                            const seconds = Math.floor(duration % 60);
    
                            // Insert in database
                            videoRepository.store({
                                user: {
                                    _id: user._id,
                                    name: user.name,
                                    image: '',
                                    subscribers: 0,
                                },
                                filePath: pathVideo,
                                thumbnail: pathThumbnail,
                                title: req.body.title,
                                description: req.body.description,
                                tags: req.body.tags,
                                category: req.body.category,
                                hours: hours,
                                minutes: minutes,
                                seconds: seconds,
                                watch: currentTime,
                            })
                            .then((video) => {
                                console.log(`Store new video !`);
                                
                                userRepository.update(user._id, {
                                    $push: {
                                        videos: {
                                            _id: video._id,
                                            title: video.title,
                                            views: video.views,
                                            thumbnail: video.thumbnail,
                                            watch: video.watch,
                                        }
                                    }
                                })
                                .then(() => console.log(`Update User success !`))
                                .catch(err => `Error when update user ${err}`);
                            })
                            .catch(error => console.log(`Error when store video ${error}`));
                        });
                    });
                })
                .catch(err => console.log(`Error when video rename ${err}`));

            fse.removeSync(oldPathThumbnail);
            fse.removeSync(oldPathVideo);

            return res.redirect('/upload');
        }

        return res.redirect('/login');  
    }

    watch(req, res) {
        videoRepository.getWhere({ watch: parseInt(req.params.watch) })
        .then(video => {
            if(video === null) {
                res.send('Video not found !');
            } else {
                videoRepository.update(video._id, {
                    $inc: {
                        "views": 1
                    }
                });

                res.render("video/watch", {
                    isLogin: req.session.user_id ? true : false,
                    video: video
                });
            }
        })
        .catch(err => console.log(`Error when get video watch ${err}`));
    }

    doLike(req, res) {
        if (req.session.user_id) {
            videoRepository.getWhere({
                $and: [{
                    '_id': req.body.videoId,
                }, {
                    'likers._id': req.session.user_id
                }]
            }).then(video => {
                if (video == null) {
                    videoRepository.update(req.body.videoId, {
                        $push: {
                            likers: {
                                _id: req.session.user_id,
                            }
                        }
                    }).then(data => {
                        res.json({
                            status: 'success',
                            message: 'Video has been liked'
                        });
                    }).catch(err => console.log(`Error when liked video ${err}`));
                } else {
                    res.json({
                        status: 'error',
                        message: 'Already liked this video'
                    });
                }
            }).catch(err => console.log(`Error when found video ${err}`));
        } else {
            res.json({
                status: 'error',
                message: 'Please login !'
            });
        }
    }

    doDisLike(req, res) {
        if (req.session.user_id) {
            videoRepository.getWhere({
                $and: [{
                    '_id': req.body.videoId,
                }, {
                    'dislikers._id': req.session.user_id
                }]
            }).then(video => {
                if (video == null) {
                    videoRepository.update(req.body.videoId, {
                        $push: {
                            dislikers: {
                                _id: req.session.user_id,
                            }
                        }
                    }).then(data => {
                        res.json({
                            status: 'success',
                            message: 'Video has been liked'
                        });
                    }).catch(err => console.log(`Error when disliked video ${err}`));
                } else {
                    res.json({
                        status: 'error',
                        message: 'Already disliked this video'
                    });
                }
            }).catch(err => console.log(`Error when found video ${err}`));
        } else {
            res.json({
                status: 'error',
                message: 'Please login !'
            });
        }
    }
}