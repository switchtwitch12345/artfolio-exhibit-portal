import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    // Clean the MongoDB URI by removing angle brackets if present
    const mongoUri = process.env.MONGODB_URI.replace(/<|>/g, '');
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Export as both default and named export for compatibility
export default connectDB;
export { connectDB };
