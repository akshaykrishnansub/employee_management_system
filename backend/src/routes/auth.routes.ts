import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { getProfile, login, logout } from "../controllers/auth.controller.js";

const router=Router();

router.post("/login",login);
router.post("/logout",logout);
router.get("/me",authenticateToken,getProfile);

export default router;