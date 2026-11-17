const express = require("express")
const router = express.Router()
const protect = require("../middleware/authMiddleWare")
const { createNote, getNotes, getSingleNote, updateNote, deleteNote } = require('../controller/noteController')

router.post("/", protect, createNote)
router.get("/", protect, getNotes)
router.get("/:id", protect, getSingleNote)
router.put("/:id", protect, updateNote)
router.delete("/:id", protect, deleteNote)

module.exports = router