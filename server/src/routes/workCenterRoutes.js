import { Router } from "express";

import {
  createWorkCenter,
  getWorkCenters,
} from "../controllers/workCenterController.js";

import {
  requireAuth,
  requireRoles,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// View work centers
router.get(
  "/",
  requireRoles(
    "ADMIN",
    "BUSINESS_OWNER",
    "MANUFACTURE_USER"
  ),
  getWorkCenters
);

// Create work center
router.post(
  "/",
  requireRoles(
    "ADMIN",
    "MANUFACTURE_USER"
  ),
  createWorkCenter
);

export default router;