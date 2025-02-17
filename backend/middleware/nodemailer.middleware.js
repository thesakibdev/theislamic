const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "rayan.cit.bd@gmail.com",
    pass: "njos bbvj yxjm ybxp",
  },
});
module.exports = transporter;
