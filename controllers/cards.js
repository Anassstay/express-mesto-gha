const Card = require('../models/card');

const {
  CREATED
} = require('../utils/errCode');

const ForbiddenError = require('../utils/forbiddenError');

// возвращаем все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ cards }))
    .catch(next);
};

// создать карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(CREATED).send({ card }))
    .catch(next);
};

// удалить карточку
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      Card.deleteOne({ _id: card._id, owner: req.user._id })
        .then((result) => {
          if (result.deletedCount === 0) {
            throw new ForbiddenError('Нет прав для удаления карточки');
          } else {
            res.send({ message: 'Карточка успешно удалена' });
          }
        })
        .catch(next);
    })
    .catch(next);
};

const updateLikes = (req, res, updateData, next) => {
  Card.findByIdAndUpdate(req.params.cardId, updateData, { new: true })
    .orFail()
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send({ card }))
    .catch(next);
};

// поставить лайк
const likeCard = (req, res, next) => {
  const owner = req.user._id;
  const updateData = { $addToSet: { likes: owner } };
  updateLikes(req, res, updateData, next);
};

// убрать лайк
const dislikeCard = (req, res, next) => {
  const owner = req.user._id;
  const updateData = { $pull: { likes: owner } };
  updateLikes(req, res, updateData, next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
};
