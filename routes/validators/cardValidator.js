const { celebrate, Joi } = require('celebrate');
const { linkRegExp } = require('../../utils/regExp');

const cardDataValidator = celebrate({
  // тело запроса
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(linkRegExp),
  }),
});

const cardIdValidator = celebrate({
  // параметры
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  cardDataValidator,
  cardIdValidator,
};
