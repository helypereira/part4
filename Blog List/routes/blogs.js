import express from 'express'
import userExtractor from '../middleware/userExtractor.js'

import {
    getAllBlogs,
    getBlogByID,
    createBlog,
    updateBlog,
    deleteBlog
} from '../controllers/blogs.js'

const router = express.Router()

router.get('/', getAllBlogs)
router.get('/:id', getBlogByID)
router.post('/', userExtractor, createBlog)
router.put('/:id', updateBlog)
router.delete('/:id', userExtractor, deleteBlog)

export default router;