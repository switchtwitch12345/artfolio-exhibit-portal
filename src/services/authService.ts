
import axios from 'axios';

// Define the service URL
const API_URL = '/api/auth';

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
    
    const response = await axios.post(`${API_URL}/login`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
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
