const UserModel = require('../../models/user');
const ContactModel = require('../../models/contact');

const ContactService = require('../../services/contacts');

exports.addContacts = async (req, res) => {
  try {
    const { contacts } = req.body;
    const { _id: userId } = req.user;
    console.log(JSON.stringify(contacts, null, 2));
    if (!contacts) {
      return res.status(400).json({ msg: 'Invalid data' });
    }

    if (!contacts.length) {
      return res.status(200).json({ msg: 'OK - contact array is empty' });
    }

    const formattedContacts = ContactService.reduceContacts(contacts);
    const phonesToFindInDB = ContactService.extractPhones(formattedContacts);

    const users = await UserModel.find({ phone: { $in: phonesToFindInDB } }, 'phone');
    const phonesArray = users.reduce((acc, user) => [...acc, user.phone], []);

    const markedContacts = ContactService.markExistingUsers(formattedContacts, phonesArray);

    const userContacts = await ContactModel.find({ userId });

    const newContacts = [];
    for (const contact of markedContacts) {
      const existingContact = userContacts.find(cnt => cnt.id === contact.id);
      let newContact = {};

      if (existingContact) {
        newContact = new ContactModel({
          userId,
          ...contact,
          rating: existingContact.rating,
          latestRatingValue: existingContact.latestRatingValue
        });
      } else {
        const numbers = contact.phoneNumbers.map(phone => phone.number);
        const similarContacts = await ContactModel.find({
          phoneNumbers: {
            $elemMatch: { number: numbers }
          }
        });

        const ratingContact = similarContacts.find(item => item.rating.averageValue > 0);
        newContact = new ContactModel({
          userId,
          ...contact
        });

        if (ratingContact) {
          newContact.rating = ratingContact.rating;
        }
      }

      newContacts.push(newContact);
    }

    await ContactModel.deleteMany({ userId });
    const promises = newContacts.map(contact => contact.save());
    await Promise.all(promises);

    return res.status(200).json({ msg: 'OK' });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.getContacts = async (req, res) => {
  try {
    const { _id } = req.user;
    const contacts = await ContactModel.find({ userId: _id });
    return res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.rateContact = async (req, res) => {
  try {
    const { contact, ratingValue } = req.body;
    if (!contact || !ratingValue) {
      return res.status(400).json({ msg: 'Invalid data' });
    }

    const numbers = contact.phoneNumbers.map(phone => phone.number);
    const contacts = await ContactModel.find({
      phoneNumbers: {
        $elemMatch: { number: numbers }
      }
    });

    const userContact = contacts.find(cnt => cnt.id === contact.id);
    userContact.latestRatingValue = ratingValue;

    const promises = [];
    for (const cnt of contacts) {
      cnt.updateRating(ratingValue);
      promises.push(cnt.save());
    }

    await Promise.all(promises);

    return res.status(200).json({ msg: 'OK' });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
