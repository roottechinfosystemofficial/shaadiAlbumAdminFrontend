import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnect } from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import eventRouter from "./routes/event.route.js";
import appUserRouter from "./routes/appUser.route.js";
import photoS3Router from "./routes/photoS3.route.js";
import flipBookRouter from "./routes/flipBook.route.js";
import clientViewUserrouter from "./routes/clientViewUser.route.js";
// import imageRouter from "./routes/imageRoutes.js";

dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "30mb" })); // Set 10MB limit
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

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
app.use("/api/v1", photoS3Router);
app.use("/api/v1", flipBookRouter);
// app.use("/api/v1", imageRouter);
app.use("/api/v1", clientViewUserrouter);

dbConnect();

// Root Route (for testing)
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
