const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 150
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 5000
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }
}, { timestamps: true })

noteSchema.index({ createdBy: 1, updatedAt: -1 })

const Notes = mongoose.model("Notes", noteSchema)

module.exports = Notes