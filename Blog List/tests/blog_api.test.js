import { test, after, beforeEach } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import Blog from '../models/blog.js'
import { initialBlogs, blogsInDb } from './test_helper.js'


beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

const api = supertest(app)

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

after(async () => {
    await mongoose.connection.close()
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('the first blog has correct properties', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(e => e.title)
  assert(titles.includes('First blog'))
})

test('blog posts have id property instead of _id', async () => {
  const response = await api.get('/api/blogs')
  
  const blogs = response.body
  
  // 4.9 to verify that each blog has the 'id' property
  blogs.forEach(blog => {
    assert(blog.id)
    assert(!blog._id)
  })
})


test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'Third blog',
    author: 'Alice Smith',
    url: 'https://example.com/third-blog',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await blogsInDb()

  assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

  const titles = blogsAtEnd.map(r => r.title)
  assert(titles.includes('Third blog'))
})


test('blog without content is not added', async () => {
  const newBlog = {
    title: '',
    author: '',
    url: '',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await blogsInDb()

  assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
})

// Exercise 4.11: Test that likes defaults to 0 when missing
test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Test Author',
    url: 'https://example.com/no-likes'
    // Note: deliberately omitting likes property
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)

  const blogsAtEnd = await blogsInDb()
  const addedBlog = blogsAtEnd.find(blog => blog.title === 'Blog without likes')
  assert.strictEqual(addedBlog.likes, 0)
})

//4.12: Test that missing title or url results in 400 Bad Request
test('blog without title is not added and responds with 400', async () => {
  const newBlog = {
    // title
    author: 'Test Author',
    url: 'https://example.com/no-title'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
})

test('blog without url is not added and responds with 400', async () => {
  const newBlog = {
    title: 'Blog without URL',
    author: 'Test Author'
    // url
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
})

test('blog without both title and url is not added and responds with 400', async () => {
  const newBlog = {
    // title
    author: 'Test Author'
    // url
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
})

// 4.13:deleting 
test('a blog can be deleted', async () => {
  const blogsAtStart = await blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await blogsInDb()

  assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)

  const titles = blogsAtEnd.map(r => r.title)
  assert(!titles.includes(blogToDelete.title))
})

test('deleting a blog with invalid id returns 404', async () => {
  const invalidId = '507f1f77bcf86cd799439011' // non-existe

  await api
    .delete(`/api/blogs/${invalidId}`)
    .expect(404)

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
})