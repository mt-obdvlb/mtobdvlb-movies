import express from 'express'
import cookieParse from 'cookie-parser'
import dotenv from 'dotenv'

import connectDB from './config/db.ts'
import userRoutes from './routes/userRoutes.ts'
import genreRoutes from './routes/genreRoutes.ts'
import movieRoutes from './routes/movieRoutes.ts'
import uploadRoutes from './routes/uploadRoutes.ts'
import * as path from 'node:path'

dotenv.config()
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParse())

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/genre', genreRoutes)
app.use('/api/v1/movies', movieRoutes)
app.use('/api/v1/upload', uploadRoutes)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
