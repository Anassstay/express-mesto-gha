const indexRoutes = require('express').Router();

const cardRouter = require('./cards');
const userRouter = require('./users');
const signInRouter = require('./signIn');
const signUpRouter = require('./signUp');

const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/notFoundError');

indexRoutes.use('/cards', auth, cardRouter);
indexRoutes.use('/users', auth, userRouter);
indexRoutes.use('/signin', signInRouter);
indexRoutes.use('/signup', signUpRouter);
indexRoutes.use('*', (req, res) => {
  res.status(NotFoundError).send({ message: 'Страница не найдена' });
});

module.exports = indexRoutes;
