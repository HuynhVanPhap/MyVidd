import express from 'express';
import HomeController from "../src/controllers/HomeController.js";

const router = express.Router();
const homeController = new HomeController();

router.get('/', homeController.index);

export default router;