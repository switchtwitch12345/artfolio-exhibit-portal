
// Simple client-side authentication service without server dependency

// Define our hardcoded users
const hardcodedUsers = [
  {
    _id: '1',
    name: 'User One',
    email: 'user1',
    password: 'user1',
  },
  {
    _id: '2',
    name: 'Admin One',
    email: 'admin1',
    password: 'admin1',
  },
  {
    _id: '3',
    name: 'User Two',
    email: 'user2',
    password: 'user2',
  }
];

// Register user - disabled in this version
export const register = async () => {
  throw new Error('Registration is disabled. Please use one of the provided accounts.');
};

// Login user - check against hardcoded users
export const login = async (userData: { email: string; password: string }) => {
  console.log('Login attempt with:', { email: userData.email });
  
  // Simple validation
  if (!userData.email || !userData.password) {
    throw new Error('Please provide username and password');
  }
  
  // Find user by email
  const user = hardcodedUsers.find(u => u.email === userData.email);
  
  if (!user) {
    console.error('User not found for username:', userData.email);
    throw new Error('Invalid username or password');
  }
  
  // Check if password matches
  if (user.password !== userData.password) {
    console.error('Password did not match');
    throw new Error('Invalid username or password');
  }
  
  // Create response with token (just for API consistency)
  const response = {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: `fake-token-${user._id}-${Date.now()}`, // Simple fake token
  };
  
  // Store in localStorage for session persistence
  localStorage.setItem('user', JSON.stringify(response));
  
  return response;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  if (user) {
    return JSON.parse(user);
  }
  return null;
};
