const mysql = require('mysql2');
const util = require('util');
import {envConfig} from '../config/index';

const pool = mysql.createPool({
  host: envConfig.DB_HOST,
  user: envConfig.DB_USER,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const getConnection = async () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error('Database connection was closed.');
          reject(new Error('Database connection was closed.'));
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
          console.error('Database has too many connections.');
          reject(new Error('Database has too many connections.'));
        }
        if (err.code === 'ECONNREFUSED') {
          console.error('Database connection was refused.');
          reject(new Error('Database connection was refused.'));
        }
      }
      console.log(`connected to database : ${envConfig.DB_NAME}!`);

      if (connection) {
        const rollback = util.promisify(connection.rollback).bind(connection);
        const query = util.promisify(connection.query).bind(connection);
        const commit = util.promisify(connection.commit).bind(connection);
        resolve({rollback, query, commit});
      }
    });
  });
};

export const mysqlQuery = util.promisify(pool.query).bind(pool);
