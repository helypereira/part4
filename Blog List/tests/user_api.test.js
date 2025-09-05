import { test, after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import bcrypt from 'bcrypt'
import app from '../app.js'
import User from '../models/user.js'
import { usersInDb } from './test_helper.js'

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'usertest', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'usertest',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'ab',
      name: 'Test User',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert(result.body.error.includes('Username must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'validuser',
      name: 'Test User',
      password: 'ab',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert(result.body.error.includes('Password must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username is missing', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      name: 'Test User',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert(result.body.error.includes('Username and password are required'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if password is missing', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'validuser',
      name: 'Test User',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert(result.body.error.includes('Username and password are required'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('viewing users', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'viewtest', passwordHash })

    await user.save()
  })

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('users are returned correctly', async () => {
    const response = await api.get('/api/users')

    assert.strictEqual(response.body.length, 1)
    assert.strictEqual(response.body[0].username, 'viewtest')
    assert(!response.body[0].passwordHash) 
  })
})

after(async () => {
  await mongoose.connection.close()
})
