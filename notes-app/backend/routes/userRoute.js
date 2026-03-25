const express = require("express")
const protect = require('../middleware/authMiddleWare')
const router = express.Router()

const {
    registerUser,
    loginUser,
    logoutUser,
    userProfile,
    refreshAccessToken
} = require("../controller/userController")

router.post("/register", registerUser)

router.post("/login", loginUser)

router.post("/logout", logoutUser)

router.get("/profile", protect, userProfile)

router.post("/refresh", refreshAccessToken)


module.exports = router