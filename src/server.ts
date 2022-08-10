import App from '@/app';
import Routes from '@/routes/index.route';
import validateEnv from '@/utils/validateEnv';
import 'dotenv/config';

validateEnv();

const app = new App(Routes);

app.listen();
