require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer'); // Import nodemailer
const app = express();
const validator = require('validator');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/send-chart', limiter); // Apply rate limiting to the email endpoint

// Enable CORS for all routes
app.use(cors());

// Use body-parser to parse JSON bodies (with size limit)
app.use(bodyParser.json({ limit: '2mb' }));

// SMTP configuration using details from the image
const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: 'resend', // Use 'resend' as the username
    pass: 'process.env.RESEND_API_KEY' // Replace with your actual Resend API key
  }
});

app.post('/api/send-chart', async (req, res) => {
  const { email, imageData } = req.body;
  // Basic validation
  if (
    !email ||
    !validator.isEmail(email) ||
    !imageData ||
    !imageData.startsWith('data:image/png;base64,')
  ) {
    return res.status(400).send('Invalid input');
  }
  try {
    console.log('Attempting to send email to:', email);
    await transporter.sendMail({ // Use nodemailer's sendMail
      from: 'test@resend.dev', // Or any verified email
      to: email,
      subject: 'Your Bucks2Bar Chart',
      html: '<p>Attached is your chart image from Bucks2Bar.</p>',
      attachments: [
        {
          filename: 'chart.png',
          content: imageData.split(',')[1],
          encoding: 'base64'
        }
      ]
    });
    res.status(200).send('Sent');
  } catch (e) {
    console.error('Error sending email:', e);
    res.status(500).send('Error sending email: ' + e.message); // Include the error message
  }
});

app.listen(3000, () => {
  console.log('Express server running on http://localhost:3000');
});