import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error(`Invalid email or password`)
    }
})

//@desc get user profile
//@route /api/users/profile
//@acces Private
const getUserProfile = asyncHandler(async (req, res) => {
    //console.log(`in controller getUserProfile`)
    const user = await User.findById(req.user._id)
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(404)
        throw new Error(`User not found`)
    }
})

//@desc create user
//@route POST /api/users
//@acces Publick
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    //console.log(`user mail ${email}`)

    const userExists = await User.findOne({ email })
    //console.log(`user userExists ${userExists}`)

    if (typeof (userExists) !== "undefined" && userExists !== null) {
        console.log(`in if user doesnt exists`)
        res.status(400)
        throw new Error('User already exists')
    } else {
        //console.log(`in else user exists ${userExists} email ${email}`)
        const user = await User.create({
            name,
            email,
            password
        })

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
            })
        } else {
            res.status(400)
            throw new Error(`Invalid user data`)
        }
    }

})

//@desc update user profile
//@route PUT /api/users/profile
//@acces Private
const updateUserProfile = asyncHandler(async (req, res) => {

    //console.log(req.user)
    const user = await User.findById(req.user._id)
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }

        const updateUser = await user.save()

        res.json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
            token: generateToken(updateUser._id)
        })

    } else {
        res.status(404)
        throw new Error(`User not found`)
    }

})

export { authUser, getUserProfile, registerUser, updateUserProfile }