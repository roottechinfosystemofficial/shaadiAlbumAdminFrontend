import express from 'express'
import { createSubscription, getUserSubscriptions, initiatePayment, verifyPayment ,getAllSubscriptionList, getAllPayments, updateSubscriptionActiveStatus} from '../controller/plansubscription.controller.js';

const planSubscritptionRouter=express.Router();

planSubscritptionRouter.post("/subscription/create-plan" ,  createSubscription)

planSubscritptionRouter.get("/subscription/get-plan/:userId"  , getUserSubscriptions)

planSubscritptionRouter.post("/subscription/initiate",initiatePayment)

planSubscritptionRouter.get("/subscription/verify/:orderId",verifyPayment)

planSubscritptionRouter.get("/subscription/get-all",getAllSubscriptionList)

planSubscritptionRouter.get("/subscription/payments",getAllPayments)

planSubscritptionRouter.put("/subscription/update-status/:id",updateSubscriptionActiveStatus)

export default planSubscritptionRouter;