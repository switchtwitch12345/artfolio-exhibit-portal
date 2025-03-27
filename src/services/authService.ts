
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Define the service URL
const API_URL = '/api/auth';

// Function to generate a secure JWT key (optional - you can simply type your own)
export const generateJwtKey = (): string => {
  // Generate a random UUID and convert to base64
  return Buffer.from(uuidv4() + uuidv4(), 'utf8').toString('base64');
};

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
    console.log('Sending login request:', { email: userData.email });
    
    // Add delay to ensure request is properly sent
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await axios.post(`${API_URL}/login`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });
    
    if (response.data && response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } else {
      console.error('Login response missing token:', response.data);
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Login error:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response error data:', error.response.data);
        throw new Error(error.response.data.message || 'Invalid credentials');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please try again later.');
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
