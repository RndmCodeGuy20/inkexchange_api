import { app } from './app';
import { envConfig } from './config/index';
import { getConnection } from '#helpers/database';

const init = async () => {
  await getConnection();
  app.listen(envConfig.APP_PORT, () => {
    console.log(`Listening on ${envConfig.HOSTNAME} http://localhost:${envConfig.APP_PORT}`);
  });
};

init().then(() => {
  console.log(`server on!`);
});
