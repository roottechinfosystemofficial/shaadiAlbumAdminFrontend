// controllers/subscriptionController.js
import { PlanSubscription } from "../model/PlanSubscrition.model.js";

import { User } from "../model/User.model.js";

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
      durationInMonths, // e.g. 3, 6, 12
    } = req.body;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationInMonths);

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

    // Also update the User model
    await User.findByIdAndUpdate(userId, {
      $push: { subscriptions: newSub._id },
      subscriptionEndDate: endDate,
    });

    res.status(201).json({ success: true, subscription: newSub });
  } catch (error) {
    console.error("Create Subscription Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getUserSubscriptions = async (req, res) => {
  try {
    const { userId } = req.params;

    const subscriptions = await PlanSubscription.find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, subscriptions });
  } catch (error) {
    console.error("Get Subscription Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
