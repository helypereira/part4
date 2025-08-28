import 'dotenv/config';
import mongoose from 'mongoose';
import {info, error} from '../utils/logger.js'

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI


const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(MONGODB_URI)
  } catch (err) {
    error('Connect MongoDB ERROR', err.message)
    process.exit(1)
  }
}


export default {
  PORT,
  MONGODB_URI,
  connectDB
}


// 35.148.166.229
// almeidahely
// yNTp9W9C8hM8p1XP