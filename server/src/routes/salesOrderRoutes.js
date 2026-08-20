import { Router } from "express";

import {
  createSalesOrder,
  confirmSalesOrderController,
  deliverSalesOrderController,
  getSalesOrders,
} from "../controllers/salesOrderController.js";

import {
  requireAuth,
  requireRoles,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// Create sales order
router.post(
  "/",
  requireRoles("ADMIN", "SALES_USER"),
  createSalesOrder
);

// Confirm sales order
router.patch(
  "/:id/confirm",
  requireRoles("ADMIN", "SALES_USER"),
  confirmSalesOrderController
);

// Deliver sales order
router.patch(
  "/:id/deliver",
  requireRoles("ADMIN", "SALES_USER"),
  deliverSalesOrderController
);

// View sales orders
router.get(
  "/",
  requireRoles(
    "ADMIN",
    "BUSINESS_OWNER",
    "SALES_USER"
  ),
  getSalesOrders
);

export default router;