import { Router } from "express";
import {
  createSalesOrder,
  confirmSalesOrderController,
  deliverSalesOrderController,
} from "../controllers/salesOrderController.js";
import {
  requireAuth,
  requireRoles,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.post(
  "/",
  requireRoles("ADMIN", "OWNER", "SALES"),
  createSalesOrder
);

router.patch(
  "/:id/confirm",
  requireRoles("ADMIN", "OWNER", "SALES"),
  confirmSalesOrderController
);

router.patch(
  "/:id/deliver",
  requireRoles("ADMIN", "OWNER", "SALES"),
  deliverSalesOrderController
);

export default router;