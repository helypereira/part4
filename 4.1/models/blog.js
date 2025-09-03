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

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default mongoose.model('Blog', blogSchema);