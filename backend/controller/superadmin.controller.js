import { User } from "../model/User.model.js";
import { PlanSubscription } from "../model/PlanSubscrition.model.js";
import {Payment} from '../model/Payment.model.js'
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);

    // Total Payments
    const totalPaymentsAgg = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalPayments = totalPaymentsAgg[0]?.total || 0;

    // Today's Payments
    const todayPaymentsAgg = await Payment.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const todayPayments = todayPaymentsAgg[0]?.total || 0;

    // Last Month's Payments
    const lastMonthPaymentsAgg = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const lastMonthPayments = lastMonthPaymentsAgg[0]?.total || 0;

    // Total Users
    const totalUsers = await User.countDocuments();

    // Active Users (with at least one active subscription)
    const activeSubscriptions = await PlanSubscription.distinct("user", {
      isActive: true,
    });
    
    const activeUsers = activeSubscriptions.length;

    res.status(200).json({
      success: true,
      data: {
        totalPayments,
        todayPayments,
        lastMonthPayments,
        totalUsers,
        activeUsers,
      },
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
  }
};
