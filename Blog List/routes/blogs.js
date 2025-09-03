import express from 'express'

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
router.post('/',createBlog)
router.put('/:id', updateBlog)
router.delete('/:id', deleteBlog)

export default router;