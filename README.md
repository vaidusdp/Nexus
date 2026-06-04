# Nexus // Tactical Matchmaking Hub

**Nexus** is a production-grade, real-time matchmaking and social discovery hub designed for competitive gamers. It operates as a tactical lobby viewer and entry portal, enabling players to synchronize with active gaming lobbies, join server instances based on skill/level constraints, and manage their gaming profiles.

Designed with a high-fidelity gamer aesthetic, Nexus showcases robust backend transaction integrity, reactive state synchronization, and decoupled API architectures.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React (v19), Zustand (Memory Engine), Tailwind CSS (v4), Axios, Lucide Icons |
| **Backend** | Node.js, Express, Java (Matchmaking Simulation & Services) |
| **Database** | MongoDB (Mongoose ODM) |

---

## 🏗️ Core Engineering Milestones

### 1. Backend Architecture & API Infrastructure

#### 🔒 Relational Multi-Lobby Constraints & Atomic Joins
To prevent race conditions and ensure high transaction integrity, the matchmaking system enforces strict concurrency constraints:
* **Active State Lockout**: A user is restricted to a single active lobby session at a time. The database is queried for any existing lobby where the user is an active member under `WAITING` or `PLAYING` statuses, rejecting duplicate registrations.
* **Atomic Slot Reservation**: Player join requests utilize atomic MongoDB validation filters (`$expr` and `$lt` comparisons on array size vs. `maxPlayers`) rather than unsafe read-then-write operations. This eliminates race conditions during high-concurrency matchmaking spikes.

```javascript
// Relational check ensuring clean member states before joining
const alreadyInALobby = await Lobby.findOne({
  status: { $in: [LOBBY_STATUS.WAITING, LOBBY_STATUS.PLAYING] },
  players: userId
});
if (alreadyInALobby) {
  throw new APIError(400, "You are already in an active lobby.");
}
```

#### 🛡️ Global Error Classes via `asyncHandler`
Rather than polluting controllers with repetitive `try-catch` boilerplate, the API employs a centralized exception handling pattern:
* **Promise Wrapper (`asyncHandler`)**: Intercepts rejected promises in Express router handlers and forwards them automatically using `next(err)`.
* **Standardized Exception Contract (`APIError`)**: Extends the native `Error` class to support custom HTTP status codes, structured error validation arrays, and automatic stack-trace capturing.
* **Global Error Middleware**: Catch-all Express middleware intercepts all exceptions, ensuring errors are formatted into clean, consistent JSON payloads.

---

### 2. Frontend Architecture & Client State

#### 🧠 Zustand Memory Engine
Nexus replaces heavy context providers with a global Zustand memory store.
* **Sub-second Reactivity**: Manages user authentication, session tokens, and active profile status globally.
* **Dynamic Client-Side XP Engine**: Interacts with the backend XP Engine to recalculate levels dynamically, refreshing the client UI instantly without full page reloads.

#### 🧱 Secure `ProtectedRoute` Client Firewall
The frontend routes are protected by a client-side firewall:
* **Route Guarding**: Restricts navigation to the primary `/` dashboard, validating the user's login state on each transition.
* **Graceful Degradation**: Intercepts unauthenticated sessions, rendering loading states while syncing with storage, and redirecting non-verified traffic to `/login`.

#### 🔌 Decoupled `/config/constants` API Pipelines
Rather than hardcoding gameplay settings (e.g., player maximums, region lists, supported game titles) in client source code, the system utilizes a decoupled lookup pipeline:
* **Runtime Config Syncing**: The client queries `/api/v1/config/constants` dynamically on component mount.
* **Future-Proof Extensibility**: Game rules or new title integrations can be updated instantly in the database config, instantly altering client forms and validators without rebuilds or deployments.

---

## 📂 Project Structure

```bash
Nexus/
├── backend/                  # Node.js + Express + Java match simulator
│   ├── src/
│   │   ├── controllers/      # Request handlers (auth, lobby controllers)
│   │   ├── db/               # MongoDB connections
│   │   ├── middlewares/      # Express route protections
│   │   ├── models/           # Mongoose schemas (User, Lobby)
│   │   ├── routes/           # REST endpoints
│   │   └── utils/            # XP Engine, custom APIError classes, asyncHandler
│   ├── app.js                # Express app setup and middleware routing
│   └── index.js              # Server bootstrapper
├── frontend/                 # React + Vite client-side code
│   ├── src/
│   │   ├── api/              # Axios pipeline configuration
│   │   ├── components/       # Common UI elements (Buttons, Inputs, ProtectedRoute)
│   │   ├── layouts/          # Containment layouts (MainLayout)
│   │   ├── pages/            # Page canvases (Dashboard, Login, Register)
│   │   ├── store/            # Zustand global state (authStore)
│   │   └── index.css         # Styling system & Tailwind directives
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB (Local instance or MongoDB Atlas Connection String)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Establish environment configurations. Create a `.env` file:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_jwt_signing_key
   ACCESS_TOKEN_EXPIRY=1d
   CORS_ORIGIN=http://localhost:5173
   ```
4. Start the Node.js server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will boot on `http://localhost:5173`.*

---

## 🔗 API Documentation (Core Endpoints)

*All base paths are prefixed with `/api/v1`.*

| Endpoint | Method | Protection | Description |
|---|---|---|---|
| `/users/register` | `POST` | Public | Registers a new account profile. |
| `/users/login` | `POST` | Public | Authenticates credentials and logs the user in. |
| `/users/logout` | `POST` | Protected | Invalidates auth token. |
| `/lobby/` | `GET` | Public | Retrieves all active lobbies in `WAITING` state. |
| `/lobby/create` | `POST` | Protected | Creates a new lobby instance. |
| `/lobby/join/:lobbyId` | `POST` | Protected | Enforces slot/level constraints and adds player to lobby. |
| `/lobby/leave/:lobbyId` | `POST` | Protected | Removes player or cancels lobby if user is host. |
| `/config/constants` | `GET` | Public | Fetches supported games and regional metadata. |
