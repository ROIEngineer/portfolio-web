import express from "express"; // server framework
import cors from "cors"; // allows frontend to talk to backend
import dotenv from "dotenv"; // keeps environment variables credentials secure
import nodemailer from "nodemailer"; // sends emails

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// handles sending mail
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

  try {
    await transporter.sendMail({
      from: `"${firstName} ${lastName}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: subject || "New Portfolio Contact",
      text: `Name: ${firstName} ${lastName} Email: ${email} Subject: ${subject} Message: ${message}`,});

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// GET CONTACT
app.get("/", (req, res) => {
  res.json({
    message: "Contact API is running",
    environment: process.env.NODE_ENV,
    port: process.env.PORT
  });
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => console.log(`Contact API running on port ${PORT}`));
