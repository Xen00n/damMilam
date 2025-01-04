import express from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import dotenv from 'dotenv';


const router = express.Router();
dotenv.config();

// Nodemailer transporter with App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//profile

export const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from "Bearer <token>"

  console.log('Received Token:', token); // Log the received token

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = await User.findById(decoded.id); // Assuming the token has the user's ID

    // Proceed to the next middleware/route
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
router.get('/user/profile', authenticate, async (req, res) => {
  try {
    const user = req.user; // The authenticated user attached by authenticate middleware

    // Return user details (like _id, name, etc.)
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      // Any other fields you need to return
    });
  } catch (err) {
    console.error('Error fetching user data', err);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token
    const user_not_modified = await User.findById(decoded.id).select('-password'); // Retrieve user data without password

    if (!user_not_modified) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const user = {
      ...user_not_modified._doc,
      memberSince: user_not_modified.memberSince.toISOString().split('T')[0], // Format date to 'YYYY-MM-DD'
    };
    res.status(200).json({ success: true, user }); // Respond with user data
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }


});
// Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log('Signup request received', req.body);  // Log the request data

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash the password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, isVerified: false });

    await newUser.save();

    // Generate verification token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    // Send verification email
    await transporter.sendMail({
      from: `"DamMilam Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - DamMilam',
      html: `
        <h1>Welcome to DamMilam, ${name}!</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      `,
    });

    console.log('Verification email sent successfully');  // Log successful email send

    res.status(200).json({ success: true, message: 'Signup successful! Please check your email for verification.' });
  } catch (error) {
    console.error('Signup Error:', error);  // Log the error to identify where the failure is
    res.status(500).json({ success: false, message: 'Error occurred during signup.' });
  }
});
//login
router.post('/login', async (req, res) => {
  const { email, password} = req.body;
  try {
    console.log('Login request received:', req.body);

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password'); // Log missing field error
      return res.status(400).json({ success: false, message: 'Email and Password are required' });
    }

    // Find user in the database
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log('Password mismatch');
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Check email verification
    if (!user.isVerified) {
      console.log('Email not verified');
      return res.status(400).json({ success: false, message: 'Please verify your email before logging in' });
    }

    // Generate JWT
    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful');
    res.status(200).json({ success: true, message: 'Login successful', token });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

router.get('/verify-email', async (req, res) => {
  const { token } = req.query; // Extract token from the query params

  try {
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(400).json({ success: false, message: 'Invalid or expired token' });
  }
});


export default router;
