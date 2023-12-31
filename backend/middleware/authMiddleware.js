import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
    let token
    try {
        if (req.headers.authorization) {
            token = req.headers.authorization
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            try {
                const user = await User.findById(decoded.id).select('-password')
                if (user) {
                    req.user = user
                    next()
                } else {
                    res.status(404)
                    res.json({
                        message: "Not Found User with this token"
                    })
                    //throw new Error('Not Found User with this token')
                }
            } catch (error) {
                res.status(401)
                throw new Error(`Not authorized, token failed whit error => ${error.message}`)
            }
        }
    } catch (error) {
        res.status(401)
        throw new Error(`Not authorized, token failed whit error => ${error.message}`)
    }
    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})
export { protect }
