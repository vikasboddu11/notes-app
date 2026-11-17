const jwt = require("jsonwebtoken")
const User = require("../model/userModel")
const { getTokenSecrets } = require("../config/tokenConfig")

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken
        if (!token) {
            return res.status(401).json({
                message: "Authentication required"
            })
        }

        let payload
        try {
            const { accessTokenSecret } = getTokenSecrets()
            payload = jwt.verify(token, accessTokenSecret, {
                algorithms: ["HS256"]
            })
        } catch (err) {
            return res.status(401).json({
                message: "Access token is invalid or expired"
            })
        }

        if (
            typeof payload !== "object" ||
            payload.tokenType !== "access" ||
            !payload.sub
        ) {
            return res.status(401).json({ message: "Invalid access token" })
        }

        const user = await User.findById(payload.sub).select("-password")
        if (!user) {
            return res.status(401).json({
                message: "Authentication required"
            })
        }

        req.user = user
        return next()
    } catch (error) {
        console.error("Authentication failed", error)
        return res.status(500).json({
            message: "Server error"
        })
    }
}

module.exports = protect