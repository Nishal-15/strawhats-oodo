import { Router } from "express";

import {
  createManufacturingOrder,
  confirmManufacturingOrderController,
  createWorkOrdersController,
  completeManufacturingOrderController,
  getManufacturingOrders,
} from "../controllers/manufacturingController.js";

import {
  requireAuth,
  requireRoles,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// Create manufacturing order
router.post(
  "/",
  requireRoles("ADMIN", "MANUFACTURE_USER"),
  createManufacturingOrder
);

// Create work orders
router.post(
  "/:id/work-orders",
  requireRoles("ADMIN", "MANUFACTURE_USER"),
  createWorkOrdersController
);

// Confirm manufacturing order
router.patch(
  "/:id/confirm",
  requireRoles("ADMIN", "MANUFACTURE_USER"),
  confirmManufacturingOrderController
);

// Complete manufacturing order
router.patch(
  "/:id/complete",
  requireRoles("ADMIN", "MANUFACTURE_USER"),
  completeManufacturingOrderController
);

// View manufacturing orders
router.get(
  "/",
  requireRoles(
    "ADMIN",
    "BUSINESS_OWNER",
    "MANUFACTURE_USER"
  ),
  getManufacturingOrders
);

export default router;