const Article = require('../models/article');
const NotFoundError = require('../middleware/errors/not-found-err');
const UnauthorizedError = require('../middleware/errors/no-authorization-err');

// get article by owner:(updated for frontend use below)
// const getArticles = async (req, res, next) => {
//   try {
//     const userAuth = await Article.findOne({});
//     if (userAuth) {
//       next(new UnauthorizedError('danger zone, show ID'));
//     }
//     const owner = req.user._id;
//     const articles = await Article.find({ owner });
//     if (articles.length === 0) {
//       throw new NotFoundError('No articles saved yet...');
//     } else res.status(200).send(articles);
//   } catch (error) {
//     next(error);
//   }
// };

const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ owner: req.user._id });
    if (articles.length === 0) {
      throw new NotFoundError('No articles saved yet...');
    } else res.send(articles);
  } catch (error) {
    next(error);
  }
};

const saveArticle = async (req, res, next) => {
  try {
    const savedArticle = await Article.create({
      ...req.body,
      owner: req.user._id
    });
    res.status(201).send(savedArticle);
  } catch (error) {
    next(error);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.articleId).select;
    'owner'();
    if (!article) {
      throw new NotFoundError('Cannot find article');
    } else if (req.user._id !== article.owner.toString()) {
      throw new UnauthorizedError('you can delete only your own articles');
    } else {
      await Article.findByIdAndRemove(req.params.articleId);
    }
    res.status(200).json('Article deleted from collection');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getArticles,
  saveArticle,
  deleteArticle
};
