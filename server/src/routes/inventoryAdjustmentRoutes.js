import { Router } from "express";
import {
  createInventoryAdjustmentController,
} from "../controllers/inventoryAdjustmentController.js";
import {
  requireAuth,
  requireRoles,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.post(
  "/",
  requireRoles("ADMIN", "OWNER", "INVENTORY"),
  createInventoryAdjustmentController
);

export default router;