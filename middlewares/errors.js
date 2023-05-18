const {
  ValidationError,
  DocumentNotFoundError,
  CastError
} = require('mongoose').Error;

const {
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  SERVER_ERROR
} = require('../utils/errCode');

const UnauthorizedError = require('../utils/unauthorizedError');
const ForbiddenError = require('../utils/forbiddenError');
const NotFoundError = require('../utils/notFoundError');

module.exports = ((err, req, res, next) => {
  if (err instanceof ValidationError) {
    const errMessage = Object.values(err.errors).map((error) => error.message).join(' ');
    return res.status(BAD_REQUEST).send({
      message: `Переданы некорректные данные при создании ${errMessage}`,
    });
  }
  if (err instanceof DocumentNotFoundError) {
    return res.status(NOT_FOUND).send({
      message: 'Объект с указанным ID не найден',
    });
  }
  if (err instanceof CastError) {
    return res.status(BAD_REQUEST).send({
      message: `Передан несуществующий ID: ${err.value}`,
    });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(err.statusCode).send({
      message: err.message,
    });
  }
  if (err instanceof ForbiddenError) {
    return res.status(err.statusCode).send({
      message: err.message,
    });
  }
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).send({
      message: err.message,
    });
  }
  if (err.code === 11000) {
    return res.status(CONFLICT).send({
      message: 'Указанный email уже зарегистрирован. Пожалуйста, используйте другой email',
    });
  }
  res.status(SERVER_ERROR).send({
    message: `Что-то пошло не так ${err.name}: ${err.message}`,
  });
  return next();
});
