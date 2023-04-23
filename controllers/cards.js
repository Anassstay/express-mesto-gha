const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
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

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .orFail()
  .then(card => res.status(200).send({ data: card }))
  .catch((err) => {
    if (err.name === 'DocumentNotFoundError') {
      res.status(404).send({ message: 'Карточка с указанным id не найдена' });
    } else if (err.name === 'CastError') {
      res.status(400).send({ message: 'Некорректный id' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' })
    }
  })
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
  .orFail()
  .then(card => res.status(200).send({ data: card, message: 'Лайк поставлен' }))
  .catch((err) => {
    if (err.name === 'DocumentNotFoundError') {
      res.status(404).send({ message: 'Передан несуществующий id карточки' });
    } else if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' })
    }
  })
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },  // убрать _id из массива
    { new: true },
  )
  .orFail()
  .then(card => res.status(200).send({ data: card, message: 'Лайк удален' }))
  .catch((err) => {
    if (err.name === 'DocumentNotFoundError') {
      res.status(404).send({ message: 'Передан несуществующий id карточки' });
    } else if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' })
    }
  })
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}