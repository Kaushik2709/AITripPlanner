# 🌍 AI Trip Planner

An intelligent, full-stack travel assistant that crafts personalized itineraries using Google's Gemini AI. Plan your next adventure with ease, manage your trips, and customize your traveler profile.

![AI Trip Planner](https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000)

## ✨ Features

- **🤖 AI Itinerary Generation**: Powered by Gemini 1.5 Flash for fast, detailed, and thematic travel plans.
- **🔐 Secure Authentication**: Full user registration and login system with JWT-based security.
- **👤 Modern Profile Management**: Customize your profile with name, email, and profile picture uploads.
- **📂 Trip Persistence**: Your travel plans are saved securely in MongoDB for future access.
- **💬 Interactive Chat Experience**: Seamlessly view and manage your trips in a beautiful, responsive chat interface.
- **🖼️ Image Uploads**: Integrated Multer storage for user avatars.
- **🚀 Production Ready**: Configured for easy deployment on platforms like Render or Vercel.

## 🛠️ Tech Stack

**Frontend:**
- React 18 (Vite)
- TypeScript
- Tailwind CSS (Styling)
- Shadcn UI (Components)
- Zustand (State Management)
- Framer Motion (Animations)
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose (Database)
- JWT (Authentication)
- Multer (File Uploads)
- Gemini AI SDK

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB account (local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-trip-planner.git
   cd ai-trip-planner
   ```

2. **Install Dependencies**
   From the root directory:
   ```bash
   npm run install:all
   ```

3. **Environment Setup**

   Create a `.env` file in the `server/` directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   ```

   (Optional) Create a `.env` file in the `client/` directory if you want to point to a specific backend:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Run the Application**

   To run both client and server in development mode:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:8080` (frontend) and `http://localhost:3000` (backend).

## 📁 Project Structure

```text
ai-trip-planner/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views (Index, Auth)
│   │   ├── services/    # API calling logic
│   │   └── store/       # Zustand state management
├── server/              # Node.js backend
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # Express API routes
│   │   └── middleware/  # Auth & File upload logic
└── package.json         # Root scripts for monorepo
```

## 🌐 Deployment

This project is configured to be deployed as a single unit on **Render**:

1. **Build Command**: `npm run install:all && npm run build`
2. **Start Command**: `npm start`
3. **Root Directory**: (Leave blank)

The backend is configured to serve the frontend's static build files when `NODE_ENV=production`.

## 📜 License

This project is licensed under the ISC License.

---
*Made with ❤️ for fellow travelers.*
