const utils = require('../../services/utils');
const uuidv4 = require('uuid/v4');
const base64Img = require('base64-img');
const config = require('../../config');
const validate = require('../../services/validate');

const UserModel = require('../../models/user');
const ContactModel = require('../../models/contact');

exports.getProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await UserModel
      .findById(_id)
      .populate('profile');

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.getRating = async (req, res) => {
  try {
    const { phone } = req.user;
    const similarContacts = await ContactModel.find({
      phoneNumbers: {
        $elemMatch: { number: phone }
      }
    });

    let rating = 0;
    const contact = similarContacts.find(item => item.rating.averageValue > 0);

    if (contact) {
      rating = contact.rating.averageValue;
    }

    return res.status(200).json(rating);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.update = async (req, res) => {
  try {
    const { _id } = req.user;
    const { profileId } = req.body;

    if (!profileId) {
      return res.status(400).json({ msg: 'Invalid data' });
    }

    const user = await UserModel.findById(_id);
    user.profile = profileId;
    await user.save();

    return res.status(200).json({ msg: 'User profile updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.setProfile = async (req, res) => {
  try {
    const { phone, profileId } = req.body;
    if (!phone || !validate.phoneNumber(phone) || !profileId) {
      return res.status(400).json({ msg: 'Invalid data' });
    }

    const rawPhone = utils.filterPhone(phone);
    const user = await UserModel.findOne({ phone: rawPhone });

    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    user.profile = profileId;
    await user.save();

    return res.status(200).json({ msg: 'Profile was set' });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.updatePublicProfile = async (req, res) => {
  try {
    const { firstName, lastName, avatar } = req.body;
    const { _id } = req.user;

    const user = await UserModel.findById(_id);

    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    if (avatar) {
      const imageName = uuidv4();
      const filePath = `${config.hostname}/` + utils.filterFilePath(
        base64Img.imgSync(avatar, config.avatarFolder, imageName)
      );
      user.avatar = filePath;
    }

    const newFistName = firstName.trim().length ? firstName.trim() : user.firstName;
    const newLastName = lastName.trim().length ? lastName.trim() : user.lastName;

    user.firstName = newFistName;
    user.lastName = newLastName;

    await user.save();

    return res.status(200).json({ msg: 'Public profile updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
