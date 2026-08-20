import { Router } from "express";
import {
  getDashboardSummary,
} from "../controllers/dashboardController.js";
import {
  requireAuth,
  requireRoles,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/summary",
  requireRoles(
  "ADMIN",
  "BUSINESS_OWNER",
  "SALES_USER",
  "PURCHASE_USER",
  "MANUFACTURE_USER",
  "INVENTORY_MANAGER"
),
  getDashboardSummary
);

export default router;