import { Router } from "express";
import {
  getStockMovements,
} from "../controllers/stockMovementController.js";
import {
  requireAuth,
  requireRoles,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  requireRoles("ADMIN", "BUSINESS_OWNER", "INVENTORY_MANAGER"),
  getStockMovements
);

export default router;