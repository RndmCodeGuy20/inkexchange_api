import {app} from './app';
import {envConfig} from './config/index';
import {getConnection} from '#helpers/database';

let server;
const init = async () => {
  await getConnection();
  server = app.listen(envConfig.APP_PORT, () => {
    console.log(`Listening on ${envConfig.HOSTNAME} http://localhost:${envConfig.APP_PORT}`);
  });
};

init();
