const jwt = require('jsonwebtoken')
const crypto = require("node:crypto")
const {
    ACCESS_TOKEN_TTL_SECONDS,
    REFRESH_TOKEN_TTL_SECONDS,
    getTokenSecrets
} = require("../config/tokenConfig")

const generateToken = (userId) => {
    const { accessTokenSecret, refreshTokenSecret } = getTokenSecrets()
    const subject = String(userId)
    const refreshTokenId = crypto.randomUUID()

    const accessToken = jwt.sign(
        { tokenType: "access" },
        accessTokenSecret,
        { subject, expiresIn: ACCESS_TOKEN_TTL_SECONDS }
    )
    const refreshToken = jwt.sign(
        { tokenType: "refresh" },
        refreshTokenSecret,
        {
            subject,
            jwtid: refreshTokenId,
            expiresIn: REFRESH_TOKEN_TTL_SECONDS
        }
    )

    return { accessToken, refreshToken, refreshTokenId }
}

module.exports = generateToken