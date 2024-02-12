import express from 'express';
import UserController from '../src/controllers/UserController.js';

const router = express.Router();
const userController = new UserController();

router.get('/get-user', userController.getUser);

router.post('/read-notification', userController.readNotification);
export default router;