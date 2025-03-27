
import bcrypt from 'bcryptjs';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// In-memory user database
const users: IUser[] = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    // Default password: password123
    password: '$2a$10$eCyRoEL0BlAKIib.qSYIO.9tlb7Tu1VbcLV8V85MOfQyUCdGV0Pn2',
    createdAt: new Date(),
    matchPassword: async function(enteredPassword: string) {
      try {
        console.log('Comparing password for admin user');
        return await bcrypt.compare(enteredPassword, this.password);
      } catch (error) {
        console.error('Password comparison error:', error);
        throw error;
      }
    }
  }
];

// Add debugging exports
export { users };

// User model methods
export default {
  // Find user by email
  findOne: async function(query: { email: string }) {
    console.log('Finding user with email:', query.email);
    console.log('Available users:', users.map(u => u.email));
    const foundUser = users.find(user => user.email === query.email);
    console.log('User found:', foundUser ? 'Yes' : 'No');
    return foundUser;
  },
  
  // Create a new user
  create: async function(userData: { name: string; email: string; password: string }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    const newUser = {
      _id: (users.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      createdAt: new Date(),
      matchPassword: async function(enteredPassword: string) {
        try {
          return await bcrypt.compare(enteredPassword, this.password);
        } catch (error) {
          console.error('Password comparison error:', error);
          throw error;
        }
      }
    };
    
    users.push(newUser);
    return newUser;
  },
  
  // Add users array for debugging
  users
};

// Make the module available in CommonJS format too
module.exports = exports.default;
