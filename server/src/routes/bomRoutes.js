import { Router } from "express";

import {
  createBoM,
  getBoMs,
  assignWorkCenters,
} from "../controllers/bomController.js";

import { requireAuth, requireRoles } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// View BoMs
router.get(
  "/",
  requireRoles(
    "ADMIN",
    "BUSINESS_OWNER",
    "MANUFACTURE_USER"
  ),
  getBoMs
);

// Assign work centers
router.patch(
  "/operations/work-centers",
  requireRoles(
    "ADMIN",
    "MANUFACTURE_USER"
  ),
  assignWorkCenters
);

// Create BoM
router.post(
  "/",
  requireRoles(
    "ADMIN",
    "MANUFACTURE_USER"
  ),
  createBoM
);

export default router;