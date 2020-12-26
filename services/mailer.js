const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const senderEmail = 'creograf.vitalcms@gmail.com';

const transporter = nodemailer.createTransport(
  smtpTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'creograf.vitalcms@gmail.com',
      pass: 'gjtpl yf xtnsht xfcf'
    }
  })
);

const sendPermaBanRequestEmail = async (userPhone, mirrorPhone, latestMessages) => {
  try {
    await transporter.sendMail({
      from: senderEmail,
      to: 'MarkFosseddy@gmail.com',
      subject: 'Partizan жалоба на пользователя',
      html: createEmailMessage(userPhone, mirrorPhone, latestMessages)
    });
  } catch (err) {
    console.error(err);
  }
};

const createEmailMessage = (userPhone, mirrorPhone, latestMessages) => `
  <p>Телефон пользователя: ${userPhone}</p>
  <p>Телефон собеседника: ${mirrorPhone}</p>
  <br>
  <p>Последние сообщения: </p>
  ${
    latestMessages.reverse().map(message =>
      message.from === userPhone
        ? `<p>Пользователь: ${message.content.message}</p>`
        : `<p>Собеседник: ${message.content.message}</p>`
    )
  }
  <br>
  <a href="http://partizan.comiron.com/api/users/chats/perma-ban/${mirrorPhone}">Забанить пользователя?</a>
`;

module.exports = sendPermaBanRequestEmail;
