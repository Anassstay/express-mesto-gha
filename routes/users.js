// создать express router
const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

// импорт списков
const {
  getUsers,
  getUser,
  getUserInfo,
  updateUserInfo,
  updateUserAvatar
} = require('../controllers/users');

const { linkRegExp } = require('../utils/regExp');

userRouter.get('/users', getUsers);

userRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
}), getUser);

userRouter.get('/users/me', getUserInfo);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(linkRegExp),
  }),
}), updateUserAvatar);

// экспорт express router
module.exports = userRouter;
