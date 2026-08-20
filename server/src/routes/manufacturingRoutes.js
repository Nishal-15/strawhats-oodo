import { Router } from "express";
import {
  createManufacturingOrder,
  confirmManufacturingOrderController,
  createWorkOrdersController,
  completeManufacturingOrderController,

} from "../controllers/manufacturingController.js";

import {
  requireAuth,
  requireRoles,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.post(
  "/",
  requireRoles("ADMIN", "OWNER", "MANUFACTURING"),
  createManufacturingOrder
);

router.post(
  "/:id/work-orders",
  requireRoles("ADMIN", "OWNER", "MANUFACTURING"),
  createWorkOrdersController
);

router.patch(
  "/:id/confirm",
  requireRoles("ADMIN", "OWNER", "MANUFACTURING"),
  confirmManufacturingOrderController
);

router.patch(
  "/:id/complete",
  requireRoles("ADMIN", "OWNER", "MANUFACTURING"),
  completeManufacturingOrderController
);

export default router;