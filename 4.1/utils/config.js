import 'dotenv/config';
import mongoose from 'mongoose';
import {info, error} from '../utils/logger.js'

const PORT = process.env.PORT || 3003

let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.MONGODB_URI_TEST
}

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(MONGODB_URI)
    info('Connected to MongoDB')
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
