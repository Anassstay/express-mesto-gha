const indexRoutes = require('express').Router();

const cardRouter = require('./cards');
const userRouter = require('./users');
const signInRouter = require('./signIn');
const signUpRouter = require('./signUp');

const { createUser, login } = require('../controllers/users');

const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/notFoundError');

indexRoutes.post('/signin', signInRouter, cardRouter, login);
indexRoutes.post('/signup', signUpRouter, cardRouter, createUser);
indexRoutes.use('/cards', auth, cardRouter);
indexRoutes.use('/users', auth, userRouter);
indexRoutes.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = indexRoutes;
