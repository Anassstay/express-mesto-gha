// создать express router
const cardRouter = require('express').Router();

// импорт списков
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
} = require('../controllers/cards');

const {
  cardDataValidator,
  cardIdValidator,
} = require('./validators/cardValidator');

cardRouter.get('/', getCards);

cardRouter.post('/', cardDataValidator, createCard);

cardRouter.delete('/:cardId', cardIdValidator, deleteCard);

cardRouter.put('/:cardId/likes', cardIdValidator, likeCard);

cardRouter.delete('/:cardId/likes', cardIdValidator, dislikeCard);

// экспорт express router
module.exports = cardRouter;
