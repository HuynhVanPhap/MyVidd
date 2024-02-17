import express from 'express';
import HomeController from "../src/controllers/HomeController.js";

const router = express.Router();
const homeController = new HomeController();

router.get('/', homeController.index);

router.get('/channel/:_id', homeController.channel);

router.get('/setting', homeController.settingView);

router.post('/setting', homeController.setting);

export default router;