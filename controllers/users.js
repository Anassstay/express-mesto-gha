const User = require('../models/user');

// ищем всех юзеров
const getUsers = (req, res) => {
  // Найти все записи
  User.find({})
    // записываем данные в базу
    .then((users) => res.send(users))
    // если данные не записались, вернём ошибку
    .catch(() => {res.status(500).send({ message: 'На сервере произошла ошибка' }); });
};

// ищем по ID
const getUserId = (req, res) => {
  User.findById(req.params.userId)
  .orFail(() => {
    throw new Error("Not found")
  })
  .then(user => res.send({data: user}))
  .catch((err) => {
    if (err.message === "Not found") {
      res.status(404).send({message: 'Пользователь по указанному _id не найден.'});
    } else if (err.name === 'CastError') {
      res.status(400).send({message: 'Переданы некорректные данные _id'});
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' })
    }
  });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.status(201).send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
        .map(error => error.message)
        .join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' })
      }
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
          .map((error) => error.message)
          .join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
          .map((error) => error.message)
          .join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUserInfo,
  updateUserAvatar
}