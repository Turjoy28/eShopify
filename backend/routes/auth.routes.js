import express from 'express'
import authController from '../controllers/auth.controller.js'
const router=express.Router();

router.post("/signup",authController.signup)

router.post("/login",authController.login)

router.post("/logout",authController.logout)

router.post("/refresh-token",authController.refreshToken);

router.get("/profile",protectRoute,getProfile);

export default router;