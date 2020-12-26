const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  mirrorId: String,

  userPhone: String,

  mirrorPhone: String,

  generatedNum: String,

  withWho: {
    fake: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },

    contactName: String
  },

  isBlocked: {
    type: Boolean,
    default: false
  },

  isMirrorBlocked: {
    type: Boolean,
    default: false
  },

  notificationCount: {
    type: Number,
    default: 0
  },

  latestMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }

}, { timestamps: true });

const ChatModel = mongoose.model('Chat', ChatSchema);
module.exports = ChatModel;
