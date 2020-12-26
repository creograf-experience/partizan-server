const axios = require('axios');

const utils = require('../../services/utils');
const validate = require('../../services/validate');

const UserModel = require('../../models/user');
const ChatModel = require('../../models/chat');

exports.savePhone = async (req, res) => {
  try {
    const { phone } = req.body;
    console.log(phone)
    if (!phone || !validate.phoneNumber(phone)) {
      return res.status(400).json({ msg: 'Invalid data' });
    }

    const rawPhone = utils.filterPhone(phone);

    const user = await UserModel.findOne({ phone: rawPhone });
    if (user) {
      return res.status(200).json({ msg: 'User exists, continue' });
    }

    const newUser = new UserModel({
      phone: rawPhone,
      generatedNum: utils.generate4DigitNum()
    });

    await newUser.save();

    // Чат с администрацией
    const senderChat = new ChatModel({
      userPhone: '73512254242',
      mirrorPhone: newUser.phone,
      withWho: {
        contactName: newUser.phone
      }
    });

    const receiverChat = new ChatModel({
      mirrorId: senderChat._id,
      userPhone: newUser.phone,
      mirrorPhone: '73512254242',
      withWho: {
        contactName: 'Администрация'
      }
    });

    senderChat.mirrorId = receiverChat._id;

    const [senderMessage, receiverMessage] = utils.createMessages(
      {
        senderChat,
        receiverChat
      },
      {
        message: 'Это Администрация Партизана. Пишите в этот чат о всех действиях пользователей, нарушающих пользовательское соглашение'
      }
    );

    senderChat.latestMessage = senderMessage._id;
    receiverChat.latestMessage = receiverMessage._id;
    receiverChat.isNotified = true;

    await Promise.all([
      senderMessage.save(),
      receiverMessage.save(),
      senderChat.save(),
      receiverChat.save()
    ]);

    return res.status(200).json({ msg: 'User saved' });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.verifyPhone = async (req, res) => {
  try {
    const { params } = req.body;
    if (!params) {
      return res.status(400).json({ msg: 'Invalid data' });
    }

    const { numberA: phone } = params;
    if (!phone || !validate.phoneNumber(phone)) {
      return res.status(400).json({ msg: 'Invalid data' });
    }

    const rawPhone = utils.filterPhone(phone);
    const user = await UserModel.findOne({ phone: rawPhone });
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    user.lastCalledNumber = rawPhone;
    await user.save();

    return res.status(200).json({
      jsonrpc: 2.0,
      id: 1,
      result: {
        redirect_type: 1,
        followme_struct: [
          1,
          [{
            I_FOLLOW_ORDER: 1,
            ACTIVE: 'N',
            NAME: 79111111111,
            REDIRECT_NUMBER: 79111111111,
            PERIOD: 'always',
            PERIOD_DESCRIPTION: 'always',
            TIMEOUT: 2
          }]
        ]
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.isVerified = async (req, res) => {
  try {
    const { phone } = req.body;
    // console.log(JSON.stringify(phone, null, 2));
    if (!phone || !validate.phoneNumber(phone)) {
      return res.status(400).json({ msg: 'Invalid data' });
    }

    const rawPhone = utils.filterPhone(phone);
    const user = await UserModel.findOne({ phone: rawPhone });
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    if (rawPhone === '71234556789') {
      const jwtToken = user.generateJwt();
      return res.status(200).json({
        isVerified: true,
        jwtToken: 'Bearer ' + jwtToken
      });
    }

    // if (user.lastCalledNumber !== user.phone) {
    //   return res.status(200).json({ isVerified: false });
    // }

    const { data } = await axios.post(
      'https://comironserver.comiron.com/profile/partizan',
      {
        phone: user.phone,
        partizan_uid: user._id
      }
    );

    if (data.success && data.id) {
      user.comironUserId = data.id;
    }

    user.lastCalledNumber = '';
    await user.save();
    console.log(JSON.stringify(user, null, 2));
    const jwtToken = user.generateJwt();
    return res.status(200).json({
      isVerified: true,
      jwtToken: 'Bearer ' + jwtToken
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
