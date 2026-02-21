import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import tripRoutes from './routes/tripRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import dns from 'dns'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// This points to server/src, so we go up one level to get server root
const serverRoot = path.join(__dirname, '..')

dns.setServers(['8.8.8.8'])
connectDB()

// Ensure uploads directory exists
const uploadDir = path.join(serverRoot, 'uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}

const app = express()

// Dynamic CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:8080',
    'http://localhost:5173'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static(uploadDir))

// API Routes
app.use('/api/auth', userRoutes)
app.use('/api/trips', tripRoutes)

// Production Setup
if (process.env.NODE_ENV === 'production') {
    const clientDistPath = path.join(serverRoot, '..', 'client', 'dist')

    // Serve static files from the frontend build folder
    app.use(express.static(clientDistPath))

    // Fallback for SPA routing: serve index.html for any unknown route
    app.get('*', (req, res) => {
        // Only fallback if it's not an API route
        if (!req.path.startsWith('/api/')) {
            res.sendFile(path.resolve(clientDistPath, 'index.html'))
        } else {
            res.status(404).json({ message: 'API route not found' })
        }
    })
} else {
    app.get('/', (req, res) => {
        res.send('AI Trip Planner API is running...')
    })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
})
