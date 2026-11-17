import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import axios from '../utils/axiosInstance'

function Navbar({ user, setUser }) {

  const [search, setSearch] = useState("")
  const [logoutError, setLogoutError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const delay = setTimeout(() => {
      const query = search.trim()
      navigate(query ? `/?search=${encodeURIComponent(query)}` : "/")
    },500)
    return () => clearTimeout(delay)
  }, [user, search, navigate])

  useEffect(() => {
    setSearch("")
  }, [user])

  const handleLogout = async() => {
    setLogoutError("")
    try {
      await axios.post("/users/logout")
      setUser(null)
      navigate("/login")
    } catch (error) {
      setLogoutError(error.response?.data?.message || "Unable to log out. Please try again.")
    }
  }
  return (
    <div>
      <nav className="bg-gray-900 p-4 text-white shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" onClick={() => setSearch("")}>Notes App</Link>

          {user && (
          <>
            <div>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                aria-label="Search notes"
                className="w-full px-6 py-3 bg-white text-black border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 font-medium">
                {user.userName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </>
          )}

        </div>
        {logoutError && <p role="alert" className="mt-2 text-sm text-red-300">{logoutError}</p>}
      </nav>
    </div>
  )
}

export default Navbar