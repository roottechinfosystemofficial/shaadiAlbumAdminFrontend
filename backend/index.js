import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnect } from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1", userRouter);

dbConnect();
app.use(cookieParser());
// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
