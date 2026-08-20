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
  requireRoles("ADMIN", "BUSINESS_OWNER"),
  getDashboardSummary
);

export default router;