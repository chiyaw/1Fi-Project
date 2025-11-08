import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MONGODB_FALLBACK_URI, DB_MESSAGES } from '../constant.js';

dotenv.config();

const connectDB = async () => {
  try {
    // Use MongoDB Atlas connection string as fallback (you can replace this with your own)
    const mongoURI = process.env.MONGODB_URI || MONGODB_FALLBACK_URI;

    console.log(DB_MESSAGES.CONNECTING);
    const conn = await mongoose.connect(mongoURI);

    console.log(`${DB_MESSAGES.CONNECTED} ${conn.connection.host}`);
    console.log(`${DB_MESSAGES.DATABASE_NAME} ${conn.connection.name}`);
  } catch (error) {
    console.error(`${DB_MESSAGES.CONNECTION_ERROR} ${error.message}`);
    DB_MESSAGES.SOLUTIONS.forEach(solution => console.error(solution));
    process.exit(1);
  }
};

export default connectDB;

