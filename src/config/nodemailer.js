require('dotenv').config();
const nodemailer = require('nodemailer');


//console.log('SMTP_HOST:', process.env.SMTP_HOST);
//console.log('SMTP_PORT:', process.env.SMTP_PORT);
//console.log('SMTP_USER:', process.env.SMTP_USER);
//console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '****' : 'undefined');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
});

module.exports = transporter;