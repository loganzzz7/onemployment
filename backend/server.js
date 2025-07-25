import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.js'
import repoRoutes from './routes/repos.js'
import usersRouter from './routes/users.js'

dotenv.config()
await connectDB()

const app = express()

app.use(cors({
  origin: [
    'https://onemployment.vercel.app',
    'http://localhost:5173'
  ]
}))

app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/repos', repoRoutes)
app.use('/api/users', usersRouter)
app.use("/api/pfpuploads", express.static(path.join(process.cwd(), "pfpuploads")));

app.get('/', (req, res) => res.send('server is ready'))

const PORT = process.env.PORT || 3030
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})