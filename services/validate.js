const utils = require('./utils');

exports.phone = phone =>
  /^\d+$/.test(phone) &&
  phone.length >= 11;

exports.phoneNumber = phone =>
  utils.filterPhone(phone).length >= 11 &&
  /^\d+$/.test(utils.filterPhone(phone));

  exports.newChat = (receiver, content) =>
  !!(
    receiver &&
    receiver.phone &&
    receiver.contactName &&
    content &&
    (content.message || content.attachment)
  );

exports.newMessage = data =>
  !!(
    (data.chatId && data.mirrorId) &&
    (data.message || data.attachment)
  );
