import mongoose from 'mongoose';
import fse from 'fs-extra';
import { getVideoDurationInSeconds } from 'get-video-duration';
import useValidationResult from '../hook/useValidationResult.js';
import UserRepository from '../repositories/UserRepository.js';
import VideoRepository from "../repositories/VideoRepository.js";
import useAuthData from '../hook/useAuthData.js';
import { io } from '../../index.js';

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
                    video: video,
                    playlist: [],
                    playlistId: '',
                    auth: useAuthData(req.session),
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

    comment(req, res) {
        if (req.session.user_id) {
            userRepository.getById(req.session.user_id).then(user => {
                videoRepository.findAndUpdate(req.body.videoId, {
                    $push: {
                        comments: {
                            _id: new mongoose.mongo.ObjectId(),
                            user: {
                                _id: user._id,
                                name: user.name,
                                image: user.image
                            },
                            comment: req.body.comment,
                            createAt: new Date().getTime(),
                            replies: [],
                        } 
                    }
                }).then(data => {
                    const channelId = data.user._id;
                    const notiId = new mongoose.mongo.ObjectId();

                    userRepository.findAndUpdate(channelId, {
                        $push: {
                            notification: {
                                _id: notiId,
                                type: 'new_comment',
                                content: req.body.comment,
                                is_read: false,
                                video_watch: data.watch,
                                user: {
                                    _id: user._id,
                                    name: user.name,
                                    image: user.image
                                }
                            }
                        }
                    });

                    res.json({
                        status: 'success',
                        message: 'Comment has been posted !',
                        channelId: channelId,
                        notiId: notiId,
                        video_watch: data.watch,
                        userId: user._id,
                        name: user.name,
                        image: user.image,
                    });

                }).catch(err => console.log(`Error when post comment ${err}`));
            }).catch(err => console.log(err));
            // res.json({
            //     status: 'success',
            //     message: 'Comment has been posted !',
            // });
        } else {
            res.json({
                status: 'error',
                message: 'Please login !'
            });
        }
    }

    reply(req, res) {
        if (req.session.user_id) {
            const reply = req.body.reply;
            const commentId = req.body.commentId;
            
            userRepository.getById(req.session.user_id).then(user => {
                videoRepository.findWhereAndUpdate({
                    $and: [{
                        "comments._id": new mongoose.mongo.ObjectId(commentId)
                    }]
                }, {
                    $push: {
                        "comments.$.replies": {
                            _id: new mongoose.mongo.ObjectId(),
                            user: {
                                _id: user._id,
                                name: user.name,
                                image: user.image,
                            },
                            reply: reply,
                            createAt: new Date().getTime()
                        }
                    }
                }).then((video) => {
                    video.comments.forEach(comment => {
                        if (comment._id == commentId) {
                            userRepository.update(comment.user._id, {
                                $push: {
                                    notification: {
                                        _id: new mongoose.mongo.ObjectId(),
                                        type: 'new_reply',
                                        content: reply,
                                        is_read: false,
                                        video_watch: video.watch,
                                        user: {
                                            _id: user._id,
                                            name: user.name,
                                            image: user.image,
                                        }
                                    }
                                }
                            });
                        }
                    });

                    res.json({
                        status: 'success',
                        message: 'Reply has been posted',
                        user: {
                            _id: user._id,
                            name: user.name,
                            image: user.image,
                        }
                    });
                }).catch(err => `Error when post reply ${err}`);
            }).catch(err => console.log(err));
        } else {
            res.json({
                status: 'error',
                message: 'Please login !'
            });
        }
    }

    related(req, res) {
        videoRepository.findMany({
            $and: [{
                category: req.params.category
            }, {
                _id: {
                    $ne: new mongoose.mongo.ObjectId(req.params.videoId)
                }
            }]
        }).then(videos => {
            // Shuffle videos
            // for (let i = 0; i < videos.length; i++) {
            //     const x = videos[i];
            //     const y = Math.floor(Math.random() + (i+1));
            //     videos[i] = videos[y];
            //     videos[y] = x;
            // }

            res.json(videos);
        }).catch(err => console.log(err));
    }

    history(req, res) {
        if (req.session.user_id) {
            videoRepository.getById(req.body.videoId).then(video => {
                userRepository.getWhere({
                    $and: [{
                        _id: req.session.user_id
                    }, {
                        'history.videoId': req.body.videoId
                    }]
                }).then(user => {
                    if (user == null) {
                        userRepository.update(req.session.user_id, {
                            $push: {
                                history: {
                                    _id: new mongoose.mongo.ObjectId(),
                                    videoId: req.body.videoId,
                                    watch: video.watch,
                                    title: video.title,
                                    watched: req.body.watched,
                                    thumbnail: video.thumbnail,
                                    minutes: video.minutes,
                                    seconds: video.seconds
                                }
                            }
                        });

                        res.json({
                            status: 'success',
                            message: 'History has been added'
                        })
                    } else {
                        userRepository.updateWhere({
                            $and: [{
                                _id: new mongoose.mongo.ObjectId(req.session.user_id),
                            }, {
                                'history.videoId': req.body.videoId
                            }]
                        }, {
                            $set: {
                                'history.$.watched': req.body.watched
                            }
                        });

                        res.json({
                            status: 'success',
                            message: 'History has been updated'
                        });
                    }
                }).catch(err => console.log(`history: Error when take user ${err}`));
            }).catch(err => console.log(`history: Error when take video ${err}`));
        } else {
            res.json({
                status: 'error',
                message: 'Please login to perform this action.'
            });
        }
    }

    historyList(req, res) {
        if (req.session.user_id) {
            userRepository.getById(req.session.user_id).then(user => {
                res.render('video/history', {
                    isLogin: true,
                    videos: user.history
                });
            }).catch(err => console.log(`HistoryList: Error when get User ${err}`));
        } else {
            res.redirect('/login');
        }
    }

    historyRemove(req, res) {
        if (req.session.user_id) {
            userRepository.updateWhere({
                $and: [{
                    _id: new mongoose.mongo.ObjectId(req.session.user_id),
                }, {
                    'history.videoId': req.body.videoId
                }]
            }, {
                $pull: {
                    history: {
                        videoId: req.body.videoId
                    }
                }
            });

            res.redirect('/video/history/list');
        } else {
            res.redirect('/login');
        }
    }

    editView(req, res) {
        if (req.session.user_id) {
            videoRepository.getWhere({
                $and: [{
                    watch: parseInt(req.params.watch)
                }, {
                    'user._id': new mongoose.mongo.ObjectId(req.session.user_id)
                }]
            }).then(video => {
                if (video == null) {
                    res.send('Video not found !');
                } else {
                    userRepository.getById(req.session.user_id).then(user => {
                        res.render('video/edit', {
                            isLogin: true,
                            video: video,
                            user: user
                        });
                    }).catch(err => console.log(`EditView : Error when get user ${err}`));
                }
            }).catch(err => `EditView : Error when get video ${err}`);
        } else {
            res.redirect('/login');
        }
    }

    edit(req, res) {
        if (req.session.user_id) {
            videoRepository.getWhere({
                $and: [{
                    _id: new mongoose.mongo.ObjectId(req.body.videoId)
                }, {
                    'user._id': new mongoose.mongo.ObjectId(req.session.user_id)
                }]
            }).then(video => {
                if (video == null) {
                    res.send('Sorry this not your video');
                } else {
                    const oldPath = req.file.path;
                    const newPath = `public/thumbnails/${new Date().getTime()}-${req.file.originalname}`;
                    const videoThumb = video.thumbnail;

                    fse.copyFile(oldPath, newPath).then(() => {
                        videoRepository.update(video._id, {
                            $set: {
                                title: req.body.title,
                                description: req.body.description,
                                tags: req.body.tags,
                                thumbnail: newPath,
                                category: req.body.category,
                                playlist: req.body.playlist
                            }

                        }).then(data => {
                            userRepository.findWhereAndUpdate({
                                $and: [{
                                    _id: new mongoose.mongo.ObjectId(req.session.user_id)
                                }, {
                                    'videos._id': new mongoose.mongo.ObjectId(video._id)
                                }]
                            }, {
                                $set: {
                                    'videos.$.title': req.body.title,
                                    'videos.$.thumbnail': newPath
                                }
                            });

                            if (req.body.playlist == '') {
                                userRepository.updateWhere({
                                    $and: [{
                                        _id: req.session.user_id
                                    }, {
                                        'playlist._id': new mongoose.mongo.ObjectId(video.playlist)
                                    }]
                                }, {
                                    $pull: {
                                        'playlist.$.videos': {
                                            _id: new mongoose.mongo.ObjectId(req.body.videoId)
                                        }
                                    }
                                });
                            } else {
                                if (video.playlist != '') {
                                    userRepository.updateWhere({
                                        $and: [{
                                            _id: req.session.user_id
                                        }, {
                                            'playlist._id': new mongoose.mongo.ObjectId(video.playlist)
                                        }]
                                    }, {
                                        $pull: {
                                            'playlist.$.videos': {
                                                _id: new mongoose.mongo.ObjectId(req.body.videoId)
                                            }
                                        }
                                    });
                                }

                                userRepository.updateWhere({
                                    $and: [{
                                        _id: req.session.user_id
                                    }, {
                                        'playlist._id': new mongoose.mongo.ObjectId(req.body.playlist)
                                    }]
                                }, {
                                    $push: {
                                        'playlist.$.videos': {
                                            _id: new mongoose.mongo.ObjectId(req.body.videoId),
                                            title: req.body.title,
                                            watch: video.watch,
                                            thumbnail: newPath
                                        }
                                    }
                                });
                            }
                        });
                    }).catch(err => console.log(`Edit : copy file error ${err}`));
                    
                    fse.removeSync(oldPath);
                    fse.removeSync(videoThumb);
                    res.redirect(`/video/edit/${video.watch}`);
                }
            }).catch(err => console.log(`Edit : Error when get video ${err}`));
        }
    }

    delete(req, res) {
        if (req.session.user_id) {
            videoRepository.getWhere({
                $and: [{
                    _id: new mongoose.mongo.ObjectId(req.body._id)
                }, {
                    'user._id': new mongoose.mongo.ObjectId(req.session.user_id),
                }]
            }).then(video => {
                if (video == null) {
                    res.send('Video not found !');
                    return false;
                } else {
                    fse.removeSync(video.filePath);
                    fse.removeSync(video.thumbnail);

                    videoRepository.removeWhere({
                        $and: [{
                            _id: new mongoose.mongo.ObjectId(req.body._id)
                        }, {
                            'user._id': new mongoose.mongo.ObjectId(req.session.user_id)
                        }]
                    });

                    userRepository.findAndUpdate(req.session.user_id, {
                        $pull: {
                            videos: {
                                _id: new mongoose.mongo.ObjectId(req.body._id)
                            }
                        }
                    });

                    userRepository.updateMany({}, {
                        $pull: {
                            history: {
                                videoId: req.body._id.toString(),
                            }
                        }
                    });

                    userRepository.getById(req.session.user_id).then(user => {
                        let playlistId = '';

                        user.playlist.forEach(playlist => {
                            playlist.videos.forEach(video => {
                                if (video._id == req.body._id) {
                                    playlistId = playlist._id;
                                    return true;
                                }
                            });
                        });

                        if (playlistId != '') {
                            userRepository.updateWhere({
                                $and: [{
                                    _id: new mongoose.mongo.ObjectId(req.session.user_id)
                                }, {
                                    'playlist._id': new mongoose.mongo.ObjectId(playlistId)
                                }]
                            }, {
                                $pull: {
                                    'playlist.$.videos': {
                                        _id: req.body._id
                                    }
                                }
                            });
                        }
                    }).catch(err => console.log(`Video Delete : Error ${err}`));
                }
            }).catch(err => console.log(`Video Delete : Error when get video ${err}`));

            res.redirect(`/channel/${req.session.user_id}`);
        } else {
            res.redirect('/login');
        }
    }

    playlistCreate(req, res) {
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
            
            userRepository.update(req.session.user_id, {
                $push: {
                    playlist: {
                        _id: new mongoose.mongo.ObjectId(),
                        title: req.body.title,
                        videos: []
                    }
                }
            });

            res.redirect(`/channel/${req.session.user_id}`);
        } else {
            res.redirect('/login');
        }
    }

    playlistView(req, res) {
        videoRepository.getWhere({
            $and: [{
                watch: parseInt(req.params.watch)
            }, {
                playlist: req.params._id
            }]
        }).then(video => {
            if (video == null) {
                res.send('Video not found !');
            } else {
                videoRepository.update(video._id, {
                    $inc: {
                        views: 1
                    }
                });
                userRepository.getById(video.user._id).then(user => {
                    let playlistVideos = [];

                    user.playlist.forEach(playlist => {
                        if (playlist._id == req.params._id) {
                            playlistVideos = playlist.videos;
                            return true;
                        }
                    });

                    res.render('video/watch', {
                        isLogin: req.session.user_id ? true : false,
                        video: video,
                        playlist: playlistVideos,
                        playlistId: req.params._id
                    });
                })
            }
        }).catch(err => console.log(`PlaylistView : Error ${err}`));
    }

    playlistRemove(req, res) {
        if (req.session.user_id) {
            userRepository.getWhere({
                $and: [{
                    _id: req.session.user_id
                }, {
                    'playlist._id': new mongoose.mongo.ObjectId(req.body._id)
                }]
            }).then(user => {
                if (user == null) {
                    res.send('Playlist not found !');
                    return true;
                }

                userRepository.update(req.session.user_id, {
                    $pull: {
                        'playlist': {
                            _id: new mongoose.mongo.ObjectId(req.body._id),
                        }
                    }
                }).catch(err => console.log(`PlaylistRemove : Error when update user ${err}`));

                videoRepository.updateMany({
                    'playlist': req.body._id
                }, {
                    $set: {
                        playlist: '',
                    }
                }).catch(err => console.log(`PlaylistRemove : Error when update video ${err}`));

                res.redirect(`/channel/${req.session.user_id}`);
            }).catch(err => console.log(`PlaylistRemove : Error when get user ${err}`));
        } else {
            res.redirect('/login');
        }
    }

    search(req, res) {
        videoRepository.findMany({
            title: {
                $regex: req.query.title
            }
        }).then(videos => {
            console.log(videos);
            res.render('video/search', {
                isLogin: req.session.user_id ? true : false,
                videos: videos,
                query: req.query.title
            });
        }).catch(err => console.log(`search : Error when get videos ${err}`));
    }

    searchCategory(req, res) {
        videoRepository.findMany({
            category: {
                $regex: '.*?' + req.params.category + '.*?'
            }
        }).then(videos => {
            console.log(videos);
            res.render('video/search', {
                isLogin: req.session.user_id ? true : false,
                videos: videos,
                query: req.params.category
            });
        }).catch(err => console.log(`searchCategory : Error when get videos ${err}`));
    }

    searchTag(req, res) {
        videoRepository.findMany({
            tags: {
                $regex: '.*' + req.params.tag + '.*',
                $options: 'i'
            }
        }).then(videos => {
            console.log(videos);
            res.render('video/search', {
                isLogin: req.session.user_id ? true : false,
                videos: videos,
                query: req.params.tag
            });
        }).catch(err => console.log(`searchTag : Error when get videos ${err}`));
    }
}