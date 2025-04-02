
import bcrypt from 'bcryptjs';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// Fixed user list - no database needed
const users: IUser[] = [
  {
    _id: '1',
    name: 'User One',
    email: 'user1',
    password: 'user1',
    createdAt: new Date(),
    matchPassword: async function(enteredPassword: string) {
      return enteredPassword === this.password;
    }
  },
  {
    _id: '2',
    name: 'Admin One',
    email: 'admin1',
    password: 'admin1',
    createdAt: new Date(),
    matchPassword: async function(enteredPassword: string) {
      return enteredPassword === this.password;
    }
  },
  {
    _id: '3',
    name: 'User Two',
    email: 'user2',
    password: 'user2',
    createdAt: new Date(),
    matchPassword: async function(enteredPassword: string) {
      return enteredPassword === this.password;
    }
  }
];

// User model methods
export default {
  // Find user by email
  findOne: async function(query: { email: string }) {
    console.log('Finding user with username:', query.email);
    const foundUser = users.find(user => user.email === query.email);
    console.log('User found:', foundUser ? 'Yes' : 'No');
    return foundUser;
  },
  
  // We won't need this anymore since we have fixed users
  create: async function(userData: { name: string; email: string; password: string }) {
    console.log('Create user operation attempted but disabled');
    return null;
  },
  
  // Export users array for debugging
  users
};

// Make the module available in CommonJS format too
module.exports = exports.default;
