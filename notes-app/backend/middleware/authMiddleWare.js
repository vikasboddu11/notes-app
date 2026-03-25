const jwt = require("jsonwebtoken")
const User = require("../model/userModel")

const protect = async(req, res, next) => {
    try {
        const token = req.cookies.accessToken

        if (!token) {
            return res.status(401).json({
                message: "Not authorized, please login"
            })
        }

        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
        } catch (err) {
            return res.status(401).json({
                message: "Session expired, please login again"
            })
        }

        const user = await User.findById(decoded.id).select("-password")

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            })
        }

        req.user = user

        next()

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Server error"
        })
    }
}

module.exports = protect