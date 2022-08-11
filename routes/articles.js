const express = require('express');

const router = express.Router();
const { celebrate, Joi, Segments } = require('celebrate');
const validateURL = require('../middleware/validateURL');

const {
  getArticles,
  saveArticle,
  deleteArticle
} = require('../controllers/articles');

// returns all articles saved by the user
router.get(
  '/articles',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({}).unknown(true)
  }),
  getArticles
);

// saves an article
router.post(
  '/articles',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({}).unknown(true),
    [Segments.BODY]: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().custom(validateURL),
      image: Joi.string().required().custom(validateURL)
    })
  }),
  saveArticle
);

// deletes the stored article by _id
router.delete(
  '/:articleId',
  celebrate({
    [Segments.HEADERS]: Joi.object().keys({}).unknown(true),
    [Segments.PARAMS]: Joi.object().keys({
      articleId: Joi.string().alphanum().hex().required()
    })
  }),
  deleteArticle
);

module.exports = router;
