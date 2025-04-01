import mongoose from "mongoose";
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
