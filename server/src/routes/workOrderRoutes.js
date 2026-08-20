import { Router } from "express";

import {
  startWorkOrderController,
  completeWorkOrderController,
} from "../controllers/workOrderController.js";

import {
  requireAuth,
  requireRoles,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// Start work order
router.patch(
  "/:id/start",
  requireRoles(
    "ADMIN",
    "MANUFACTURE_USER"
  ),
  startWorkOrderController
);

// Complete work order
router.patch(
  "/:id/complete",
  requireRoles(
    "ADMIN",
    "MANUFACTURE_USER"
  ),
  completeWorkOrderController
);

export default router;