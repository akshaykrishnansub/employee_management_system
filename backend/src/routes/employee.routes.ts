import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/rbac.middleware.js";
import { assignEmployeeManager, createEmployee, deleteEmployeeDetails, getAllEmployees, getEmployeeById, getEmployeeReportees, getEmployeesWithFilterController, getEmployeeTree, updateEmployeeDetails } from "../controllers/employee.controller.js";

const router=Router();

router.post("/",authenticateToken,authorizeRoles("SUPER_ADMIN","HR_MANAGER"),createEmployee);
router.get("/",authenticateToken,authorizeRoles("SUPER_ADMIN","HR_MANAGER"),getAllEmployees);
router.get("/search",authenticateToken,authorizeRoles("SUPER_ADMIN","HR_MANAGER"),getEmployeesWithFilterController);
router.patch("/:id/manager",authenticateToken,authorizeRoles("SUPER_ADMIN"),assignEmployeeManager);
router.get("/:id/reportees",authenticateToken,authorizeRoles("SUPER_ADMIN","HR_MANAGER"),getEmployeeReportees);
router.get("/:id/tree",authenticateToken,authorizeRoles("SUPER_ADMIN","HR_MANAGER"),getEmployeeTree);
router.get("/:id",authenticateToken,authorizeRoles("SUPER_ADMIN","HR_MANAGER"),getEmployeeById);
router.put("/:id",authenticateToken,authorizeRoles("SUPER_ADMIN","HR_MANAGER","EMPLOYEE"),updateEmployeeDetails)
router.delete("/:id",authenticateToken,authorizeRoles("SUPER_ADMIN"),deleteEmployeeDetails);
export default router;