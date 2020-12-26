const utils = require('../../services/utils');

const phone = '+8 (922) 413 58 - 20';
const path = './dir/folder/public/uploads/file.png';
const array = [{ data: 'hello' }, { data: 'hello' }, { data: 'world' }];

describe('utils', () => {
  describe('filterPhone', () => {
    it('should return 89224135820', () => {
      expect(utils.filterPhone(phone)).toBe('89224135820');
    });
  });

  describe('formatPhone', () => {
    it('should return 79224135820', () => {
      expect(utils.formatPhone(phone)).toBe('79224135820');
    });
  });

  describe('filterPath', () => {
    it('should return public/uploads/file.png', () => {
      expect(utils.filterFilePath(path)).toBe('public/uploads/file.png');
    });
  });

  describe('uniqueArrayOfObjects', () => {
    it('should return unique array of objects', () => {
      expect(utils.uniqueArrayOfObjects(array, 'data'))
        .toStrictEqual([{ data: 'hello' }, { data: 'world' }]);
    });
  });

  describe('getSocketByPhone', () => {
    const phone = '79224135820';
    const users = new Map().set('socket-id', { phone });

    it('should return socket-id', () => {
      expect(utils.getSocketByPhone(phone, users)).toBe('socket-id');
    });

    it('should return undefined', () => {
      expect(utils.getSocketByPhone('123', users)).toBeUndefined();
    });
  });
});
