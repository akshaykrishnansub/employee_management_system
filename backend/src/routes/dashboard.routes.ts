import {Router} from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/rbac.middleware.js';
import { dashboardStats } from '../controllers/dashboard.controller.js';

const router=Router();

router.get("/",authenticateToken,authorizeRoles("SUPER_ADMIN","HR_MANAGER"),dashboardStats);

export default router;