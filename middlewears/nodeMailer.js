var nodemailer = require('nodemailer');

const dotenv = require('dotenv')

dotenv.config();
async function SendMail(mail, message) {

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS_KEY
      }
    });
    
    var mailOptions = {
      from: process.env.EMAIL,
      to: mail,
      subject: 'Email rececived',
      text: message
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

module.exports = SendMail;