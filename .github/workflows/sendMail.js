const nodemailer = require('nodemailer');

const sendEmail = async (message) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'ilker@lityum.com',
    subject: '🚨 Domain İçeriği Eksik!',
    text: message
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('E-posta gönderildi:', info.response);
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
  }
};

const message = process.argv[2] || "Bilinmeyen hata!";
sendEmail(message);
