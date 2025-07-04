import cron from "node-cron";
import { PlanSubscription } from "../model/PlanSubscrition.model.js";
import { User } from "../model/User.model.js";
import { pushSSE } from "../utils/sse.js"; // ⬅ import SSE pusher

export const deActivateSubscription = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const expiredSubs = await PlanSubscription.find({
        endDate: { $lt: now },
        isActive: true,
      });

      for (const sub of expiredSubs) {
        console.log(`⏳ Expired plan found for user: ${sub.user}, Plan: ${sub.planName}`);

        // Step 1: Update user
        await User.findByIdAndUpdate(sub.user, {
          $pull: { subscriptions: sub._id },
          $unset: { subscriptionEndDate: "" },
          ...(sub.planName === "Free Trial" && { trialFinished: true }),
        });

        // Step 2: Mark subscription as inactive
        await PlanSubscription.findByIdAndUpdate(sub._id, {
          isActive: false,
        });

        // 🔔 Step 3: Push real-time notification to the user
        pushSSE("plan_expired", {
          userId: sub.user.toString(),
          message: `Your ${sub.planName} subscription has expired.`,
        });

        console.log(`✅ Marked subscription ${sub._id} as inactive & notified user`);
      }

      console.log(`🔁 Subscription cleanup complete. Total deactivated: ${expiredSubs.length}`);
    } catch (err) {
      console.error("❌ Cron job failed:", err);
    }
  });
};
