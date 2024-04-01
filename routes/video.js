import express from 'express';
import VideoController from "../src/controllers/VideoController.js";
import uploadRequest from '../src/validation/UploadRequest.js';
import useMulter from '../src/hook/useMulter.js';
import uploadChannelRequest from '../src/validation/UploadChannelRequest.js';

const router = express.Router();
const videoController = new VideoController();

router.get('/upload', videoController.uploadView);

router.post('/upload', useMulter().fields([
    {name: 'video', maxCount: 1},
    {name: 'thumbnail', maxCount: 1},
]), uploadRequest, videoController.upload);

router.get('/watch/:watch', videoController.watch);

router.get('/video/get/:_id', videoController.streaming);

router.get('/video/edit/:watch', videoController.editView);

router.post('/video/edit', useMulter().single('thumbnail'), videoController.edit);

router.post('/video/delete', videoController.delete);

router.post('/video/do-like', videoController.doLike);

router.post('/video/do-dislike', videoController.doDisLike);

router.post('/video/comment', videoController.comment);

router.post('/video/reply', videoController.reply);

router.post('/video/history', videoController.history);

router.get('/video/history/list', videoController.historyList);

router.post('/video/history/remove', videoController.historyRemove);

router.get('/video/related/:category/:videoId', videoController.related);

router.post('/video/playlist/create', uploadChannelRequest, videoController.playlistCreate);

router.get('/video/playlist/:_id/:watch', videoController.playlistView);

router.post('/video/playlist/remove', videoController.playlistRemove);

router.get('/video/search', videoController.search);

router.get('/video/search/category/:category', videoController.searchCategory);

router.get('/video/search/tags/:tag', videoController.searchTag);

export default router;