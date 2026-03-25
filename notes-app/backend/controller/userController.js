const User = require('../model/userModel')
const jwt = require("jsonwebtoken")
const generateToken = require('../token/generateToken')
const RefreshToken = require("../model/refreshTokenModel")
const { saveRefreshToken, deleteRefreshToken } = require('../services/tokenServices')

const registerUser = async(req, res) => {
    const { userName, email, password } = req.body
    try {
        if (!userName || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 letters" })
        }
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }
        const user = await User.create({
            userName,
            email,
            password
        })
        const { accessToken, refreshToken } = generateToken(user._id)

        await saveRefreshToken(user._id, refreshToken)
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 15 * 60 * 1000 })
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.status(200).json({
            message: "Login Successful"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server error"
        })
    }
}

const loginUser = async(req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "User does not exist, please try to regiester"
            })
        }
        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            return res.status(401).json({
                message: "Wrong password"
            })
        }
        const { accessToken, refreshToken } = generateToken(user._id)
        await saveRefreshToken(user._id, refreshToken)
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 15 * 60 * 1000 })
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.status(200).json({
            message: "Login Successful"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server error"
        })
    }
}

const logoutUser = async(req, res) => {
    const token = req.cookies.refreshToken
    if (token) {
        await deleteRefreshToken(token)
    }
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    res.status(200).json({
        message: "Logged out successfully"
    })
}

const userProfile = async(req, res) => {
    const user = req.user
    res.status(200).json({
        userName: user.userName,
        email: user.email
    })
}

const refreshAccessToken = async(req, res) => {
    try {
        const token = req.cookies.refreshToken
        if (!token) {
            return res.status(401).json({
                message: "RefreshToken unaivailable, try to login"
            })
        }
        const storedToken = await RefreshToken.findOne({ token })
        if (!storedToken) {
            return res.status(403).json({
                message: "Refresh token not available"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN)
        const { accessToken } = generateToken(decoded.id)
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 15 * 60 * 1000 })
        res.status(201).json({
            message: "Access token refreshed"
        })
    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired refresh token"
        })
    }
}

module.exports = { registerUser, loginUser, userProfile, logoutUser, refreshAccessToken }