import express from 'express'

import {
    getAllBlogs,
    getBlogByID,
    createBlog
} from '../controllers/blogs.js'

const router = express.Router()

router.get('/', getAllBlogs)
router.get('/:id', getBlogByID)
router.post('/',createBlog)

export default router;