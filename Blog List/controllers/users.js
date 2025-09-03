import bcrypt from 'bcrypt'
import User from '../models/user.js'

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({})
        res.json(users)
    } catch (error) {
        next(error)
    }
}

export const createUser = async (req, res, next) => {
    try {
        const { username, name, password } = req.body

   
        if (!username || !password) {
            return res.status(400).json({
                error: 'Username and password are required'
            })
        }

       
        if (username.length < 3) {
            return res.status(400).json({
                error: 'Username must be at least 3 characters long'
            })
        }

        if (password.length < 3) {
            return res.status(400).json({
                error: 'Password must be at least 3 characters long'
            })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            name,
            passwordHash
        })

        const savedUser = await user.save()
        res.status(201).json(savedUser)
    } catch (error) {
        next(error)
    }
}
