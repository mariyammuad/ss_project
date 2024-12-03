const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Admin = require('./models/User'); // Assuming you have this model defined
const Log = require('./models/Log'); // Assuming you log activities

const app = express();

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/secure_sys')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Nodemailer setup for sending verification emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

app.use(cors());
app.use(express.json());

// Middleware for JWT Authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied, no token provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token." });
    req.user = user;
    next();
  });
};

// Middleware for Role-Based Authorization
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user && req.user.role === requiredRole) {
      next();
    } else {
      res.status(403).json({ message: "Access denied: Unauthorized" });
    }
  };
};

// Helper function to hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const pepper = process.env.PEPPER;
  return bcrypt.hash(password + pepper, salt);
};

// Helper function to verify passwords
const verifyPassword = async (password, hashedPassword) => {
  const pepper = process.env.PEPPER;
  return bcrypt.compare(password + pepper, hashedPassword);
};

// Helper function for reCAPTCHA verification
const verifyRecaptcha = async (recaptchaResponse) => {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: secretKey,
        response: recaptchaResponse,
      },
    });

    const data = response.data;
    return data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
};

// Admin login endpoint
app.post('/api/login', async (req, res) => {
  console.log("Login request received. Request body:", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Missing email or password.");
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Admin login check
    console.log("Checking admin credentials...");
    const adminCheck = await verifyAdmin(email, password);
    if (adminCheck?.isValid) {
      console.log("Admin login successful.");
      return res.status(200).json({ message: 'Admin login successful', token: adminCheck.token });
    }

    // User login process
    console.log("Checking user account...");
    const user = await mongoose.connection.collection('users').findOne({ email });
    if (!user) {
      console.log("User not found.");
      return res.status(400).json({ message: 'User not found' });
    }

    if (!user.isEmailVerified) {
      console.log("Email not verified.");
      return res.status(400).json({ message: 'Please verify your email' });
    }

    console.log("Validating password...");
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password.");
      return res.status(400).json({ message: 'Invalid password' });
    }

    console.log("Generating token...");
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Login successful.");
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// User Registration
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(req.body.recaptchaResponse);
    if (!isRecaptchaValid) return res.status(400).json({ message: 'Invalid reCAPTCHA' });

    // Check if user already exists
    const userExists = await mongoose.connection.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const newUser = {
      username,
      email,
      password: hashedPassword,
      role: 'user',
      isEmailVerified: false,
    };

    await mongoose.connection.collection('users').insertOne(newUser);
    res.status(200).json({ message: 'Registration successful! Please check your email for verification.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// User Login
app.post('/api/user/login', async (req, res) => {
  const { username, password, recaptchaResponse } = req.body;

  try {
    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaResponse);
    if (!isRecaptchaValid) return res.status(400).json({ message: 'Invalid reCAPTCHA' });

    // Find user
    const user = await mongoose.connection.collection('users').findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid username or password' });

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected User Dashboard
app.get('/api/user/dashboard', authenticateToken, authorizeRole('user'), (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.username}! This is your user dashboard.` });
});

// Protected Admin Dashboard
app.get('/api/admin/dashboard', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.username}! This is your admin dashboard.` });
});

// Helper function to send login email
const sendLoginEmail = (toEmail, subject, text) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: toEmail,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
