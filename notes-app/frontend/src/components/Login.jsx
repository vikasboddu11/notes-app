import { useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import axios from '../utils/axiosInstance'

function Login({setUser}) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      const { data: loginData } = await axios.post("/users/login", {
        email,
        password
      })
      const user = loginData.user || (await axios.get("/users/profile")).data
      setUser(user)
      navigate("/")
    } catch (error) {
      setError(error.response?.data?.message || "Unable to sign in. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <button disabled={isSubmitting} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-60">
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <Link className="text-blue-600 hover:underline" to="/register">
          Register
        </Link>
      </p>
    </div>
  )
}

export default Login