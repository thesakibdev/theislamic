const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "saa050245@gmail.com",
    pass: "S8@AS1234560987#",
  },
});
module.exports = transporter;
