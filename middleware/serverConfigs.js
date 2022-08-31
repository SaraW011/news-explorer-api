/* eslint-disable linebreak-style */
require('dotenv').config();

const {
  PORT = 3000,
  NONGO_DB = 'mongodb://localhost:27017/news-explorer',
  DEV_SECRET = 'super-secret-jwt',
  NODE_ENV = 'production'
} = process.env;

module.exports = {
  PORT,
  NONGO_DB,
  DEV_SECRET,
  NODE_ENV
};
