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
  
  // Verificar que cada blog tenga la propiedad 'id'
  blogs.forEach(blog => {
    assert(blog.id)
    assert(!blog._id) // No debería tener _id
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