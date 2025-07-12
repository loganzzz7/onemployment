import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();
await connectDB();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("server is ready")
});

app.listen(3030, () => {
    console.log("server started at http://localhost:3030")
});
