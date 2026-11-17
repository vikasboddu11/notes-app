import { useEffect, useState } from 'react'
import axios from '../utils/axiosInstance'
import NoteModel from './NoteModel'
import { useLocation } from 'react-router-dom'

function Home() {

  const [notes,setNotes] = useState([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(null)
  const location = useLocation()

  const handleDelete = async (id) => {
    setError("")
    try {
      await axios.delete(`/notes/${id}`)
      setNotes((currentNotes) => currentNotes.filter((note) => note._id !== id))
    } catch (error) {
      setError(error.response?.data?.message || "Unable to delete this note.")
    }
  }

  const handleEdit = (note) => {
    setIsEdit(note)
    setIsModelOpen(true)
  }

  const handleSaveNote = (newNote) => {
    setNotes((currentNotes) => isEdit
      ? currentNotes.map((note) => note._id === newNote._id ? newNote : note)
      : [...currentNotes, newNote])
    setIsEdit(null)
    setIsModelOpen(false)
  }

  useEffect(() => {
    const controller = new AbortController()
    const search = new URLSearchParams(location.search).get("search") || ""

    const fetchNotes = async () => {
      setIsLoading(true)
      setError("")
      try {
        const { data } = await axios.get("/notes", {
          params: { search },
          signal: controller.signal
        })
        setNotes(data)
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error.response?.data?.message || "Unable to load your notes.")
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchNotes()
    return () => controller.abort()
  }, [location.search])

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-500">
      {error && <p role="alert" className="text-red-400 mb-4">{error}</p>}
      <button
        onClick={() => setIsModelOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-800 text-white text-3xl rounded-full shadow-lg hover:bg-gray-900 flex items-center justify-center"
      >
        <span className="flex items-center justify-center h-full w-full pb-1">
          +
        </span>
      </button>

      <NoteModel
      note = {isEdit}
      isOpen = {isModelOpen}
      onClose = {() => {
        setIsModelOpen(false)
        setIsEdit(null)
      } }
      onSave = {handleSaveNote}
       />

      {isLoading && <p role="status" className="text-white">Loading notes...</p>}
      {!isLoading && !error && notes.length === 0 && (
        <p className="text-white">No notes found. Create your first note.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div className="bg-gray-800 p-4 rounded-lg shadow-md" key={note._id}>
            <h3 className="text-lg font-medium text-white mb-2">
              {note.title}
            </h3>
            <p className="text-gray-300 mb-4">{note.description}</p>
            <p className="text-sm text-gray-400 mb-4">
              {new Date(note.updatedAt).toLocaleString()}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(note)}
                className="bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home