import { app } from './app';
import { envConfig } from './config/index';
import { getConnection } from '#helpers/database';
import { logger } from '#helpers/logger';

const init = async () => {
  await getConnection();
  app.listen(envConfig.APP_PORT, () => {
    console.log(`Listening on ${envConfig.HOSTNAME} http://localhost:${envConfig.APP_PORT}`);
  });
};

init().then(() => {
  logger.debug('Server started successfully');
});
