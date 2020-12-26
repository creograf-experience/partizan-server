const ChatModel = require('../../models/chat');
const MessageModel = require('../../models/message');
const UserModel = require('../../models/user');

const sendPermaBanRequestEmail = require('../../services/mailer');

exports.getAll = async (req, res) => {
  try {
    const { phone } = req.user;
    const chats = await ChatModel
      .find({ userPhone: phone })
      .populate({
        path: 'withWho.fake',
        select: 'profile generatedNum',
        populate: { path: 'profile' }
      })
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    return res.status(200).json(chats);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.permaBan = async (req, res) => {
  try {
    const { userPhone, mirrorPhone, chatId } = req.body;
    if (!userPhone || !mirrorPhone || !chatId) {
      return res.status(400).json({ msg: 'Invalid data' });
    }
    if (userPhone !== req.user.phone) {
      return res.status(403).json({ msg: 'Who are you?' });
    }

    const latestMessages = await MessageModel
      .find({ chatId })
      .sort({ _id: -1 })
      .limit(10);

    await sendPermaBanRequestEmail(userPhone, mirrorPhone, latestMessages);

    return res.status(200).json({ msg: 'Email sent' });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.permaBanLink = async (req, res) => {
  try {
    const { phone } = req.params;
    if (!phone) {
      return res.status(400).json({ msg: 'Invalid data' });
    }

    const user = await UserModel.findOne({ phone });
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    user.isBanned = true;
    await user.save();

    return res.status(200).json({ msg: 'User successfully perma banned' });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
