import Blog from '../models/blog.js'
import User from '../models/user.js'

export const getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
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
        
        // Find the first user in the database to assign as creator
        const user = await User.findOne({})
        
        if (!user) {
            return res.status(400).json({
                error: 'No users found in the database'
            })
        }
        
        const blog = new Blog({
            title, 
            author, 
            url,
            likes,
            user: user._id
        })
        
        const savedBlog = await blog.save()
        
        // Add the blog to the user's blogs array - more safely
        try {
            user.blogs = user.blogs.concat(savedBlog._id)
            await user.save()
        } catch (error) {
            // If user save fails, we still return the blog
            console.log('Warning: Could not update user blogs array:', error.message)
        }
        
        res.status(201).json(savedBlog)
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
        
        blog ? res.json(blog): res.status(404).json({error: 'Blog no found.'})
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