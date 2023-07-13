import { app } from './app';
import { envConfig } from './config/index';
import { getConnection, getMongoConnection } from '#helpers/index';
import { logger } from '#helpers/logger';

/**
 * @description - init function is the entry point of the application,
 * it connects to the database and starts the server.
 * @return {Promise<void>}
 */
const init = async () => {
  await getConnection();
  await getMongoConnection();
  app.listen(envConfig.APP_PORT, () => {
    logger.info(
        `Listening on ${envConfig.HOSTNAME} http://localhost:${envConfig.APP_PORT}`,
    );
  });
};


const exitHandler = () => {
  if (app) {
    app.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.fatal(`Fatal error ${error.message}`);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (app) {
    app.close();
  }
});

/**
 * @description - start the server, handles promise rejections
 * and exits the process if an error occurs.
 */
init()
    .then(() => {
      logger.info('Server started successfully');
    })
    .catch((error) => {
      logger.error(error);
      process.exit(1);
    });
