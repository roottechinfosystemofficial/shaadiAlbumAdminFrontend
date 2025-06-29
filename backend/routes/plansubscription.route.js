import express from 'express'
import { createSubscription, getUserSubscriptions } from '../controller/plansubscription.controller.js';

const planSubscritptionRouter=express.Router();

planSubscritptionRouter.post("/subscription/create-plan" ,  createSubscription)

planSubscritptionRouter.get("/subscription/get-plans/:userId"  , getUserSubscriptions)

export default planSubscritptionRouter;