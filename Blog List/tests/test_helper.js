import Blog from '../models/blog.js'
import User from '../models/user.js'

const initialBlogs = [{
    title: "First blog",
    author: "John Doe",
    url: "https://example.com/first-blog"   
},
{
    title: "Second blog",
    author: "Jane Doe",
    url: "https://example.com/second-blog"
},]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

export { initialBlogs, blogsInDb, usersInDb }