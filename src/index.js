import { app } from './app';
import { envConfig } from './config/index';
import { getConnection } from '#helpers/database';
import { logger } from '#helpers/logger';

const init = async () => {
  await getConnection();
  app.listen(envConfig.APP_PORT, () => {
    logger.info(`Listening on ${envConfig.HOSTNAME} http://localhost:${envConfig.APP_PORT}`);
  });
};

init().then(() => {
  logger.info('Server started successfully');
});
