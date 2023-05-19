const indexRoutes = require('express').Router();

const cardRouter = require('./cards');
const userRouter = require('./users');

const { createUser, login } = require('../controllers/users');
const { createUserValidator, loginUserValidator } = require('./validators/userValidator');

const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/notFoundError');

indexRoutes.post('/signin', loginUserValidator, login);
indexRoutes.post('/signup', createUserValidator, createUser);

indexRoutes.use('/cards', auth, cardRouter);
indexRoutes.use('/users', auth, userRouter);
indexRoutes.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = indexRoutes;
