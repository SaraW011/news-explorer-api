const indexRouter = require('express').Router();

const userRouter = require('./users');
const articleRouter = require('./articles');
const auth = require('../middleware/auth');

indexRouter.use(auth);
indexRouter.use(userRouter);
indexRouter.use(articleRouter);

module.exports = indexRouter;
