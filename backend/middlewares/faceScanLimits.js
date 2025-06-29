import { PlanSubscription } from "../model/PlanSubscrition.model";

export const checkUserLimits = async (userId) => {
  const sub = await PlanSubscription.findOne({ user: userId, isActive: true });

  return {
    allowedStorageGB: sub?.storageLimitGB || 0,
    allowedFaceScans: sub?.faceRecognitionLimit || 0,
  };
};
