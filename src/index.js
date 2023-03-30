import {app} from './app';
import {envConfig} from '#configs/index';

let server;
const init = () => {
  // await getConnection();
  server = app.listen(envConfig.APP_PORT, () => {
    console.log(`Listening on  http://localhost:${envConfig.APP_PORT}`);
  });
};

init();
