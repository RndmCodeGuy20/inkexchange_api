import {hostname} from 'os';


const env = require('dotenv');
env.config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.local',
});

const {
  NODE_ENV,
  APP_PORT,
} = process.env;

export const envConfig = {
  ENV: NODE_ENV,
  HOSTNAME: hostname(),

  APP_PORT: parseFloat(APP_PORT),
};
