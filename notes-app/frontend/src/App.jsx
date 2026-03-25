import React, { useEffect, useState } from 'react'
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
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/users/profile")
        console.log("PROFILE SUCCESS", data)
        setUser(data)
      } catch (error) {
        console.log("Not logged in")
        setUser(null)
      } finally{
        setLoading(false)
      }
    }
    fetchUser()
  },[])


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
        <Route path = "/login" element = {user? <Navigate to='/' />: <Login setUser={setUser} /> }/>
        <Route path = "/register" element = {user? <Navigate to='/' />: <Register setUser={setUser}  /> }/>
        <Route path = "/" element = {user? <Home />: <Navigate to= "/login" /> }/>
      </Routes>
    </div>
  )
}

export default App