const jwt = require('jsonwebtoken');
const io = require('../server');
const fs = require('fs');
const config = require('../config');
const validate = require('./validate');
const utils = require('./utils');
const notifications = require('./notifications');

const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient({
  projectId: 'comiron-1566539612484',
  keyFilename: '/home/user/partizan-server/speech-to-text-cred.json'
});
const ffmpeg = require('fluent-ffmpeg');

const UserModel = require('../models/user');
const ChatModel = require('../models/chat');
const MessageModel = require('../models/message');

const users = new Map();

module.exports = socket => {
  console.log('user connected with socket: ' + socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected with socket: ' + socket.id);
    users.delete(socket.id);
  });

  socket.on('init user', async jwtToken => {
    try {
      console.log('init user with socket: ' + socket.id);
      if (!jwtToken) {
        socket.emit('err', 'Invalid data');
        return socket.emit('disconnect');
      }

      const decoded = await jwt.verify(
        jwtToken.replace('Bearer ', ''),
        config.jwtSecret
      );

      const user = await UserModel
        .findById(decoded._id)
        .populate('profile');

      if (!user) {
        console.log('User does not exist');
        socket.emit('err', 'User does not exist');
        return socket.emit('disconnect');
      }

      console.log('user decoded');
      users.forEach((value, key) => {
        if (value.phone === user.phone) {
          console.log('user already exist, disconnect...');
          io.sockets.connected[key].disconnect();
        }
      });

      users.set(socket.id, { id: user._id, phone: user.phone });
      socket.emit('receive init user', user);
    } catch (err) {
      console.error('Not decoded', err);
      return socket.emit('disconnect');
    }
  });

  socket.on('create chat', async data => {
    try {
      const { receiver, content } = data;

      if (!users.get(socket.id)) return socket.emit('err', 'User is not initialized');

      if (!validate.newChat(receiver, content)) {
        return socket.emit('err', 'Invalid data');
      };

      const sender = users.get(socket.id);
      let [senderChat, receiverChat] = utils.createChats(sender, receiver);

      const [senderMessage, receiverMessage] = utils.createMessages(
        { senderChat, receiverChat },
        content
      );

      senderChat.latestMessage = senderMessage._id;
      receiverChat.latestMessage = receiverMessage._id;
      receiverChat.notificationCount += 1;

      await Promise.all([
        senderMessage.save(),
        receiverMessage.save(),
        senderChat.save(),
        receiverChat.save()
      ]);

      senderChat = await ChatModel
        .findById(senderChat._id)
        .populate('latestMessage');

      receiverChat = await ChatModel
        .findById(receiverChat._id)
        .populate({
          path: 'withWho.fake',
          select: 'profile generatedNum',
          populate: { path: 'profile' }
        })
        .populate('latestMessage');

      socket.emit('sender chat', senderChat);

      const receiverSocket = utils.getSocketByPhone(
        receiverChat.userPhone,
        users
      );
      if (receiverSocket) {
        io.to(receiverSocket).emit('receiver chat', receiverChat);
      } else {
        notifications.send(receiverChat.userPhone, receiverChat);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('create message', async data => {
    try {
      const { chatId, mirrorId, message, attachment, uuid } = data;

      if (!users.get(socket.id)) return socket.emit('err', 'User is not initialized');

      if (!validate.newMessage(data)) {
        return socket.emit('err', 'Invalid data');
      };

      let [senderChat, receiverChat] = await Promise.all([
        ChatModel.findById(chatId),
        ChatModel.findById(mirrorId)
      ]);

      const [senderMessage, receiverMessage] = utils.createMessages(
        { senderChat, receiverChat },
        { message, attachment, uuid }
      );

      senderChat.latestMessage = senderMessage._id;
      receiverChat.latestMessage = receiverMessage._id;
      receiverChat.notificationCount += 1;

      await Promise.all([
        senderMessage.save(),
        receiverMessage.save(),
        senderChat.save(),
        receiverChat.save()
      ]);

      socket.emit('receive message', senderMessage);

      receiverChat = await ChatModel
        .findById(receiverChat._id)
        .populate({
          path: 'withWho.fake',
          select: 'profile generatedNum',
          populate: { path: 'profile' }
        })
        .populate('latestMessage');

      const receiverSocket = utils.getSocketByPhone(
        receiverChat.userPhone,
        users
      );
      if (receiverSocket) {
        io.to(receiverSocket).emit('receive private message', receiverMessage);
      } else {
        notifications.send(receiverChat.userPhone, receiverChat);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('toggle-block', async data => {
    try {
      const { chatId, mirrorId } = data;
      if (!chatId || !mirrorId) return socket.emit('err', 'Invalid data');

      const [chat, mirrorChat] = await Promise.all([
        ChatModel.findById(chatId),
        ChatModel.findById(mirrorId)
      ]);

      if (!chat || !mirrorChat) return socket.emit('err', 'Chat does not exist');

      chat.isBlocked = !chat.isBlocked;
      mirrorChat.isMirrorBlocked = !mirrorChat.isMirrorBlocked;

      await Promise.all([
        chat.save(),
        mirrorChat.save()
      ]);

      socket.emit('receive blocked chat', chat._id);

      const receiverSocket = utils.getSocketByPhone(
        mirrorChat.userPhone,
        users
      );

      if (receiverSocket) {
        io.to(receiverSocket).emit('receive mirror blocked chat', mirrorChat._id);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('clear notification', async chatId => {
    try {
      if (!chatId) return socket.emit('err', 'Invalid data');

      const chat = await ChatModel.findById(chatId);
      if (!chat) return socket.emit('err', 'Chat does not exist');

      chat.notificationCount = 0;
      await chat.save();
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('delete message', async data => {
    try {
      const { chatId, _id } = data;
      if (!chatId || !_id) return;

      const [chat, message] = await Promise.all([
        ChatModel.findById(chatId),
        utils.deleteMsgByIdOrUuid(_id)
      ]);

      if (!chat || !message) return;
      if (String(chat.latestMessage) !== String(message._id)) return;

      const [prevMessage] = await MessageModel.find({ chatId }).sort({ _id: -1 }).limit(1);
      chat.latestMessage = prevMessage ? prevMessage._id : null;
      await chat.save();
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('voice message', async data => {
    const { file, name } = data;
    const filepath = `${config.voiceMessageFolder}/${name}`;
    const encodedPath = `${config.encodedVoiceFolder}/${name.split('.')[0]}.wav`;

    // eslint-disable-next-line new-cap
    const buff = new Buffer.from(file, 'base64');
    fs.writeFileSync(filepath, buff);

    ffmpeg()
      .input(filepath)
      .outputOption([
        '-f s16le',
        '-acodec pcm_s16le',
        '-ac 1',
        '-ar 41k',
        '-map_metadata -1'
      ])
      .save(encodedPath)
      .on('end', async () => {
        const savedFile = fs.readFileSync(encodedPath);
        const audio = {
          content: savedFile.toString('base64')
        };
        const config = {
          enableAutomaticPunctuation: false,
          encoding: 'LINEAR16',
          sampleRateHertz: 41000,
          languageCode: 'ru',
          model: 'default'
        };
        const request = {
          audio: audio,
          config: config
        };

        const [response] = await client.recognize(request);
        const transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');

        socket.emit('receive voice message', transcription);

        fs.unlink(filepath, err => {
          if (err) throw err;
          console.log('voice file deleted - uploads/voice');
        });
        fs.unlink(encodedPath, err => {
          if (err) throw err;
          console.log('voice file deleted - uploads/encoded-voice');
        });
      });
  });
};
