import express from 'express'
import router from './routes/blogs.js'
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

app.use((error, req, res, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  
  res.status(500).json({ error: 'Something went wrong!' })
})

export default app