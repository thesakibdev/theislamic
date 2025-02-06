const nodemailer = require("nodemailer");

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASSWORD;
console.log(user, pass);

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "mailtrap-user-id", // Mailtrap ড্যাশবোর্ড থেকে নিন
    pass: "mailtrap-password", // Mailtrap ড্যাশবোর্ড থেকে নিন
  },
});
module.exports = transporter;
