// Импорт роутов
const userRouter = require('./routes/users.js');
const cardRouter = require('./routes/cards.js');

const {
  NOT_FOUND
} = require('./utils/err');

// Слушать 3000 порт
const { PORT = 3000 } = process.env;

// Подключить express и mongoose
const express = require('express');
const mongoose = require('mongoose');

// Создать приложение методом express
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64456ea47574ff29500d4098'
  };
  next();
});

app.use(userRouter);
app.use(cardRouter);

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
})

// Подключить приложение к cерверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true
});


app.get('/', function(req, res){
  res.sendFile(__dirname+'/app.js'); // change the path to your app.js
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`Server started on port ${PORT}`);
});