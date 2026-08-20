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

router.patch(
  "/:id/start",
  requireRoles("ADMIN", "OWNER", "MANUFACTURING"),
  startWorkOrderController
);

router.patch(
  "/:id/complete",
  requireRoles("ADMIN", "OWNER", "MANUFACTURING"),
  completeWorkOrderController
);

export default router;