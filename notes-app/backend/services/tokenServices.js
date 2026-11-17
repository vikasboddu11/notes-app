const crypto = require("node:crypto")
const RefreshToken = require("../model/refreshTokenModel")
const { REFRESH_TOKEN_TTL_SECONDS } = require("../config/tokenConfig")

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex")

const saveRefreshToken = async (userId, token, tokenId) => {
    return RefreshToken.create({
        userId,
        tokenHash: hashToken(token),
        tokenId,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000)
    })
}

const consumeRefreshToken = async (token, userId, tokenId) => {
    return RefreshToken.findOneAndDelete({
        tokenHash: hashToken(token),
        userId,
        tokenId,
        expiresAt: { $gt: new Date() }
    })
}

const deleteRefreshToken = async (token) => {
    return RefreshToken.deleteOne({ tokenHash: hashToken(token) })
}

module.exports = {
    saveRefreshToken,
    consumeRefreshToken,
    deleteRefreshToken
}