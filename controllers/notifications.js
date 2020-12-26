const { Expo } = require('expo-server-sdk');
const UserModel = require('../models/user');
const ContactModel = require('../models/contact');

exports.notifyContacts = async (req, res) => {
  try {
    // если у юзера есть профайл,
    // значит он уже был в приложении
    // поэтому не посылаем уведомления
    const existUser = await UserModel.findById(req.user._id);
    if (existUser.profile) {
      return res.status(200).json({ msg: 'Not new user. Do not send notifications' });
    }

    const expo = new Expo();

    const contacts = await ContactModel.find({
      phoneNumbers: {
        $elemMatch: { number: req.user.phone }
      }
    });

    for (const contact of contacts) {
      const user = await UserModel.findById(contact.userId);
      if (!user || !user.pushTokens.length) continue;

      const chunks = expo.chunkPushNotifications(
        createNotifications(user.pushTokens, contact)
      );

      const tickets = [];

      for (const chunk of chunks) {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      }
    }

    return res.status(200).json({ msg: 'notifications sent' });
  } catch (err) {
    if (err.code === 'PUSH_TOO_MANY_EXPERIENCE_IDS') {
      return res.status(200).json({ msg: 'PUSH_TOO_MANY_EXPERIENCE_IDS - continue' });
    }

    console.error(err);
    return res.status(500).json(err);
  }
};

const createNotifications = (pushTokens, contact) =>
  pushTokens.reduce((acc, token) => {
    if (!Expo.isExpoPushToken(token)) {
      console.log(`Push token ${token} is not valid Expo push token`);
      return acc;
    }

    const notification = {
      to: token,
      sound: 'default',
      body: `${contact.name} зарегистрировался в приложении`
    };

    return [...acc, notification];
  }, []);
