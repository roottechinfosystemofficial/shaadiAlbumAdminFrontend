import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnect } from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import eventRouter from "./routes/event.route.js";
import appUserRouter from "./routes/appUser.route.js";

dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure cookie-parser is placed before routes to parse cookies properly
app.use(cookieParser());

const corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true,
};

// Use CORS with the defined options
app.use(cors(corsOptions));

// Routes
app.use("/api/v1", userRouter);
app.use("/api/v1", appUserRouter);
app.use("/api/v1", eventRouter);

// Connect to DB
dbConnect();

// Root Route (for testing)
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
