import { hostname } from 'os';


const env = require('dotenv');
env.config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.local',
});

const {
  NODE_ENV,
  APP_PORT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  JWT_SECRET,
} = process.env;

export const envConfig = {
  ENV: NODE_ENV,
  HOSTNAME: hostname(),
  APP_PORT: parseFloat(APP_PORT),
  DB_HOST: DB_HOST,
  DB_PORT: DB_PORT,
  DB_USER: DB_USER,
  DB_PASSWORD: DB_PASSWORD,
  DB_NAME: DB_NAME,
  JWT_SECRET_KEY: JWT_SECRET,
};
