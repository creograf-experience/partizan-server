const mongoose = require('mongoose');

const config = require('../config');
mongoose
  .connect(config[config.env].db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error(err));

(async function () {
  const ProfileModel = require('../models/profile');

  await Promise.all([
    ProfileModel.create({
      name: 'Пьяный лось',
      avatar: config.hostname + '/profiles/moose.png'
    }),

    ProfileModel.create({
      name: 'Магистр Михаил',
      avatar: config.hostname + '/profiles/bear.jpg'
    }),

    ProfileModel.create({
      name: 'Романтичный мишка',
      avatar: config.hostname + '/profiles/bear2.jpg'
    }),

    ProfileModel.create({
      name: 'Бык-качок',
      avatar: config.hostname + '/profiles/bool.jpg'
    }),

    ProfileModel.create({
      name: 'Задумчивая кошка',
      avatar: config.hostname + '/profiles/cat.jpg'
    }),

    ProfileModel.create({
      name: 'Красотка с ушами',
      avatar: config.hostname + '/profiles/cat2.jpg'
    }),

    ProfileModel.create({
      name: 'Непревзойденный летчик',
      avatar: config.hostname + '/profiles/dog.jpg'
    }),

    ProfileModel.create({
      name: 'Пес-капиталист',
      avatar: config.hostname + '/profiles/dog2.jpg'
    }),

    ProfileModel.create({
      name: 'Рыжая',
      avatar: config.hostname + '/profiles/fox1.jpg'
    }),

    ProfileModel.create({
      name: 'Хитрая лиса',
      avatar: config.hostname + '/profiles/fox2.jpg'
    }),

    ProfileModel.create({
      name: 'Жираф в отпуске',
      avatar: config.hostname + '/profiles/giraffe.jpg'
    }),

    ProfileModel.create({
      name: 'Офисный ястреб',
      avatar: config.hostname + '/profiles/hawk.jpg'
    }),

    ProfileModel.create({
      name: 'Японский ёж',
      avatar: config.hostname + '/profiles/hedgehog.jpg'
    }),

    ProfileModel.create({
      name: 'Босс зверей',
      avatar: config.hostname + '/profiles/lion.jpg'
    }),

    ProfileModel.create({
      name: 'Засмущавшаяся рысь',
      avatar: config.hostname + '/profiles/lynx.jpg'
    }),

    ProfileModel.create({
      name: 'Обезьяна-серфер',
      avatar: config.hostname + '/profiles/monkey.jpg'
    }),

    ProfileModel.create({
      name: 'Крестный филин',
      avatar: config.hostname + '/profiles/owl.jpg'
    }),

    ProfileModel.create({
      name: 'Великий По',
      avatar: config.hostname + '/profiles/panda.png'
    }),

    ProfileModel.create({
      name: 'Голубь в шляпе',
      avatar: config.hostname + '/profiles/pigeon.png'
    }),

    ProfileModel.create({
      name: 'Великий учитель',
      avatar: config.hostname + '/profiles/porcupine.png'
    }),

    ProfileModel.create({
      name: 'Крольчика Мэри',
      avatar: config.hostname + '/profiles/rabbit.png'
    }),

    ProfileModel.create({
      name: 'Зайка Джесси',
      avatar: config.hostname + '/profiles/rabbit2.jpg'
    }),

    ProfileModel.create({
      name: 'Енот полоскун',
      avatar: config.hostname + '/profiles/raccoon.png'
    }),

    ProfileModel.create({
      name: 'Белка-заучка',
      avatar: config.hostname + '/profiles/squirrel.jpg'
    }),

    ProfileModel.create({
      name: 'Очаровательная тигрица',
      avatar: config.hostname + '/profiles/tiger.jpg'
    }),

    ProfileModel.create({
      name: 'Волчица',
      avatar: config.hostname + '/profiles/wolf1.jpg'
    }),

    ProfileModel.create({
      name: 'Скромная Дженнифер',
      avatar: config.hostname + '/profiles/wolf2.jpg'
    }),

    ProfileModel.create({
      name: 'Лесной спецназ',
      avatar: config.hostname + '/profiles/wolf3.jpg'
    }),

    ProfileModel.create({
      name: 'Просто Красавчик',
      avatar: config.hostname + '/profiles/wolf4.jpg'
    })
  ]);

  mongoose.disconnect();
})();
