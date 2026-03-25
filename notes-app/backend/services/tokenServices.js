const RefreshToken = require("../model/refreshTokenModel")

const saveRefreshToken = async(userId, token) => {

    await RefreshToken.create({
        userId,
        token,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    })

}

const deleteRefreshToken = async(token) => {

    await RefreshToken.deleteOne({ token })

}

module.exports = {
    saveRefreshToken,
    deleteRefreshToken
}