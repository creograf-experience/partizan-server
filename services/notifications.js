const { Expo } = require('expo-server-sdk');

const UserModel = require('../models/user');

exports.send = async (phone, chat) => {
  try {
    const expo = new Expo();

    const user = await UserModel.findOne({ phone });
    if (!user || !user.pushTokens.length) return;

    const chunks = expo.chunkPushNotifications(
      createNotifications(user.pushTokens, chat)
    );
    const tickets = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }
  } catch (err) {
    console.error(err);
  }
};

const createNotifications = (pushTokens, chat) =>
  pushTokens.reduce((acc, token) => {
    if (!Expo.isExpoPushToken(token)) {
      console.log(`Push token ${token} is not valid Expo push token`);
      return acc;
    }

    const notification = {
      to: token,
      sound: 'default',
      body: 'Вам пришло новое сообщение',
      data: { chat }
    };

    return [...acc, notification];
  }, []);
