const mongoose = require('mongoose')

const refreshTokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel"
    },
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model("refreshToken", refreshTokenSchema)