const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { DEV_SECRET } = require('../middleware/serverConfigs');

const BadRequestError = require('../middleware/errors/bad-request-err'); // 400
const UnauthorizedError = require('../middleware/errors/no-authorization-err'); // 401
const ConflictError = require('../middleware/errors/conflict-err'); // 409
const User = require('../models/user');

const createUser = async (req, res, next) => {
  const { name, password, email } = req.body;
  const salt = 12;
  try {
    const conflict = await User.findOne({ email });
    if (conflict) {
      next(new ConflictError('This email is already registered.'));
    }
    const hash = await bcrypt.hash(password, salt);
    if (hash) {
      const newUser = await User.create({
        name,
        password: hash,
        email
      });
      if (newUser) {
        res.status(201).send({
          // do this to prevent returning password hash:
          name: newUser.name,
          email: newUser.email,
        });
      }
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw BadRequestError('Wrong email or password');
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email.toLowerCase()
    });
    if (user) {
      const token = jwt.sign(
        {
          _id: user._id
        },
        // generate secret key in console and store in .env file:
        // node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
        NODE_ENV === 'production' ? JWT_SECRET : DEV_SECRET,
        {
          expiresIn: '7d'
        }
      );
      res.status(200).send({
        token
      });
    } else {
      console.log('validation failed');
      throw new UnauthorizedError({
        messege: 'Authorization failed'
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const currentUser = (req, res, next) => {
  const { _id: userId } = req.user;
  User.findById(userId)
    .then((user) => {
      res.json({ email: user.email, name: user.name });
    })
    .catch(next);
};

// get all user in db
// eslint-disable-next-line consistent-return
const getUsres = async (req, res, next) => {
  try {
    const user = await User.find({});
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      throw BadRequestError('could not find what you were looking for');
    }
    next(err);
  }
};

module.exports = {
  createUser,
  login,
  currentUser,
  getUsres
};
