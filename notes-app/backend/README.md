# Notes API

Express and MongoDB API for the Notes application.

## Run locally

1. Start MongoDB.
2. Copy `.env.example` to `.env` and set `MONGO_URI`, `JWT_ACCESS_TOKEN`, and `JWT_REFRESH_TOKEN`.
   Use two different, randomly generated secrets; never commit `.env`.
3. Install dependencies and start the API:

   ```sh
   npm install
   npm run dev
   ```

The API listens on `http://localhost:3000` by default. Configure `FRONTEND_URL` to the frontend origin; multiple comma-separated origins are supported.

## Authentication

Register and login set an HTTP-only access-token cookie (15 minutes) and refresh-token cookie (7 days). Protected API requests use the access token. When it expires, the frontend exchanges the refresh token for a rotated token pair. Refresh tokens are stored as SHA-256 hashes and are single-use; logout revokes the current refresh token.

Both `JWT_ACCESS_TOKEN` and `JWT_REFRESH_TOKEN` are required and must be different. Existing sessions created by the previous token format must sign in again after upgrading.

## API

Auth and note routes below are prefixed with `/api`; the health route is at the root.

| Method | Path | Purpose | Auth |
|---|---|---|---|
| `POST` | `/users/register` | Create an account and start a session | No |
| `POST` | `/users/login` | Start a session | No |
| `POST` | `/users/refresh` | Rotate refresh and access tokens | Refresh cookie |
| `POST` | `/users/logout` | Revoke the current refresh token | Refresh cookie |
| `GET` | `/users/profile` | Get the signed-in user | Access cookie |
| `GET` | `/notes` | List the signed-in user's notes; supports `?search=` | Access cookie |
| `POST` | `/notes` | Create a note (`title`, `description`) | Access cookie |
| `GET` | `/notes/:id` | Get one of the signed-in user's notes | Access cookie |
| `PUT` | `/notes/:id` | Update `title` and/or `description` | Access cookie |
| `DELETE` | `/notes/:id` | Delete one of the signed-in user's notes | Access cookie |
| `GET` | `/health` | Check API and database readiness | No |

Notes are always scoped to the authenticated user. Invalid input returns a 4xx response; unexpected server errors do not expose internal details.
