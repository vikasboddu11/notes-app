# MERN Notes App - Backend

This is the backend for the MERN Notes Application.
It provides APIs for user authentication and notes management.

Tech Stack
Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
Cookie Parser
CORS

Features
User Registration and Login
JWT Authentication (Access and Refresh Tokens)
Protected Routes
CRUD Operations for Notes
User-specific Notes
Error Handling

Folder Structure
config/
controllers/
models/
routes/
middleware/
app.js

Environment Variables (.env)
MONGO_URI=your_mongodb_uri
JWT_ACCESS_TOKEN=your_access_token_secret
JWT_REFRESH_TOKEN=your_refresh_token_secret
FRONTEND_URL=http://localhost:5173

Run Locally
npm install
npm run dev

Server
http://localhost:3000

API Endpoints

Auth Routes
POST /api/users/register
POST /api/users/login

Notes Routes
GET /api/notes
POST /api/notes
PUT /api/notes/:id
DELETE /api/notes/:id

Deployment
Backend: Render
Database: MongoDB Atlas

Author
Vikas