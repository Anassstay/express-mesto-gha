const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const {
  CREATED
} = require('../utils/errCode');

const ConflictError = require('../utils/conflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

// ищем всех юзеров
const getUsers = (req, res, next) => {
  // Найти все записи
  User.find({})
    // записать данные в базу
    .then((users) => res.send(users))
    // если данные не записались
    .catch(next);
};

// ищем по ID
const findUserById = (req, res, dataUserId, next) => {
  User.findById(dataUserId)
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
};

const getUser = (req, res, next) => {
  const dataUserId = req.params.userId;
  findUserById(req, res, dataUserId, next);
};

const getUserInfo = (req, res, next) => {
  const dataUserId = req.user._id;
  findUserById(req, res, dataUserId, next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const data = user.toObject();
      delete data.password;
      res.status(CREATED).send(data);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже существует'));
        return;
      }
      next(err);
    });
};

const updateUser = (req, res, dataUpdate, next) => {
  User.findByIdAndUpdate(req.user._id, dataUpdate, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const dataUpdate = req.body;
  updateUser(req, res, dataUpdate, next);
};

const updateUserAvatar = (req, res, next) => {
  const dataUpdate = req.body;
  updateUser(req, res, dataUpdate, next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создать токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        // такая кука будет храниться 7 дней
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        // защита от автоматической отправки кук
        // указать браузеру, чтобы тот посылал куки, только если запрос сделан с того же домена
        sameSite: true
      });
      res.send({ message: 'Успешный вход' });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  getUserInfo,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login
};
