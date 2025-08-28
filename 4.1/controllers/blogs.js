import Blog from '../models/blog.js'

export const getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find({})
        res.json(blogs)
    } catch (error) {
        next(error)
    }
}


export const getBlogByID = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id)
        blog ? res.json(blog) : res.status(404).json({error: 'Blog no found.'})
    } catch (error) {
        next(error)
    }
}

export const createBlog = async (req, res, next) => {
    try {
        const {title, author, url, likes} = req.body
        const blog = new Blog({
            title, 
            author, 
            url,
            likes
        })
        const saveBlog = await blog.save()
        res.status(201).json(saveBlog)
    } catch (error) {
        next(error)
    }
}