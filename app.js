require('dotenv').config();

// Слушать 3000 порт
const { PORT = 3000 } = process.env;

// Подключить
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const validationErrors = require('celebrate').errors;
const helmet = require('helmet'); // Заголовки безопасности можно проставлять автоматически
const rateLimit = require('express-rate-limit'); // Защита от автоматических запросов, ограничивает кол-во запросов с одного IP-адреса в ед. времени

// Подключить мидлвары
const errors = require('./middlewares/errors');

// Импорт роутов
const indexRoutes = require('./routes/index');

// Создать приложение методом express
const app = express();

// Подключить приложение к cерверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true
});

app.use(express.json());
app.use(cookieParser()); // подключаем парсер кук как мидлвэр
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100 // можно совершить максимум 100 запросов с одного IP
});
app.use(limiter);

app.use('/', indexRoutes);
app.use(validationErrors());
app.use(errors);

// Слушать порт
app.listen(PORT);
