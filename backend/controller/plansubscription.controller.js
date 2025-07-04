import { Payment } from "../model/Payment.model.js";
import { PlanSubscription } from "../model/PlanSubscrition.model.js";
import { User } from "../model/User.model.js";
import axios from "axios";
import { pushSSE } from "../utils/sse.js";

const BASE_URL =
  process.env.CASHFREE_ENV === "PROD"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

// ✅ 1. Initiate Payment (Cashfree)

export const initiatePayment = async (req, res) => {
  const { userId, amount, planName } = req.body;

  try {
    const orderId = `sub_${Date.now()}`;

    const orderPayload = {
      order_id: orderId,
      order_amount: parseFloat(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: userId,
        customer_email: "user@example.com", // Replace with real user email
        customer_phone: "7666054838",        // Replace with real user phone
      },
      order_meta: {
        return_url: `http://localhost:5173/subscription-plan`,
        notify_url: `https://yourbackend.com/api/payments/webhook`,
      },
    };

    const response = await axios.post(`${BASE_URL}/orders`, orderPayload, {
      headers: {
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "x-api-version": "2022-09-01",
        "Content-Type": "application/json",
      },
    });

    const paymentSessionId = response?.data?.payment_session_id || response?.data?.data?.payment_session_id;

    if (!paymentSessionId) {
      console.error("Invalid Cashfree response:", response?.data);
      return res.status(500).json({
        message: "Invalid Cashfree response",
        details: response?.data,
      });
    }
    await Payment.create({
      amount,
      userId,
      cashfree_order_id: orderId,
      status: "PENDING",
      cashfree_payment_id: paymentSessionId
    });

    return res.status(200).json({
      paymentSessionId,
      orderId,
    });

  } catch (error) {
    console.error("Payment Init Error:", error?.response?.data || error);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};


// ✅ 2. Verify Payment (by order ID)
export const verifyPayment = async (req, res) => {
  const { orderId } = req.params;

  try {
    const paymentRes = await axios.get(`${BASE_URL}/orders/${orderId}`, {
      headers: {
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "x-api-version": "2022-09-01",
      },
    });

    // Directly use paymentRes.data (not paymentRes.data.data)
    const orderData = paymentRes.data;

    if (!orderData || !orderData.order_status) {
      console.error("Unexpected verifyPayment response:", paymentRes.data);
      return res.status(500).json({ message: "Invalid response from Cashfree", data: paymentRes.data });
    }

    const status = orderData.order_status;
    const cashfree_payment_id = orderData?.payment_session_id || ""; // You may replace this with actual payment ID from webhook
    const paymentMethod =
      orderData?.payment_instrument?.type ||
      orderData?.payment_method ||
      "UNKNOWN";
    // ✅ Update the Payment document
    await Payment.findOneAndUpdate(
      { cashfree_order_id: orderId },
      {
        status: status === "PAID" ? "COMPLETED" : "FAILED",
        cashfree_payment_id,
        paymentMethod
      },
      { new: true }
    );
    return res.status(200).json({ status, orderData });

  } catch (error) {
    console.error("Verify Payment Error:", error?.response?.data || error);
    res.status(500).json({ message: "Failed to verify payment", error: error?.response?.data || error.message });
  }
};


// ===========================================
// 3. CREATE SUBSCRIPTION
// ===========================================
export const createSubscription = async (req, res) => {
  try {
    const {
      userId,
      planName,
      price,
      storageLimitGB,
      faceRecognitionLimit,
      qrDesignLimit,
      eAlbumLimit,
      crmAccess,
      watermarkAccess,
      albumPhotoSelection,
      imageDownloadControl,
      durationInMonths,
    } = req.body;

    const now = new Date();

    const existing = await PlanSubscription.findOne({
      user: userId,
      endDate: { $gt: now },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An active subscription already exists for this user",
      });
    }

    const startDate = new Date();
    const endDate = new Date();

    if (durationInMonths < 1) {
      // Handle fractional months as days
      const days = Math.round(durationInMonths * 30); // 0.25 * 30 = 7.5 ≈ 7
      endDate.setDate(endDate.getDate() + days);
    } else {
      endDate.setMonth(endDate.getMonth() + durationInMonths);
    }

    const newSub = await PlanSubscription.create({
      user: userId,
      planName,
      price,
      storageLimitGB,
      faceRecognitionLimit,
      qrDesignLimit,
      eAlbumLimit,
      crmAccess,
      watermarkAccess,
      albumPhotoSelection,
      imageDownloadControl,
      startDate,
      endDate,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { subscriptions: newSub._id },
      subscriptionEndDate: endDate,
    });

    return res.status(201).json({ success: true, subscription: newSub });
  } catch (error) {
    console.error("Create Subscription Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


// ===========================================
// 4. GET USER SUBSCRIPTIONS
// ===========================================
export const getUserSubscriptions = async (req, res) => {
  try {
    const { userId } = req.params;

    const subscriptions = await PlanSubscription.findOne({
      user: userId,
      isActive: true,
    });

    

    const now = new Date();
    const endDate = subscriptions?.endDate ? new Date(subscriptions.endDate) : null;

    console.log("Subscription end date:", endDate?.toDateString());

    const isExpired = !subscriptions || !endDate || endDate < now;

    const freePlanExpired =
      subscriptions?.planName === 'Free Trial' && endDate && endDate < now;

    const currentSubscription=await PlanSubscription.findOne({user:userId})



    res.status(200).json({
      success: true,
      subscriptions,
      planExpired: isExpired,
      freePlanExpired,
      isActive:currentSubscription.isActive

    });
  } catch (error) {
    console.error("Get Subscription Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getAllSubscriptionList = async (req, res) => {
  try {
    const info = await PlanSubscription.find()
      .populate("user", "name studioName phoneNo address") // select only needed fields
      .lean(); // returns plain JS objects instead of Mongoose documents

    const listOfSubscriptions = info.map((item) => ({
      ...item,
      userName: item.user?.name || "",
      studioName: item.user?.studioName || "",
      phone: item.user?.phoneNo || "",
      address: item.user?.address || "",
    }));

    res.status(200).json({
      listOfSubscriptions

    });
  } catch (error) {
    console.error("Get Subscription Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "userId",
        select: "name email phoneNo", // Only fetch these fields
      })
      .sort({ createdAt: -1 }); // Optional: latest first

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("GetAllPayments Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const updateSubscriptionActiveStatus = async (req, res) => {
  const { id } = req.params; // subscription ID
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    return res.status(400).json({ message: "isActive must be a boolean" });
  }

  try {
    const subscription = await PlanSubscription.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
     pushSSE("subscription_deactivated", {
              userId: subscription.user.toString(),
              message: `Your ${subscription.planName} subscription has deactivated.`,
            });

    res.status(200).json({
      message: `Subscription status updated to ${isActive ? "active" : "inactive"}`,
      subscription,
    });
  } catch (error) {
    console.error("Error updating subscription status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

