const jwt = require("jsonwebtoken")
const User = require("../model/userModel")
const generateToken = require("../token/generateToken")
const {
    ACCESS_TOKEN_TTL_SECONDS,
    REFRESH_TOKEN_TTL_SECONDS,
    getTokenSecrets
} = require("../config/tokenConfig")
const {
    saveRefreshToken,
    consumeRefreshToken,
    deleteRefreshToken
} = require("../services/tokenServices")

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const getCookieOptions = (maxAge) => {
    const isProduction = process.env.NODE_ENV === "production"
    const options = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/"
    }

    if (typeof maxAge === "number") {
        options.maxAge = maxAge
    }

    return options
}

const clearAuthCookies = (res) => {
    const options = getCookieOptions()
    res.clearCookie("accessToken", options)
    res.clearCookie("refreshToken", options)
}

const getPublicUser = (user) => ({
    id: user._id.toString(),
    userName: user.userName,
    email: user.email
})

const setAuthCookies = (res, tokens) => {
    res.cookie(
        "accessToken",
        tokens.accessToken,
        getCookieOptions(ACCESS_TOKEN_TTL_SECONDS * 1000)
    )
    res.cookie(
        "refreshToken",
        tokens.refreshToken,
        getCookieOptions(REFRESH_TOKEN_TTL_SECONDS * 1000)
    )
}

const createSession = async (user, res) => {
    const tokens = generateToken(user._id)
    await saveRefreshToken(user._id, tokens.refreshToken, tokens.refreshTokenId)
    setAuthCookies(res, tokens)
}

const sendAuthError = (res, error) => {
    if (error.code === 11000) {
        return res.status(409).json({ message: "An account with this email already exists" })
    }

    if (error.name === "ValidationError") {
        return res.status(400).json({ message: "Invalid account details" })
    }

    console.error("Authentication request failed", error)
    return res.status(500).json({ message: "Server error" })
}

const registerUser = async (req, res) => {
    const userName = typeof req.body?.userName === "string" ? req.body.userName.trim() : ""
    const email = typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : ""
    const password = typeof req.body?.password === "string" ? req.body.password : ""

    if (!userName || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" })
    }
    if (userName.length < 2 || userName.length > 50) {
        return res.status(400).json({ message: "Username must be between 2 and 50 characters" })
    }
    if (!EMAIL_PATTERN.test(email) || email.length > 254) {
        return res.status(400).json({ message: "Please enter a valid email address" })
    }
    if (password.trim().length === 0 || password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" })
    }
    if (Buffer.byteLength(password, "utf8") > 72) {
        return res.status(400).json({ message: "Password must not exceed 72 bytes" })
    }

    try {
        if (await User.exists({ email })) {
            return res.status(409).json({
                message: "An account with this email already exists"
            })
        }

        const user = await User.create({ userName, email, password })
        await createSession(user, res)
        return res.status(201).json({
            message: "Registration successful",
            user: getPublicUser(user)
        })
    } catch (error) {
        return sendAuthError(res, error)
    }
}

const loginUser = async (req, res) => {
    const email = typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : ""
    const password = typeof req.body?.password === "string" ? req.body.password : ""

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }

    try {
        const user = await User.findOne({ email }).select("+password")
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        await createSession(user, res)
        return res.status(200).json({
            message: "Login successful",
            user: getPublicUser(user)
        })
    } catch (error) {
        return sendAuthError(res, error)
    }
}

const logoutUser = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken
        if (token) {
            await deleteRefreshToken(token)
        }

        clearAuthCookies(res)
        return res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        clearAuthCookies(res)
        return sendAuthError(res, error)
    }
}

const userProfile = (req, res) => {
    return res.status(200).json(getPublicUser(req.user))
}

const refreshAccessToken = async (req, res) => {
    const token = req.cookies?.refreshToken
    if (!token) {
        return res.status(401).json({ message: "Refresh token is required" })
    }

    let payload
    try {
        const { refreshTokenSecret } = getTokenSecrets()
        payload = jwt.verify(token, refreshTokenSecret, {
            algorithms: ["HS256"]
        })
    } catch {
        return res.status(401).json({ message: "Refresh token is invalid or expired" })
    }

    if (
        typeof payload !== "object" ||
        payload.tokenType !== "refresh" ||
        !payload.sub ||
        !payload.jti
    ) {
        return res.status(401).json({ message: "Refresh token is invalid" })
    }

    try {
        const user = await User.findById(payload.sub)
        if (!user) {
            return res.status(401).json({ message: "Refresh token is invalid" })
        }

        const storedToken = await consumeRefreshToken(token, user._id, payload.jti)
        if (!storedToken) {
            return res.status(401).json({ message: "Refresh token is invalid or has been used" })
        }

        await createSession(user, res)
        return res.status(200).json({
            message: "Tokens refreshed",
            user: getPublicUser(user)
        })
    } catch (error) {
        return sendAuthError(res, error)
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    userProfile,
    refreshAccessToken
}
