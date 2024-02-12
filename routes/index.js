import {default as auth} from './auth.js';
import {default as video} from './video.js';
import {default as home} from './home.js';
import {default as user} from './user.js';

export const routes = (app) => {
    app.use('/', auth);
    app.use('/', video);
    app.use('/', home);
    app.use('/user', user);
}