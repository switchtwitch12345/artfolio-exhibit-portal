
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const { connectDB } = require('./src/lib/db');
connectDB().then(() => {
  console.log('MongoDB connection established');
}).catch(err => {
  console.error('MongoDB connection failed:', err.message);
  process.exit(1);
});

// Import User model
const mongoose = require('mongoose');
let User;

// Handle User model import properly
try {
  User = require('./dist/models/User').default;
  console.log('User model imported successfully');
} catch (error) {
  console.error('Error importing User model from dist:', error);
  
  try {
    // Try alternate import path
    User = require('./src/models/User').default;
    console.log('User model imported from src successfully');
  } catch (innerError) {
    console.error('Error importing User model from src:', innerError);
    
    // Last resort - try to get it from mongoose models
    if (mongoose.models.User) {
      User = mongoose.models.User;
      console.log('Retrieved User model from mongoose.models');
    } else {
      console.error('Failed to import User model');
      process.exit(1);
    }
  }
}

// Generate JWT
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    return null;
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Registration attempt:', { name, email });

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: `Server error during registration: ${error.message}` });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('User found, comparing password');
    
    // Check if password matches
    try {
      const isMatch = await user.matchPassword(password);
      console.log('Password match result:', isMatch);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      const token = generateToken(user._id);
      if (!token) {
        return res.status(500).json({ message: 'Error generating authentication token' });
      }
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token,
      });
    } catch (pwError) {
      console.error('Password comparison error:', pwError);
      return res.status(500).json({ message: 'Error during password verification' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: `Server error during login: ${error.message}` });
  }
});

// Debug endpoint to check server status
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
