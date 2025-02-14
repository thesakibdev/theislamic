const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ahmedmasaud942@gmail.com",
    pass: "jrhy ctrt jeog lyfa",
  },
});
module.exports = transporter;
