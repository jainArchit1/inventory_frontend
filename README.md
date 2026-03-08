# Inventory Search - Frontend

A React + Vite frontend for searching and filtering inventory items by name, category, and price.

## 🚀 Live URL

```
https://inventory-frontend-gtp4.onrender.com
```

## 📁 Project Structure



## 🛠️ Tech Stack

- **Framework:** React 18
- **Bundler:** Vite
- **Styling:** Tailwind CSS
- **Hosting:** Render

## ⚙️ Setup & Run Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend will run at `http://localhost:5173`

> ⚠️ Make sure the backend is also running locally at `http://localhost:3001`,
> or update the fetch URL in `App.jsx` to point to the live backend.

## 🔗 Backend API

This frontend fetches data from:

```
https://inventory-backend-gtp4.onrender.com/search
```

## 🚢 Deployment (Render)

- **Build Command:** `npm install`
- **Start Command:** `npm run dev`

## ✨ Features

-  Search by product name (real-time, debounced)
-  Filter by category (Electronics, Furniture, Stationary)
-  Filter by min and max price (in ₹)
-  URL sync — filters are reflected in the browser URL
-  Input validation (negative prices, min > max)
