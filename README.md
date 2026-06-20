# Quickbasket 🛒

A full-stack grocery platform featuring JWT authentication, cart management, checkout with payment options, order history, and analytics dashboard.

---

## 🌟 Features

- **Authentication:** Secure login and signup using JSON Web Tokens (JWT).
- **Product Catalog:** Browse fresh groceries with category filters and search.
- **Cart Management:** Add items to cart, adjust quantities, and persistent local state.
- **Checkout:** Full checkout flow with UPI, Card, and Net Banking payment options.
- **Order History:** Users can view their previous orders.
- **Analytics Dashboard:** Platform-wide stats on sales and popular items.
- **API Documentation:** Interactive Swagger UI for exploring the backend API endpoints.

---

## 🛠 Tech Stack

**Frontend:**
- Vanilla JavaScript (ES Modules)
- Vite (Build Tool & Dev Server)
- Pure CSS (Custom properties, Flexbox, CSS Grid)

**Backend:**
- Node.js & Express.js
- In-Memory Data Store (upgradeable to MongoDB)
- JSON Web Token (JWT) & bcryptjs
- Swagger UI (API Docs)

**Deployment:**
- Vercel (Frontend static + Backend serverless functions)

---

## 🚀 Local Development

### Quick Start (Both Frontend & Backend)

```bash
npm run install:all
npm run dev
```

This starts both servers concurrently:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api-docs

### Individual Setup

#### Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder (see `.env.example`):

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secure-random-string-here
```

Start the backend:

```bash
npm start
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server proxies `/api` requests to `localhost:3001` automatically.

---

## 🌍 Deployment (Vercel)

This project is configured for **Vercel monorepo deployment** — both frontend and backend deploy as a single project.

### Steps

1. **Push your code to GitHub.**

2. **Import the repository in Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Set the **Root Directory** to `.` (root — not `frontend`)
   - Vercel will auto-detect settings from `vercel.json`

3. **Set Environment Variables** in the Vercel dashboard → Settings → Environment Variables:

   | Variable | Value | Required |
   |----------|-------|----------|
   | `JWT_SECRET` | A secure random string (e.g. `openssl rand -hex 32`) | ✅ Yes |
   | `NODE_ENV` | `production` | ✅ Yes |
   | `CORS_ORIGIN` | Your custom domain (if any) | Optional |

4. **Deploy.** Vercel will:
   - Build the frontend with `vite build`
   - Serve static files from `frontend/dist`
   - Route `/api/*` requests to the serverless function at `api/index.js`

### How It Works

- `vercel.json` configures the build, output, and URL rewrites
- `api/index.js` re-exports the Express app as a Vercel serverless function
- The frontend uses relative `/api` paths in production (no CORS issues)
- In local dev, Vite's proxy handles the `/api` → `localhost:3001` routing

### Verify Deployment

After deploying, check:
- **Frontend:** `https://your-app.vercel.app/`
- **API Health:** `https://your-app.vercel.app/api/health`
- **API Docs:** `https://your-app.vercel.app/api-docs`

> **Note:** This app uses an in-memory data store. Data (users, carts, orders) resets on each serverless cold start. To persist data, upgrade to MongoDB by updating `backend/config/db.js` and setting a `MONGO_URI` environment variable.

---

## 📁 Project Structure

```
├── api/
│   └── index.js          # Vercel serverless entry point
├── backend/
│   ├── config/           # Database configuration
│   ├── data/             # Seed data (products.json)
│   ├── middleware/        # Auth & error handling middleware
│   ├── models/           # In-memory data store
│   ├── routes/           # API route handlers
│   ├── server.js         # Express app
│   └── .env.example      # Environment variable template
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page renderers
│   │   ├── styles/       # CSS
│   │   ├── api.js        # API client
│   │   ├── router.js     # Hash-based router
│   │   ├── store.js      # Cart state management
│   │   └── main.js       # App entry point
│   ├── index.html        # HTML entry
│   └── vite.config.js    # Vite configuration
├── vercel.json           # Vercel deployment config
└── package.json          # Root monorepo scripts
```
