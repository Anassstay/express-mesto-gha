/* eslint-disable func-names */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../utils/unauthorizedError');
const { linkRegExp } = require('../utils/regExp');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (avatar) => linkRegExp.test(avatar),
      message: 'Неправильный формат ссылки',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    // по умолчанию хеш пароля пользователя не будет возвращаться из базы
    select: false,
  }
}, {
  versionKey: false,

  statics: {
    findUserByCredentials(email, password) {
      return this.findOne({ email }).select('+password')
        .then((user) => {
          if (!user) {
            throw new UnauthorizedError('Неправильная почта или пароль');
          }
          return bcrypt.compare(password, user.password)
            .then((matched) => {
              if (!matched) {
                throw new UnauthorizedError('Неправильная почта или пароль');
              }
              return user;
            });
        });
    },
  },
});

module.exports = mongoose.model('user', userSchema);
