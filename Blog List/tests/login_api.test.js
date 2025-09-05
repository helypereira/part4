import { test, after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import bcrypt from 'bcrypt'
import app from '../app.js'
import User from '../models/user.js'

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ 
      username: 'logintest', 
      name: 'Login Test User',
      passwordHash 
    })

    await user.save()
  })

  test('login succeeds with valid credentials', async () => {
    const loginData = {
      username: 'logintest',
      password: 'secret'
    }

    const response = await api
      .post('/api/login')
      .send(loginData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(response.body.token)
    assert.strictEqual(response.body.username, 'logintest')
    assert.strictEqual(response.body.name, 'Login Test User')
  })

  test('login fails with invalid credentials', async () => {
    const loginData = {
      username: 'logintest',
      password: 'wrongpassword'
    }

    const response = await api
      .post('/api/login')
      .send(loginData)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'invalid username or password')
    assert(!response.body.token)
  })

  test('login fails with non-existent user', async () => {
    const loginData = {
      username: 'nonexistent',
      password: 'password'
    }

    const response = await api
      .post('/api/login')
      .send(loginData)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'invalid username or password')
    assert(!response.body.token)
  })
})

after(async () => {
  await mongoose.connection.close()
})
