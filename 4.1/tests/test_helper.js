import Blog from '../models/blog.js'

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

export { initialBlogs, blogsInDb }