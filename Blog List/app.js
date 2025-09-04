import express from 'express'
import router from './routes/blogs.js'
import usersRouter from './routes/users.js'
import loginRouter from './controllers/login.js'
import { info } from './utils/logger.js'
import config from './utils/config.js'

config.connectDB()

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  info(`${req.method} ${req.path}`)
  next()
})

app.use('/api/blogs', router)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use((error, req, res, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }
  
  res.status(500).json({ error: 'Something went wrong!' })
})

export default app