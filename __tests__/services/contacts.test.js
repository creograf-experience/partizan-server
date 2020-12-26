const contacts = require('../../services/contacts');

const array = [
  {
    id: '1',
    name: 'Вася',
    phoneNumbers: [
      {
        id: '1',
        number: '79224135820'
      },
      {
        id: '2',
        number: '79224135111'
      }
    ]
  }
];

describe('contacts', () => {
  describe('extractPhone', () => {
    it('should return array of phones', () => {
      const result = contacts.extractPhones(array);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result).toEqual(['79224135820', '79224135111']);
    });
  });

  describe('reduceContacts', () => {
    it('should return formatted array of contacts', () => {
      const result = contacts.reduceContacts(array);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result).toStrictEqual([
        {
          id: '1',
          name: 'Вася',
          phoneNumbers: [
            { number: '79224135820' },
            { number: '79224135111' }
          ],
          rating: { averageValue: 0, data: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
        }
      ]);
    });
  });

  describe('markExistingUsers', () => {
    it('should return array with marked users', () => {
      const contactList = [
        {
          phoneNumbers: [{ number: '79224135820' }, { number: '79224135111' }]
        }
      ];
      const users = ['79224135820'];
      const result = contacts.markExistingUsers(contactList, users);

      expect(result).toBeInstanceOf(Array);
      expect(result).toStrictEqual([
        {
          phoneNumbers: [
            { number: '79224135820', phoneExist: true },
            { number: '79224135111', phoneExist: false }
          ],
          userExist: true
        }
      ]);
    });
  });
});
