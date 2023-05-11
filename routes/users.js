// создать express router
const userRouter = require('express').Router();

// импорт списков
const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUser);
userRouter.patch('/users/me', updateUserInfo);
userRouter.patch('/users/me/avatar', updateUserAvatar);

// экспорт express router
module.exports = userRouter;
