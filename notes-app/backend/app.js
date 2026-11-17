const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const mongoose = require("mongoose")
const userRoutes = require("./routes/userRoute")
const noteRoutes = require("./routes/noteRoute")

const app = express()
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean)

app.disable("x-powered-by")
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(null, false)
    },
    credentials: true
}))

app.use((req, res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
        return next()
    }

    const requestOrigin = req.get("origin")
    if (requestOrigin) {
        return allowedOrigins.includes(requestOrigin)
            ? next()
            : res.status(403).json({ message: "Origin is not allowed" })
    }

    const referer = req.get("referer")
    if (
        referer &&
        !allowedOrigins.some((origin) => referer === origin || referer.startsWith(`${origin}/`))
    ) {
        return res.status(403).json({ message: "Origin is not allowed" })
    }

    return next()
})
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.status(200).json({ message: "Notes API is running" })
})

app.get("/health", (req, res) => {
    const isConnected = mongoose.connection.readyState === 1
    res.status(isConnected ? 200 : 503).json({
        status: isConnected ? "ok" : "unavailable",
        database: isConnected ? "connected" : "disconnected"
    })
})

app.use("/api/users", userRoutes)
app.use("/api/notes", noteRoutes)

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" })
})

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error)
    }

    const statusCode = error.statusCode || error.status || 500
    if (statusCode >= 500) {
        console.error("Request failed", error)
    }

    return res.status(statusCode).json({
        message: statusCode >= 500 ? "Server error" : error.message
    })
})

module.exports = app
