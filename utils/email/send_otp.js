const { createTransport } = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtp = async (userEmail, otp) => {
  const htmlTemplate = fs.readFileSync(
    path.join(__dirname, "../template/otp_template.html"),
    "utf-8"
  );
  const formattedHtml = htmlTemplate.replace("{{.Otp}}", otp);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Your OTP Code",
    html: formattedHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendOtp;
