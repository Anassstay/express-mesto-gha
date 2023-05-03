// создать express router
const userRouter = require('express').Router();

// импорт списков
const {
  getUsers,
  getUserId,
  createUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserId);
userRouter.post('/users', createUser);
userRouter.patch('/users/me', updateUserInfo);
userRouter.patch('/users/me/avatar', updateUserAvatar);

// экспорт express router
module.exports = userRouter;
