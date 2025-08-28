import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },
  author: {
    type: String, 
    required: true
  },
  url: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    required: false,
  }
}, {
  timestamps: true
})

export default mongoose.model('Blog', blogSchema);