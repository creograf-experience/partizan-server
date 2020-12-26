const utils = require('./utils');

const extractPhones = arr =>
  arr.reduce((acc, item) =>
    [...acc, ...item.phoneNumbers.map(phone => phone.number)], []
  );

const createPhoneNumbers = data =>
  data.reduce((acc, phone) => {
    const number = utils.formatPhone(phone.number);
    if (number.length < 11) return acc;

    return [...acc, { number }];
  }, []);

const createContact = data => {
  return {
    id: data.id,
    name: data.name,
    phoneNumbers: utils.uniqueArrayOfObjects(createPhoneNumbers(data.phoneNumbers), 'number'),
    rating: { averageValue: 0, data: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
  };
};

const reduceContacts = contacts => contacts.reduce((acc, contact) => {
  const { name, phoneNumbers } = contact;
  if (!name || !phoneNumbers || !phoneNumbers.length) {
    return acc;
  }

  const newContact = createContact(contact);
  if (!newContact.phoneNumbers.length) {
    return acc;
  }

  return [...acc, newContact];
}, []);

const markExistingUsers = (contacts, users) =>
  contacts.map(contact => {
    let userExist = false;

    const phoneNumbers = contact.phoneNumbers.map(phone => {
      if (!users.includes(phone.number)) {
        return { ...phone, phoneExist: false };
      }

      userExist = true;
      return { ...phone, phoneExist: true };
    });

    return {
      ...contact,
      phoneNumbers,
      userExist
    };
  });

module.exports = {
  extractPhones,
  createPhoneNumbers,
  createContact,
  reduceContacts,
  markExistingUsers
};
