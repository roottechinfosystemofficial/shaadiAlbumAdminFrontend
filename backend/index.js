import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnect } from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import eventRouter from "./routes/event.route.js";

dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.77:5173",
  "https://shaadialbumadminfrontend.onrender.com", // add more if needed
];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure cookie-parser is placed before routes to parse cookies properly
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/v1", userRouter);
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
