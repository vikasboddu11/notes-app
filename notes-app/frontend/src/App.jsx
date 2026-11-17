import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import axios from './utils/axiosInstance'

function App() {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const handleExpiredSession = () => setUser(null)
    window.addEventListener('auth:expired', handleExpiredSession)

    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/users/profile")
        if (active) setUser(data)
      } catch {
        if (active) setUser(null)
      } finally{
        if (active) setLoading(false)
      }
    }
    fetchUser()

    return () => {
      active = false
      window.removeEventListener('auth:expired', handleExpiredSession)
    }
  }, [])


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className='min-h-screen bg-gray-500'>
      <Navbar user = {user} setUser = {setUser} />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register setUser={setUser} />} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App