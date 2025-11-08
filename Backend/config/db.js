import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Use MongoDB Atlas connection string as fallback (you can replace this with your own)
    const mongoURI = process.env.MONGODB_URI ||
      'mongodb+srv://demo:demo123@cluster0.mongodb.net/1fi-project?retryWrites=true&w=majority';

    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 Possible solutions:');
    console.error('   1. Check if MongoDB is running locally');
    console.error('   2. Update MONGODB_URI in .env file');
    console.error('   3. Use MongoDB Atlas for cloud database');
    process.exit(1);
  }
};

export default connectDB;

