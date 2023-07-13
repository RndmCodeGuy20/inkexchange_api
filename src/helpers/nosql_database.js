import mongoose from 'mongoose';
import { logger } from '#helpers/logger';
import { envConfig } from '../config/index';

export const getMongoConnection = async () => {
  try {
    // eslint-disable-next-line max-len
    const mongoUrl = `mongodb+srv://${envConfig.MONGO_DB_USERNAME}:${envConfig.MONGO_DB_PASSWORD}@clusterinkexchange.9jinoat.mongodb.net/?retryWrites=true&w=majority`;
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    logger.info(`connected to mongo database : ${envConfig.MONGO_DB_NAME}!`);
  } catch (error) {
    logger.error(error);
  }
};
