import { app } from './app';
import { envConfig } from './config/index';
import { getConnection } from '#helpers/database';
import { logger } from '#helpers/logger';

/**
 * @description - init function is the entry point of the application,
 * it connects to the database and starts the server.
 * @return {Promise<void>}
 */
const init = async () => {
  await getConnection();
  app.listen(envConfig.APP_PORT, () => {
    logger.info(`Listening on ${envConfig.HOSTNAME} http://localhost:${envConfig.APP_PORT}`);
  });
};

/**
 * @description - start the server, handles promise rejections
 * and exits the process if an error occurs.
 */
init().then(() => {
  logger.info('Server started successfully');
}).catch((error) => {
  logger.error(error);
  process.exit(1);
});
