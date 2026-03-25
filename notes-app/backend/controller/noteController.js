const Note = require('../model/NoteModel')

const getNotes = async(req, res) => {
    try {
        const notes = await Note.find({ createdBy: req.user.id })
        res.status(200).json(notes)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server error"
        })
    }
}

const createNote = async(req, res) => {
    const { title, description } = req.body
    try {
        if (!title || !description) {
            return res.status(400).json({
                message: "Please fill all the fields"
            })
        }
        const note = await Note.create({
            title,
            description,
            createdBy: req.user.id
        })
        res.status(201).json(note)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server error"
        })
    }
}

const getSingleNote = async(req, res) => {
    const id = req.params._id

    try {
        if (!id) {
            return res.status(400).json({ message: "Note ID is required" })
        }
        const note = await Note.findById(id)
        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            })
        }
        if (note.createdBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: "Not authorized to view this note"
            })
        }
        res.status(200).json(note)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Seerver error"
        })
    }
}

const updateNote = async(req, res) => {
    const { title, description } = req.body
    const id = req.params._id

    try {
        if (!id) {
            return res.status(400).json({ message: "Note ID is required" })
        }
        const note = await Note.findById(id)
        if (!note) {
            return res.status(404).json({
                message: "note not found"
            })
        }
        if (note.createdBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to edit this note"
            })
        }

        note.title = title || note.title
        note.description = description || note.description

        const updatedNote = await note.save()
        res.status(200).json(updatedNote)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server error"
        })
    }
}

const deleteNote = async(req, res) => {
    const id = req.params._id

    try {
        if (!id) {
            return res.status(400).json({ message: "Note ID is required" })
        }
        const note = await Note.findById(id)
        if (!note) {
            return res.status(400).json({
                message: "note not found"
            })
        }
        if (note.createdBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this note"
            })
        }
        await note.deleteOne()
        res.status(200).json({
            message: "Note deleted successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server error"
        })
    }
}

module.exports = { createNote, getNotes, getSingleNote, updateNote, deleteNote }