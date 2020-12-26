const ProfileModel = require('../models/profile');

exports.getAll = async (req, res) => {
  try {
    const profiles = await ProfileModel.find();
    return res.status(200).json(profiles);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
