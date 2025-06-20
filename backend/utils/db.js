import mongoose from "mongoose";
import { startUserCleanupJob } from "../cronjobs/cleanupOldUsers.js";

// Connect to MongoDB

const dbConnect = async () => {
  try {

    await mongoose.connect(process.env.DATABASE_URL, {});

    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
};

export { dbConnect };
