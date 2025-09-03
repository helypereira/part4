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
        const {title, author, url, likes = 0} = req.body
        
        if (!title || !author || !url) {
            return res.status(400).json({
                error: 'Title, author, and URL are required'
            })
        }
        
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

export const updateBlog = async (req, res, next) => {
    try {
        const {title, author, url, likes} = req.body
        const blog = await Blog.findByIdAndUpdate(
            req.params.id, {
                title, author, url, likes
            },
            {
                new: true,
                runValidators: true
            }
        )
        
        updateBlog ? res.json(updateBlog): res.status(404).json({error: 'Blog no found.'})
    } catch (error) {
        next(error)
    }
}


export const deleteBlog = async(req, res, next) => {
    try {
        const deleteBlog = await Blog.findByIdAndDelete(req.params.id)
        deleteBlog ? res.status(204).end() : res.status(404).json({error: 'Blog no found.'})
    } catch (error) {
        next(error)
    }
}