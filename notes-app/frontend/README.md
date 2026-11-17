# Notes frontend

React and Vite frontend for the Notes application.

## Run locally

1. Start the backend and MongoDB using the instructions in `../backend/README.md`.
2. Copy `.env.example` to `.env` if the API is not at `http://localhost:3000/api`; set `VITE_API_URL` to the API base URL.
3. Install dependencies and start Vite:

   ```sh
   npm install
   npm run dev
   ```

Open `http://localhost:5173`. Authentication uses HTTP-only cookies, so the API must allow the frontend origin and credentialed requests.

## Features

- Register, sign in, restore a session, and log out.
- Create, list, search, update, and delete notes belonging to the signed-in user.
