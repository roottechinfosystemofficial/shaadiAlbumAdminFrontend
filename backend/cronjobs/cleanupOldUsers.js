import cron from "node-cron";
import { User } from "../model/User.model.js";

export const startUserCleanupJob = () => {
  cron.schedule("* * * * *", async () => {
    const cutoffDate = new Date(Date.now() - 2 * 60 * 1000); // Now - 2 minutes

    try {
      // Optional: Log how many will be updated
      const usersToUpdate = await User.find({
        createdAt: { $lte: cutoffDate },
        trialFinished: false,
      });

      console.log("🕒 Users to mark as trialFinished:", usersToUpdate.length);

      // Update all matching users
      const result = await User.updateMany(
        {
          createdAt: { $lte: cutoffDate },
          trialFinished: false,
        },
        {
          $set: { trialFinished: true },
        }
      );

      console.log(`✅ Updated ${result.modifiedCount || result.nModified || 0} users to trialFinished: true`);
    } catch (error) {
      console.error("❌ Error updating trial status:", error.message);
    }
  });
};
