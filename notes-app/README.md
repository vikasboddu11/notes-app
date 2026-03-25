# Notes App (MERN)

A full stack notes application built using the MERN stack with authentication and user-based data access.

## Features
- User registration and login
- JWT authentication with refresh tokens
- Create, read, update and delete notes
- Protected routes
- User-specific data handling

## Tech Stack
Frontend: React (Vite), Axios, Tailwind CSS  
Backend: Node.js, Express  
Database: MongoDB

## Run Locally

### Backend
npm install  
npm start  

### Frontend
npm install  
npm run dev  

## Environment Variables

Create a .env file in backend:

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_ACCESS_TOKEN=your_secret  
JWT_REFRESH_TOKEN=your_secret  

## Deployment
Backend: Render  
Frontend: Vercel  
Database: MongoDB Atlas

## Author
Vikas