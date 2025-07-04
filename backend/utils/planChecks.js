// utils/subscriptionUtils.js
import { PlanSubscription } from "../model/PlanSubscrition.model.js";
export const getActiveSubscription = async (userId) => {
  return await PlanSubscription.findOne({
    user: userId,
    isActive: true,
    endDate: { $gte: new Date() },
  });
};

export const checkStorageLimit = (subscription, fileSizeBytes) => {
  const used = subscription.usedStorageInBytes || 0;
  const allowed = (subscription.storageLimitGB || 0) * 1024 * 1024 * 1024; // GB to Bytes
  return used + fileSizeBytes <= allowed;
};

export const checkFaceRecognitionLimit = (subscription) => {
  if (!subscription.faceRecognitionLimit || subscription.faceRecognitionLimit === "Unlimited") return true;
  return subscription.faceRecognitionsUsed < subscription.faceRecognitionLimit;
};

export const updateStorageUsed = async (subscription, bytesToAdd) => {
  console.log("passing storage",subscription)
  subscription.usedStorageInBytes += bytesToAdd;
  await subscription.save();
};

export const incrementFaceRecognitionUsage = async (subscription) => {
  subscription.faceRecognitionsUsed += 1;
  await subscription.save();
};
