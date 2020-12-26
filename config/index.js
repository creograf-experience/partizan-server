const path = require('path');

module.exports = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 4000,
  jwtSecret: 'secret',
  encryptionKey: '/eixM/exigEhNgMUqEkDvPA3Bv+X2gRfvUKN/aJ7Q0Y=',
  signingKey: 'cCyYY/Xzx4JmZw9cPijFIy/odvZEX4Ku/dkNfoEz2wE0E/QJU/jtMoP4XNERNOMjtQBzH9cZC3rpVgdr/x2fvQ==',
  imageFolder: path.join(__dirname.replace('/config', ''), '/public/uploads/img'),
  avatarFolder: path.join(__dirname.replace('/config', ''), '/public/uploads/avatar'),
  defaultAvatar: 'http://partizan.comiron.com/default-avatar.jpg',
  voiceMessageFolder: path.join(__dirname.replace('/config', ''), '/public/uploads/voice'),
  encodedVoiceFolder: path.join(__dirname.replace('/config', ''), '/public/uploads/encoded-voice'),
  hostname: 'http://partizan.comiron.com',

  dev: {
    db: 'mongodb://localhost/partizan'
  },

  test: {
    db: 'mongodb://localhost/partizan-test'
  },

  production: {
    db: 'mongodb://localhost/partizan'
  }
};
