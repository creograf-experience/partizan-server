const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  name: String,

  avatar: String
});

const ProfileModel = mongoose.model('Profile', ProfileSchema);
module.exports = ProfileModel;
