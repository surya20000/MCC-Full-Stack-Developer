import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import scheduleRoutes from "./routes/schedule.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/schedule", scheduleRoutes);

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected successfully!");
    connection.release();
  }
});

const port = process.env.BACKEND_PORT || 8000;
app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});
