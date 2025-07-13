import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from './routes/auth.js'
import repoRoutes from './routes/repos.js'

dotenv.config();
await connectDB();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes)
app.use('/api/repos', repoRoutes)

app.get("/", (req, res) => {
    res.send("server is ready")
});

const PORT = process.env.PORT || 3030
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})