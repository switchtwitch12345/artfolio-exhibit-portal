
import axios from 'axios';

// Define API base URL with fallbacks
const getBaseUrl = () => {
  // In development: try different ports
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api/auth';
  }
  // In production: use relative path
  return '/api/auth';
};

// Use the determined API URL
const API_URL = getBaseUrl();
console.log('Authentication API URL configured as:', API_URL);

// Register user
export const register = async (userData: { name: string; email: string; password: string }) => {
  try {
    console.log('Sending registration request:', { email: userData.email, name: userData.name });
    const response = await axios.post(`${API_URL}/register`, userData);
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An error occurred during registration');
    }
    throw new Error('Network error occurred during registration');
  }
};

// Login user
export const login = async (userData: { email: string; password: string }) => {
  try {
    console.log('Sending login request with credentials:', { email: userData.email });
    console.log('API URL being used:', API_URL);
    
    // Add timeout to prevent hanging requests
    const response = await axios.post(`${API_URL}/login`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });
    
    console.log('Login response received:', response.data);
    
    if (response.data && response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } else {
      console.error('Login response missing token:', response.data);
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Login error details:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response error data:', error.response.data);
        console.error('Response status:', error.response.status);
        throw new Error(error.response.data.message || 'Invalid credentials');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check if the server is running by opening a terminal and running "node server.js"');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Server might be down or unreachable.');
      }
    }
    throw new Error('Network error occurred during login');
  }
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
