import { Router } from "express";

import {
  getWorkOrders,
  startWorkOrderController,
  completeWorkOrderController,
} from "../controllers/workOrderController.js";

import {
  requireAuth,
  requireRoles,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  requireRoles(
    "ADMIN",
    "BUSINESS_OWNER",
    "MANUFACTURE_USER"
  ),
  getWorkOrders
);

router.patch(
  "/:id/start",
  requireRoles(
    "ADMIN",
    "BUSINESS_OWNER",
    "MANUFACTURE_USER"
  ),
  startWorkOrderController
);

router.patch(
  "/:id/complete",
  requireRoles(
    "ADMIN",
    "BUSINESS_OWNER",
    "MANUFACTURE_USER"
  ),
  completeWorkOrderController
);

export default router;