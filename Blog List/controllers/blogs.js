import Blog from '../models/blog.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'

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
        
        // Using request.token from tokenExtractor middleware
        if (!req.token) {
            return res.status(401).json({ error: 'token missing' })
        }
        
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if (!decodedToken.id) {
            return res.status(401).json({ error: 'token invalid' })
        }
        
        const user = await User.findById(decodedToken.id)
        if (!user) {
            return res.status(401).json({ error: 'user not found' })
        }
        
        const blog = new Blog({
            title, 
            author, 
            url,
            likes,
            user: user._id
        })
        
        const savedBlog = await blog.save()
        

        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        
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