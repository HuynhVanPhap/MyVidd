import express from 'express';
import UserController from '../src/controllers/UserController.js';
import useMulter from '../src/hook/useMulter.js';

const router = express.Router();
const userController = new UserController();

router.get('/get-user', userController.getUser);

router.post('/read-notification', userController.readNotification);

router.post('/subscribe', userController.subscribe);

router.get('/subscribed', userController.subscribedView);

router.post('/subscribed/remove', userController.subscribedRemove);

router.post('/edit-avatar', useMulter().single('image'), userController.editAvatar);

router.post('/edit-cover-avatar', useMulter().single('image'), userController.editCoverAvatar);

export default router;