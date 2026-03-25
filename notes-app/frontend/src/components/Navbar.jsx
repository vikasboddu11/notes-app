import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import axios from '../utils/axiosInstance'

function Navbar({ user, setUser }) {

  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if(!user) return
    const delay = setTimeout(() => {
      navigate(search.trim() ? `/?search=${encodeURIComponent(search)}`: '/' )
    },500)
    return() => clearTimeout(delay)
  },[user, search, setUser])

  useEffect(() => {
    setSearch("")
  },[user])

  const handleLogout = async() => {
    try {
      await axios.post("/users/logout")
      setUser(null)
      navigate("/login")
    } catch (error) {
      console.log("logout error:", error)
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
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search notes...' className='w-full px-6 py-3 bg-white text-black border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500' />
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
      </nav>
    </div>
  )
}

export default Navbar