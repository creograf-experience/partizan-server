const config = require('../config');
const uuidv4 = require('uuid/v4');
const base64Img = require('base64-img');

const ChatModel = require('../models/chat');
const MessageModel = require('../models/message');

const utils = {
  generate4DigitNum: () =>
    Math.floor(Math.random() * (9999 - 1000) + 1000),

  filterPhone: phone => phone.replace(/[((|))+-\s]/g, ''),

  formatPhone: phone => '7' + phone.replace(/[((|))+-\s]/g, '').slice(1),

  uniqueArrayOfObjects: (arr, field) => {
    const uniqueValues = [...new Set(arr.map(item => item[field]))];

    return uniqueValues.map(phone => ({
      ...arr.find(item => phone === item[field])
    }));
  },

  filterFilePath: path =>
    path
      .split('/')
      .slice(-3)
      .join('/'),

  getSocketByPhone: (phone, users) => {
    let socket;

    users.forEach((value, key) => {
      if (value.phone === phone) socket = key;
    });

    return socket;
  },

  assignMessage: (message, documents) => {
    const { senderMessage, receiverMessage } = documents;

    senderMessage.content.message = message;
    receiverMessage.content.message = message;
  },

  assignAttachment: (attachment, documents) => {
    const { senderMessage, receiverMessage } = documents;
    if (attachment.photo) {
      const imageName = uuidv4();

      const filePath = `${config.hostname}/` + utils.filterFilePath(
        base64Img.imgSync(attachment.photo, config.imageFolder, imageName)
      );

      senderMessage.content.attachments.photo = filePath;
      receiverMessage.content.attachments.photo = filePath;

      return;
    }

    if (attachment.voiceMessage) {
      senderMessage.content.attachments.voiceMessage = attachment.voiceMessage;
      receiverMessage.content.attachments.voiceMessage = attachment.voiceMessage;
    }
  },

  createChats: (sender, receiver) => {
    // console.log(JSON.stringify(sender, null, 2));
    // console.log(JSON.stringify(receiver, null, 2));
    const senderChat = new ChatModel({
      userPhone: sender.phone,
      mirrorPhone: receiver.phone,
      withWho: {
        contactName: receiver.contactName
      }
    });

    const receiverChat = new ChatModel({
      mirrorId: senderChat._id,
      userPhone: receiver.phone,
      mirrorPhone: sender.phone,
      withWho: {
        fake: sender.id
      }
    });

    senderChat.mirrorId = receiverChat._id;

    return [senderChat, receiverChat];
  },

  createMessages: (chats, content) => {
    const { senderChat, receiverChat } = chats;

    const senderMessage = new MessageModel({
      chatId: senderChat._id,
      uuid: content.uuid,
      from: senderChat.userPhone,
      content: {}
    });

    const receiverMessage = new MessageModel({
      chatId: receiverChat._id,
      from: senderChat.userPhone,
      content: {}
    });

    if (content.message) {
      utils.assignMessage(
        content.message,
        { senderMessage, receiverMessage }
      );
    }

    if (content.attachment) {
      utils.assignAttachment(
        content.attachment,
        { senderMessage, receiverMessage }
      );
    }

    return [senderMessage, receiverMessage];
  },

  deleteMsgByIdOrUuid: async _id => {
    try {
      return String(_id).length < 30
        ? await MessageModel.findOneAndDelete({ _id })
        : await MessageModel.findOneAndDelete({ uuid: _id });
    } catch (err) {
      console.error(err);
    }
  }
};

module.exports = utils;
