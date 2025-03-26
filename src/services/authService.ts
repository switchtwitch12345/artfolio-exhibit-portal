
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
    const response = await axios.post(`${API_URL}/register`, userData);
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An error occurred during registration');
    }
    throw new Error('Network error occurred');
  }
};

// Login user
export const login = async (userData: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Invalid credentials');
    }
    throw new Error('Network error occurred');
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
