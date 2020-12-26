const UserModel = require('../models/user');
const utils = require('../services/utils');
const validate = require('../services/validate');

exports.getComironUser = async (req, res) => {
  try {
    const { phone, comironUserId } = req.params;
    const formattedPhone = utils.formatPhone(phone);
    if (!validate.phone(formattedPhone)) {
      return res.status(400).json({
        success: false,
        message: `Invalid phone: ${phone}`
      });
    }

    if (!comironUserId) {
      return res.status(400).json({
        success: false,
        message: 'Provide comiron user id'
      });
    }

    const user = await UserModel.findOne({ phone: formattedPhone });
    if (!user) {
      return res.status(200).json({
        success: true,
        id: null
      });
    }

    user.comironUserId = comironUserId;
    await user.save();

    return res.status(200).json({
      success: true,
      id: user._id
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
