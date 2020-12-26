const UserModel = require('../../models/user');

exports.add = async (req, res) => {
  try {
    const { token } = req.body;
    const { _id } = req.user;

    const user = await UserModel.findById(_id);

    if (!token) {
      return res.status(400).json({ msg: 'Invalid data' });
    }

    if (user.pushTokens.includes(token)) {
      return res.status(200).json({ msg: 'PushToken already exist, continue' });
    }

    user.pushTokens.push(token);
    await user.save();

    return res.status(200).json({ msg: 'Push token was added' });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.delete = async (req, res) => {
  try {
    const { token } = req.body;
    const { _id } = req.user;

    if (!token) {
      return res.status(400).json({ msg: 'Invalid data' });
    }

    const user = await UserModel.findById(_id);

    user.pushTokens.filter(elem => elem !== token);
    await user.save();

    return res.status(200).json({ msg: 'Push token was deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
