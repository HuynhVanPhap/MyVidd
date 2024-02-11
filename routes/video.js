import express from 'express';
import VideoController from "../src/controllers/VideoController.js";
import uploadRequest from '../src/validation/UploadRequest.js';
import useMulter from '../src/hook/useMulter.js';

const router = express.Router();
const videoController = new VideoController();

router.get('/upload', videoController.uploadView);

router.post('/upload', useMulter().fields([
    {name: 'video', maxCount: 1},
    {name: 'thumbnail', maxCount: 1},
]), uploadRequest, videoController.upload);

router.get('/watch/:watch', videoController.watch);

export default router;