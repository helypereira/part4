import express from 'express'
import config from './utils/config.js'
import router from './routes/blogs.js'

config.connectDB()

const app = express()
app.use(express.json())
app.use('/api/blogs', router)

export default app;