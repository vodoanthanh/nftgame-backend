import App from '@/app';
import Routes from '@/routes/index.route';

const app = new App(Routes);
const server = app.listen();

export default server;
