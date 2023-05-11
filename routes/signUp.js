const signUpRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { createUser } = require('../controllers/users');
const { linkRegExp } = require('../utils/regExp');

signUpRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(linkRegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

module.exports = signUpRouter;
