// NMP MODALS:
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
// prevents controller from starting if submission incorrect:
const { celebrate, Joi, Segments, errors } = require('celebrate');
/** ********************************* */
// PATHS
const { limiter } = require('./middleware/limiter');
const { PORT, NONGO_DB, NODE_ENV } = require('./middleware/serverConfigs');
const indexRouter = require('./routes/index');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middleware/logger');
const NotFoundError = require('./middleware/errors/not-found-err');
const defaultErr = require('./middleware/errors/default-err');
/** ******************************** */

const app = express();
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.options('*', cors()); // enable requests for all routes

app.use(limiter); // is express-rate-limit

mongoose.connect(NONGO_DB);
console.log(NODE_ENV);

// creates a user
app.post(
  '/signup',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  }),
  createUser
);

// checks email and password passed in the body and returns a JWT
app.post(
  '/signin',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  }),
  login
);

/** ********************************* */

app.use(indexRouter);
// eslint-disable-next-line consistent-return
app.get('*', (req, res, err) => {
  res.send('Qapla!');
  if (err.name === 'CastError') {
    return NotFoundError('Requested resource not found');
  }
});

/* The error logger needs to be enabled
after the route handlers and before the error handlers */

// CENTRALIZED ERROR HANDLERS:
app.use(requestLogger); // winston logger
app.use(errorLogger); // winston logger
app.use(errors()); // celebrate error handler

/* Server crash testing, app automatically recovers if crash,
allows to follow other route without restarting the app manually on the server:
(remove after review) */
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use(defaultErr);

app.listen(PORT, () => {
  console.log(
    `\u001B[32m -----------===========>>>  APP is LISTENING on PORT ${PORT};\u001B[32m`
  );
});
