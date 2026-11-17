const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    tokenHash: {
        type: String,
        required: true
    },
    tokenId: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0
    }
})

refreshTokenSchema.index(
    { tokenHash: 1 },
    {
        unique: true,
        partialFilterExpression: { tokenHash: { $type: "string" } }
    }
)

module.exports = mongoose.model("refreshToken", refreshTokenSchema)