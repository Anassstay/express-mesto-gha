const Card = require('../models/card');

const {
  OK,
  CREATED,
  FORBIDDEN
} = require('../utils/err');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  console.log(req.user._id); // _id станет доступен
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      Card.deleteOne({ _id: card._id, owner: req.user._id })
        .then((result) => {
          if (result.deletedCount === 0) {
            throw new FORBIDDEN('Нет прав для удаления карточки');
          } else {
            res.status(OK).send({ data: card });
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
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const likeCard = (req, res, next) => {
  const owner = req.user._id;
  const updateData = { $addToSet: { likes: owner } };
  updateLikes(req, res, updateData, next);
};

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
