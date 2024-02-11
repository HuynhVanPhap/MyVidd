import express from 'express';
import UserController from '../src/controllers/UserController.js';
import loginRequest from '../src/validation/LoginRequest.js';
import userRequest from '../src/validation/UserRequest.js';

const router = express.Router();
const userController = new UserController();

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', loginRequest, userController.login);

router.get('/signup', userController.signup);

router.post('/signup', userRequest, userController.store);

router.get('/logout', userController.logout);

export default router;