const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jwt = require('jsonwebtoken');
const config = require('../config');

const UserSchema = new Schema({
  phone: {
    type: String,
    required: true,
    trim: true
  },

  firstName: {
    type: String,
    default: ''
  },

  lastName: {
    type: String,
    default: ''
  },

  avatar: {
    type: String,
    default: config.defaultAvatar
  },

  generatedNum: String,

  lastCalledNumber: {
    type: String,
    default: ''
  },

  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  },

  isBanned: {
    type: Boolean,
    default: false
  },

  comironUserId: String,

  pushTokens: [String]

}, { timestamps: true });

UserSchema.methods.generateJwt = function () {
  const payload = {
    _id: this._id,
    phone: this.phone
  };

  return jwt.sign(payload, config.jwtSecret);
};

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
