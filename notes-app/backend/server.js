const express = require("express")
const dotenv = require("dotenv")
const connectDB = require('./config/connectDB')
const cookieParser = require("cookie-parser")
const cors = require("cors")

const userRoutes = require("./routes/userRoute")
const noteRoutes = require("./routes/noteRoute")

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

connectDB()

app.use("/api/users", userRoutes)
app.get("/", (req, res) => {
    res.send("Server is running successfully on users 🚀")
})
app.use("/api/notes", noteRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})