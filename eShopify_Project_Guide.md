# eShopify - Beginner's Developer Guide

Welcome to **eShopify**! This guide is designed to help you, as a beginner, understand how this full-stack application works. We will cover the project structure, how the frontend and backend communicate, and how data flows through the application.

## 1. Tech Stack Overview

This project uses the popular **MERN** stack (with a modern twist!):
- **MongoDB**: The database that stores all your data (users, products, orders).
- **Express.js & Node.js**: The backend server that handles requests, processes business logic, and talks to the database.
- **React (via Vite)**: The frontend framework used to build the user interface.
- **Zustand**: A lightweight library used for state management in React (keeping track of the user's cart, login status, etc.).
- **Tailwind CSS**: A utility-first CSS framework used for styling the frontend beautifully.

---

## 2. Project Folder Structure

The project is divided into two main folders: `backend` and `frontend`.

### `backend/`
This folder contains the server-side code.
- **`server.js`**: The main entry point. It sets up the server, connects to the database, and registers all the routes.
- **`routes/`**: Contains the URL paths (endpoints) for the API. For example, `auth.routes.js` handles `/api/auth/login` and `/api/auth/signup`.
- **`controllers/`**: Contains the actual logic for the routes. When a user hits a route, the corresponding controller function runs. (e.g., checking if a user exists in the database).
- **`models/`**: Defines the structure of your data in MongoDB using Mongoose. (e.g., `User`, `Product`, `Order`).
- **`middleware/`**: Contains functions that run *before* the controller. For example, checking if a user is logged in before letting them view their cart.
- **`lib/`**: Contains helper configurations, like the database connection script (`db.js`).

### `frontend/`
This folder contains the client-side UI code.
- **`src/main.jsx`**: The starting point of the React application.
- **`src/App.jsx`**: The main component that sets up the layout (like the Navbar) and the routing (using React Router) to different pages.
- **`src/pages/`**: Contains the full-page components (e.g., `HomePage.jsx`, `LoginPage.jsx`, `CartPage.jsx`).
- **`src/components/`**: Reusable UI pieces (e.g., `Navbar/`, `ProductCard.jsx`, `CartItem.jsx`).
- **`src/stores/`**: Contains **Zustand** stores. This is where global state and API calls live (e.g., `useUserStore.js` manages the logged-in user, `useCartStore.js` manages the shopping cart).
- **`src/lib/`**: Contains utility files, specifically `axios.js`, which is configured to communicate with the backend.

---

## 3. How Frontend and Backend Communicate

Communication between the frontend and backend happens via HTTP requests. Here is the exact flow of how a user logs in:

### Step 1: The User Clicks "Login" (Frontend Component)
The user types their email and password on the `LoginPage.jsx` and clicks submit. The page calls the `login(email, password)` function from the Zustand store (`useUserStore.js`).

### Step 2: Zustand Makes the API Call (Frontend Store)
Inside `src/stores/useUserStore.js`, we use `axios` (configured in `src/lib/axios.js`) to send an HTTP POST request to the backend:
```javascript
// Inside useUserStore.js
const res = await axios.post("/auth/login", { email, password });
```
*Note: Because of our Axios configuration, `/auth/login` is automatically prefixed with the backend's URL (e.g., `http://localhost:5000/api`).*

### Step 3: Backend Receives the Request (Backend Route & Controller)
The request arrives at the backend's `server.js`, which routes it to `routes/auth.routes.js`, which then passes it to the `login` function in `controllers/auth.controller.js`.

The controller:
1. Checks the `User` model in MongoDB to see if the email exists.
2. Verifies that the password is correct.
3. If successful, it generates a secure authentication token (cookie) and sends a success response back with the user's data.

### Step 4: Frontend Updates the UI (Frontend Store)
The `axios.post` call in `useUserStore.js` finishes successfully. The store updates its `user` state with the data it received from the backend:
```javascript
set({ user: res.data.user, loading: false });
```
Because React is reactive, the UI instantly updates. The `App.jsx` sees that `user` is no longer null, and redirects the user from the Login page to the Home page!

---

## 4. Deep Knowledge: Key Architectural Decisions

- **Why Zustand?** Instead of using complex tools like Redux, Zustand provides a very simple hook-based approach. By keeping API calls inside the Zustand store (`useUserStore.js`), our UI components remain clean and focused solely on displaying data.
- **Cookies & Authentication:** Instead of storing authentication tokens in `localStorage` (which is vulnerable to XSS attacks), the backend sends an `httpOnly` cookie. Axios in the frontend (`src/lib/axios.js`) is configured with `withCredentials: true`, meaning it automatically attaches this secure cookie to every subsequent request to prove the user is logged in.
- **CORS Configuration:** In `backend/server.js`, you will see `app.use(cors({ origin: "http://localhost:5173", credentials: true }))`. This tells the backend server to safely allow requests specifically from your Vite frontend during development.

---

## 5. Summary Check-list for Building a New Feature

If you want to add a new feature (e.g., a "Wishlist"):
1. **Backend Model**: Create `Wishlist.model.js` in the `models/` folder.
2. **Backend Controller**: Create `wishlist.controller.js` to handle adding/removing items.
3. **Backend Route**: Create `wishlist.routes.js` and link it to your controller.
4. **Register Route**: Add `app.use('/api/wishlist', wishlistRoutes)` inside `server.js`.
5. **Frontend Store**: Create `useWishlistStore.js` in `src/stores/` to handle the Axios API calls.
6. **Frontend Component**: Build the `WishlistPage.jsx` and use your new store to display the data!

Happy coding!
