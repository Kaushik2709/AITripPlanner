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

dns.setServers(['8.8.8.8'])
connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.get('/', (req, res) => {
    res.send('AI Trip Planner API is running...')
})

app.use('/api/users', userRoutes)
app.use('/api/trips', tripRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`)
})
