const mongoose = require("mongoose")
const Note = require("../model/NoteModel")

const isValidNoteId = (id) => mongoose.isValidObjectId(id)
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const sendError = (res, error) => {
    if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({ message: "Invalid note data" })
    }

    console.error("Note request failed", error)
    return res.status(500).json({ message: "Server error" })
}

const getNotes = async (req, res) => {
    try {
        const filter = { createdBy: req.user._id }
        const search = typeof req.query.search === "string"
            ? req.query.search.trim().slice(0, 100)
            : ""

        if (search) {
            const expression = new RegExp(escapeRegex(search), "i")
            filter.$or = [
                { title: expression },
                { description: expression }
            ]
        }

        const notes = await Note.find(filter).sort({ updatedAt: -1 })
        return res.status(200).json(notes)
    } catch (error) {
        return sendError(res, error)
    }
}

const createNote = async (req, res) => {
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : ""
    const description = typeof req.body?.description === "string"
        ? req.body.description.trim()
        : ""

    if (!title || !description) {
        return res.status(400).json({
            message: "Title and description are required"
        })
    }

    try {
        const note = await Note.create({
            title,
            description,
            createdBy: req.user._id
        })
        return res.status(201).json(note)
    } catch (error) {
        return sendError(res, error)
    }
}

const getSingleNote = async (req, res) => {
    const { id } = req.params
    if (!isValidNoteId(id)) {
        return res.status(400).json({ message: "Invalid note ID" })
    }

    try {
        const note = await Note.findOne({ _id: id, createdBy: req.user._id })
        if (!note) {
            return res.status(404).json({ message: "Note not found" })
        }

        return res.status(200).json(note)
    } catch (error) {
        return sendError(res, error)
    }
}

const updateNote = async (req, res) => {
    const { id } = req.params
    if (!isValidNoteId(id)) {
        return res.status(400).json({ message: "Invalid note ID" })
    }

    const updates = {}
    for (const field of ["title", "description"]) {
        if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) {
            const value = req.body[field]
            if (typeof value !== "string" || !value.trim()) {
                return res.status(400).json({
                    message: `${field} must be a non-empty string`
                })
            }
            updates[field] = value.trim()
        }
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({
            message: "At least one note field must be provided"
        })
    }

    try {
        const note = await Note.findOneAndUpdate(
            { _id: id, createdBy: req.user._id },
            { $set: updates },
            { returnDocument: "after", runValidators: true }
        )
        if (!note) {
            return res.status(404).json({ message: "Note not found" })
        }

        return res.status(200).json(note)
    } catch (error) {
        return sendError(res, error)
    }
}

const deleteNote = async (req, res) => {
    const { id } = req.params
    if (!isValidNoteId(id)) {
        return res.status(400).json({ message: "Invalid note ID" })
    }

    try {
        const note = await Note.findOneAndDelete({
            _id: id,
            createdBy: req.user._id
        })
        if (!note) {
            return res.status(404).json({ message: "Note not found" })
        }

        return res.status(200).json({ message: "Note deleted successfully" })
    } catch (error) {
        return sendError(res, error)
    }
}

module.exports = {
    createNote,
    getNotes,
    getSingleNote,
    updateNote,
    deleteNote
}
