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
import { startUserCleanupJob } from "./cronjobs/cleanupOldUsers.js";
import { listAllKeys } from "./controller/awsrecognition.controller.js";
import { settingRouter } from "./routes/setting.route.js";
import planSubscritptionRouter from "./routes/plansubscription.route.js";
import { deActivateSubscription } from "./cronjobs/DeactivateSubscription.js";
import { superAdminRouter } from "./routes/superadmin.route.js";
import SSERouter from "./routes/sse.route.js";
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

// const corsOptions = {
//   origin: process.env.ORIGIN,
//   credentials: true,
// };

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [process.env.ORIGIN, "http://localhost:5174"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
app.use("/api/v1",settingRouter)
app.use("/api/v1",planSubscritptionRouter)
app.use("/api/v1",superAdminRouter)
app.use("/api/v1",SSERouter)

dbConnect();

// Root Route (for testing)
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Start Server
app.listen(PORT, () => {
  startUserCleanupJob()
  deActivateSubscription()
  console.log(`🚀 Server is running on port ${PORT}`);
});

listAllKeys()
