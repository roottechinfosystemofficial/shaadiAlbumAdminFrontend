import express from 'express'
import { saveUserSettings,getUserSettings } from '../controller/setting.controller.js';

export const settingRouter=express.Router();

settingRouter.post('/settings/save-settings',saveUserSettings)
settingRouter.get('/settings/get-setting/:userId',getUserSettings)