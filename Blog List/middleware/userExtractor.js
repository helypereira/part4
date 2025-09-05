import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const userExtractor = async (request, response, next) => {
  try {
    if (!request.token) {
      return response.status(401).json({ error: 'token missing' })
    }
    
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    
    const user = await User.findById(decodedToken.id)
    if (!user) {
      return response.status(401).json({ error: 'user not found' })
    }
    
    request.user = user
    next()
  } catch (error) {
    next(error)
  }
}

export default userExtractor
