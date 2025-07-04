import express from 'express'
import { getDashboardStats } from '../controller/superadmin.controller.js'

export const superAdminRouter=express.Router()

superAdminRouter.get('/super-admin/dashboard',getDashboardStats)