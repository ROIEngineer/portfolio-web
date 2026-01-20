import express from "express"; // server framework
import cors from "cors"; // allows frontend to talk to backend
import dotenv from "dotenv"; // keeps environment variables credentials secure
import nodemailer from "nodemailer"; // sends emails
import validator from "validator"; // validates emails

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Sends mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST CONTACT
app.post("/api/contact", async (req, res) => {
  // Setup contact endpoint
  const {firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // HEAVY email validation using validator.js
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      error: "Please provide a valid email address"
    });
  }

  // Additional email checks with validator.js
  if (!validator.isLength(email, { max: 254 })) {
    return res.status(400).json({
      error: "Email address is too long"
    });
  }

  // Message validation (just length)
  if (!message || message.length > 1000) {
    return res.status(400).json({
      error: "Message must be less than 1000 characters"
    });
  }

  // Prevents obvious XSS - basic sanitization
  const sanitizedMessage = validator.escape(message);
  const sanitizedFirstName = validator.escape(firstName);
  const sanitizedLastName = validator.escape(lastName);

  try {
    await transporter.sendMail({
      from: `"${sanitizedFirstName} ${sanitizedLastName}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: subject || "New Portfolio Contact",
      text: `Name: ${sanitizedFirstName} ${sanitizedLastName} Email: ${email} Subject: ${subject} Message: ${sanitizedMessage}`,});

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
