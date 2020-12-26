const validate = require('../../services/validate');

describe('validate', () => {
  const truePhone = '79224135820';
  const falsePhone = '792abc241';

  describe('phone', () => {
    it('should return true', () => {
      expect(validate.phone(truePhone)).toBe(true);
    });

    it('should return false', () => {
      expect(validate.phone(falsePhone)).toBe(false);
    });
  });

  describe('phoneNumber', () => {
    it('should return true', () => {
      expect(validate.phoneNumber(truePhone)).toBe(true);
    });

    it('should return false', () => {
      expect(validate.phoneNumber(falsePhone)).toBe(false);
    });
  });

  describe('newChat', () => {
    const receiver = {
      phone: '123',
      contactName: 'john'
    };
    const content = {
      message: 'hello',
      attachment: 'world'
    };

    it('should return true', () => {
      expect(validate.newChat(receiver, content)).toBe(true);
    });

    it('should return false', () => {
      expect(validate.newChat({ phone: '123' }, { message: 'hello' }))
        .toBe(false);
    });
  });

  describe('newMessage', () => {
    const data = {
      chatId: '1',
      mirrorId: '2',
      message: 'hello',
      attachment: 'world'
    };

    it('should return true', () => {
      expect(validate.newMessage(data)).toBe(true);
    });

    it('should return false', () => {
      expect(validate.newMessage({ chatId: '1' })).toBe(false);
    });
  });
});
