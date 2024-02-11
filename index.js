import { routes } from './routes/index.js';
import app from './server.js';
import { connect } from './database.config.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.APP_PORT;

routes(app);

connect();

app.listen(port, () => {
    console.log(`MyVidd listening on port ${port}`);
});