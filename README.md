# 🛒 Quickbasket — Grocery Selling Application

A premium, full-stack grocery shopping application built with **Node.js/Express** backend and **Vite + Vanilla JS** frontend.

## Features

- 🏪 **Browse 50+ Grocery Items** across 6 categories (Fruits, Vegetables, Dairy, Bakery, Beverages, Snacks)
- 🔍 **Search & Filter** — real-time search with category filtering
- 🛒 **Shopping Cart** — add, remove, update quantities with live totals
- 📋 **Checkout Flow** — customer details form with order placement
- 🎉 **Order Confirmation** — detailed order summary after successful checkout
- 🌙 **Premium Dark Mode** — glassmorphism UI with smooth animations
- 📱 **Responsive Design** — works on desktop, tablet, and mobile

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express.js |
| Frontend | Vite + Vanilla JS |
| Data | In-memory store with JSON seed data |
| Styling | Vanilla CSS (Dark theme, Glassmorphism) |

## Getting Started

### Prerequisites
- Node.js 18+ installed

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs at **http://localhost:3001**

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

### 3. Open the App

Visit **http://localhost:5173** in your browser.

## Project Structure

```
├── backend/
│   ├── server.js              # Express entry point
│   ├── data/products.json     # 50 grocery items seed data
│   ├── models/                # Product, Cart, Order models
│   ├── routes/                # API route handlers
│   └── middleware/            # Error handling
├── frontend/
│   ├── index.html             # App shell
│   ├── vite.config.js         # Vite + API proxy config
│   └── src/
│       ├── main.js            # App initialization
│       ├── api.js             # Backend API client
│       ├── router.js          # Client-side hash router
│       ├── store.js           # Reactive cart state
│       ├── components/        # Reusable UI components
│       ├── pages/             # Page renderers
│       └── styles/            # CSS design system
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (?category, ?search) |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/categories` | List all categories |
| GET | `/api/cart` | Get current cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:productId` | Update quantity |
| DELETE | `/api/cart/:productId` | Remove item |
| DELETE | `/api/cart` | Clear cart |
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | List all orders |
| GET | `/api/orders/:id` | Get single order |

## Agent Roles

This app was built by 4 AI agents working in coordination:

1. **Agent 1 (Planning)** — System architecture, data models, API contracts, folder structure
2. **Agent 2 (Backend)** — Express.js server, routes, models, seed data
3. **Agent 3 (Frontend)** — Vite app, components, pages, CSS design system
4. **Agent 4 (Integration)** — Proxy config, testing, verification, documentation
