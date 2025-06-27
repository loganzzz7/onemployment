import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
    res.send("server is ready")
})

app.listen(3030, () => {
    connectDB();
    console.log("server started at http://localhost:3030")
});
