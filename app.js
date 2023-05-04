/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
require('dotenv').config();

// Импорт роутов
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { createUser, login } = require('./controllers/users');

const {
  NOT_FOUND
} = require('./utils/err');

// Слушать 3000 порт
const { PORT = 3000 } = process.env;

// Подключить express и mongoose
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// Заголовки безопасности можно проставлять автоматически
const helmet = require('helmet');
// Защита от автоматических запросов, ограничивает кол-во запросов с одного IP-адреса в ед. времени
const rateLimit = require('express-rate-limit');

// Создать приложение методом express
const app = express();

app.use(express.json());
// подключаем парсер кук как мидлвэр
app.use(cookieParser());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100 // можно совершить максимум 100 запросов с одного IP
});

app.use(limiter);

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64456ea47574ff29500d4098'
//   };
//   next();
// });

app.use(userRouter);
app.use(cardRouter);

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});

// Подключить приложение к cерверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`Server started on port ${PORT}`);
});

app.post('/signin', login);
app.post('/signup', createUser);
