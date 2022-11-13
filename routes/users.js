const express = require('express');

const router = express.Router();
const { celebrate, Joi, Segments } = require('celebrate');
const { currentUser, getUsres } = require('../controllers/users');

router.get(
  '/users/me',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({}).unknown(true)
  }),
  currentUser
);

router.get(
  '/users',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({}).unknown(true)
  }),
  getUsres
);

module.exports = router;
