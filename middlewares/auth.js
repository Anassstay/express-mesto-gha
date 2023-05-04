/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UNAUTHORIZED('Необходима авторизация'));
  }
  // верифицировать токена
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new UNAUTHORIZED('Необходима авторизация'));
  }
  // записать пейлоуд в объект запроса
  req.user = payload;
  // пропустить запрос дальше
  return next();
};
