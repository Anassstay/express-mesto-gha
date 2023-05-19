const { celebrate, Joi } = require('celebrate');
const { linkRegExp } = require('../../utils/regExp');

const createUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(linkRegExp),
  }),
});

const loginUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const idUserValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24)
      .required(),
  }),
});

const dataUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const avatarUserValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(linkRegExp),
  }),
});

module.exports = {
  createUserValidator,
  loginUserValidator,
  idUserValidator,
  dataUserValidator,
  avatarUserValidator,
};
