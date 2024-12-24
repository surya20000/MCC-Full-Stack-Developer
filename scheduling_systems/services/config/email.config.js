import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { meetingScheduleHTMLTemplate } from "./meetingScheduleHTMLTemplate.js";
dotenv.config();

export const sendEmail = async ({
  to,
  messageBody,
  employeeName,
  date,
  Time,
}) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_SENDER_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_SENDER_EMAIL,
    to,
    subject: "Upcoming Meeting Schedule",
    html: meetingScheduleHTMLTemplate({
      date,
      Time,
      employeeName,
      messageBody,
    }),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error Sending Mail", error.message);
  }
};
