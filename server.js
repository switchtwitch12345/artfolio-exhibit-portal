
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Import User model
const User = require('./src/models/User');

// Generate JWT
const generateToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET || 'manual_jwt_secret_12345';
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '30d',
  });
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt with:', { username: email, password: '***' });

    if (!email || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Find user by username
    console.log('Looking for user with username:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found for username:', email);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log('User found:', { id: user._id, username: user.email });
    
    // Check if password matches
    try {
      console.log('Attempting to match password');
      const isMatch = await user.matchPassword(password);
      console.log('Password match result:', isMatch);
      
      if (!isMatch) {
        console.log('Password did not match');
        return res.status(401).json({ message: 'Invalid username or password' });
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

// Registration endpoint - Now returns error saying registration is disabled
app.post('/api/auth/register', async (req, res) => {
  res.status(403).json({ message: 'Registration is disabled. Please use one of the provided accounts.' });
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

// Handle all routes
app.use('/api/*', (req, res) => {
  console.log('API route not found:', req.originalUrl);
  res.status(404).json({ message: 'API endpoint not found' });
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
  console.log(`Fixed accounts available:`);
  console.log(`username: user1, password: user1`);
  console.log(`username: admin1, password: admin1`);
  console.log(`username: user2, password: user2`);
  console.log(`Server API endpoints available at http://localhost:${PORT}/api/...`);
});
