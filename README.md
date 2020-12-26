# Partizan Server

```sh
$ yarn install
$ yarn seed - добавить профили в БД
$ yarn server - запуск сервера
```

# API
## profiles:
```
url: api/profiles
method: GET
access: Public
desc: 'Получить список всех профилей'
returns: [
  {
    _id: '123',
    name: 'Веселый волк',
    avatar: '/public/profiles/wolf.png'
  },
  {...} 
]
```
## auth:
```
url: api/users/auth/save-phone
method: POST
access: Public
desc: 'сохранить телефон в базу'
req.body = {
  phone: '+7 922 413 58-20'
}

url: api/users/auth/is-verified
method: POST
access: Public
desc: 'проверить подтвержден ли пользователь, если да то вернет jwt token'
req.body = {
  phone: '+7 922 413 58-20'
}
returns: {
  // если подтвержден
  isVerified: true,
  jwtToken: 'token...'

  // если не подтвержден
  isVerified: false
}
```
## profile:
```
url: api/users/profile
method: POST
access: Public
desc: 'установить профиль'
req.body = {
  phone: '+7 922 413 58-20',
  profileId: '123'
}

url: api/users/profile
method: GET
access: Private
desc: 'получить всю информацию о юзере'
returns: {
  _id: '123',
  phone: '79224135820',
  pushTokens: ['token1', '...']
  profile: {
    _id: '123',
    name: 'Веселый Волк',
    avatar: '/public/profiles/wolf.png'
  },
  createdAt: Date,
  updatedAt: Date
}

url: api/users/profile
method: PUT
access: Private
desc: 'обновить профиль'
req.body = {
  profileId: '123 (это id нового профиля)'
}
```
## chats:
```
url: api/users/chats
method: GET
access: Private
desc: 'получить чаты юзера'
returns: [
  { 
    _id: '123',
    mirrorId: '321',
    userPhone: '79224135820',
    withWho: {
      fake: {
        generatedNum: '3876',
        profile: {
          name: 'Веселый Волк',
          avatar: '/public/profiles/wolf.png'
        }
      },
      contactName: 'Вася'
    },
    isBlocked: false,
    latestMessage: {
      content: {
        message: 'Hello World',
        attachments: {
          photo: '/public/uploads/img.jpg'
        }
      },
      createdAt: Date,
      updatedAt: Date
    }
  },
  {...}
]
```
## messages:
```
url: api/users/messages/:chatId?limit=20&skip=0
method: GET
access: Private
desc: 'получить сообщения чата'
returns: [
  {
    _id: '123',
    chatId: '123',
    from: '79224135820',
    content: {
      message: 'Hello World',
      attachments: {
        photo: '/public/uploads/img.jpg'
      }
    },
    createdAt: Date,
    updatedAt: Date
  },
  {...}
]
```
## expo push tokens:
```
url: api/users/pushtoken
method: POST
access: Private
desc: 'добавить пуш токен'
req.body = {
  token: 'expo push token'
}

url: api/users/pushtoken
method: DELETE
access: Private
desc: 'удалить пуш токен'
req.body = {
  token: 'expo push token'
}
```
# Socket Events
```sh
# Добавить юзера в список подключенных юзеров
socket.on('init user', jwtToken) 

# Создать новый чат
const data = {
  content: {
    message: 'Hello World',
    attachment: 'base64 img string'
  },
  receiver: {
    phone: '79224135820',
    contactName: 'Вася'
  }
}
socket.on('create chat', data)

# Отправить чат создателю
socket.emit('sender chat', senderChat)

# Отправить чат получателю
socket.emit('receiver chat', receiverChat)

# Создать сообщение
const data = {
  chatId: '123',
  mirrorId: '321',
  message: 'Hello World',
  attachment: 'base64 img string'
}
socket.on('create message', data)

# Отправить созданное сообщение написавшему юзеру
socket.emit('receive message', senderMessage)

# Отправить созданное сообщение получателю
socket.emit('receive private message', receiverMessage)

# Заблокировать или разблокировать чат
const chatId = '123'
socket.on('toggle-block', chatId)

# Отправить заблокированный чат
socket.emit('receive blocked chat', chat)

# Сообщение если написавший юзер заблокирован у получателя
socket.emit('blocked', msg)

# Отправить ошибку
socket.emit('err', msg);
```