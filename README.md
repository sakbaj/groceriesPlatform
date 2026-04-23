# Quickbasket 🛒

A full-stack grocery platform featuring a persistent MongoDB backend, JWT authentication, cart management, and user order history. 

**[Live Demo Link (Vercel Frontend) -> Replace with your link here]**  
**[Live API Link (Render Backend) -> Replace with your link here]**

---

## 🌟 Features

- **Authentication:** Secure login and signup using JSON Web Tokens (JWT).
- **Database:** Persistent data storage using MongoDB and Mongoose.
- **Cart Management:** Add items to cart, adjust quantities, and persistent state.
- **Order History:** Users can view their previous orders.
- **Analytics Dashboard:** Platform-wide stats on sales and popular items.
- **API Documentation:** Interactive Swagger UI for exploring the backend API endpoints.

---

## 🛠 Tech Stack

**Frontend:**
- Vanilla JavaScript (ESModules)
- Vite (Build Tool & Dev Server)
- Pure CSS (Custom properties, Flexbox, CSS Grid)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose ORM
- JSON Web Token (JWT) & bcryptjs
- Swagger UI (API Docs)

---

## 🚀 Local Setup

### 1. Backend Setup

Open a terminal and navigate to the `backend` folder:
\`\`\`bash
cd backend
npm install
\`\`\`

Create a \`.env\` file in the `backend` folder:
\`\`\`env
PORT=3001
# Use 'memory' to use an in-memory MongoDB server for testing, or put your MongoDB connection string here.
MONGO_URI=memory
JWT_SECRET=supersecretquickbasketkey2026
\`\`\`

Start the backend server:
\`\`\`bash
npm start
\`\`\`
*The server will start on http://localhost:3001 and automatically seed the database with initial products.*
*API Docs available at: http://localhost:3001/api-docs*

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` folder:
\`\`\`bash
cd frontend
npm install
\`\`\`

Ensure the \`API_BASE\` in \`frontend/src/api.js\` is set to \`http://localhost:3001/api\`.

Start the frontend server:
\`\`\`bash
npm run dev
\`\`\`
*The application will open at http://localhost:5173*

---

## 🌍 Public Deployment Instructions

### Frontend (Vercel)
1. In `frontend/src/api.js`, update `API_BASE` to point to your live backend URL.
2. Push your code to GitHub.
3. Import the `frontend` directory as a new Project in Vercel. 
4. The included `vercel.json` will ensure proper routing.

### Backend (Render / Heroku)
1. Push your code to GitHub.
2. Connect your repository to Render/Heroku and set the Root Directory to `backend`.
3. Add the Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string.
   - `NODE_ENV`: production
4. Start command: `npm start`.

---

## 📸 Screenshots

*(Add screenshots of your application here)*

- **Home Page:** Showcasing the product catalog.
- **Cart:** Cart with quantity management.
- **Orders:** User order history.
- **Analytics:** Basic dashboard statistics.
