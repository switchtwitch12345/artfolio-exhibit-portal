
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

// Import User model
const User = require('./src/models/User').default || require('./src/models/User');

// Generate JWT
const generateToken = (id) => {
  // Use a fixed JWT secret if environment variable is not available
  const jwtSecret = process.env.JWT_SECRET || 'manual_jwt_secret_12345';
  return jwt.sign({ id }, jwtSecret, {
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
    
    console.log('Login attempt with:', { email, password: '***' });

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('User found:', { id: user._id, email: user.email });
    
    // Check if password matches
    try {
      console.log('Attempting to match password');
      const isMatch = await user.matchPassword(password);
      console.log('Password match result:', isMatch);
      
      if (!isMatch) {
        console.log('Password did not match');
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      const token = generateToken(user._id);
      if (!token) {
        console.log('Failed to generate token');
        return res.status(500).json({ message: 'Error generating authentication token' });
      }
      
      console.log('Login successful, returning user data and token');
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

// Special debug endpoint to check user database
app.get('/api/debug/users', (req, res) => {
  try {
    const safeUsers = User.users ? User.users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt
    })) : [];
    
    res.json({ 
      users: safeUsers,
      message: 'This endpoint is for debugging only'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
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
  console.log(`Default user created: admin@example.com / password123`);
});
