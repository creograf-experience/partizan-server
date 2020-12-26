const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const Schema = mongoose.Schema;

const config = require('../config');

const MessageSchema = new Schema({
  chatId: String,

  uuid: String,

  from: String,

  content: {
    message: String,
    attachments: {
      photo: String,
      voiceMessage: String
    }
  }
}, { timestamps: true });

MessageSchema.plugin(
  encrypt,
  {
    encryptionKey: config.encryptionKey,
    signingKey: config.signingKey,
    encryptedFields: ['content']
  }
);

const MessageModel = mongoose.model('Message', MessageSchema);
module.exports = MessageModel;
