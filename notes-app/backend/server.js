require("dotenv").config()

const app = require("./app")
const connectDB = require("./config/connectDB")
const { getTokenSecrets } = require("./config/tokenConfig")

const startServer = async () => {
    getTokenSecrets()
    await connectDB()

    const port = Number(process.env.PORT) || 3000
    const server = app.listen(port)
    await new Promise((resolve, reject) => {
        server.once("listening", resolve)
        server.once("error", reject)
    })

    console.log(`Server running on http://localhost:${port}`)
    return server
}

if (require.main === module) {
    startServer().catch((error) => {
        console.error("Unable to start the server:", error.message)
        process.exitCode = 1
    })
}

module.exports = { app, startServer }