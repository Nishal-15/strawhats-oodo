import { Router } from "express";

import {
  createPurchaseOrder,
  confirmPurchaseOrderController,
  receivePurchaseOrderController,
  getPurchaseOrders,
} from "../controllers/purchaseOrderController.js";

import {
  requireAuth,
  requireRoles,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// Create purchase order
router.post(
  "/",
  requireRoles("ADMIN", "PURCHASE_USER"),
  createPurchaseOrder
);

// Confirm purchase order
router.patch(
  "/:id/confirm",
  requireRoles("ADMIN", "PURCHASE_USER"),
  confirmPurchaseOrderController
);

// Receive purchase order
router.patch(
  "/:id/receive",
  requireRoles("ADMIN", "PURCHASE_USER"),
  receivePurchaseOrderController
);

// View purchase orders
router.get(
  "/",
  requireRoles(
    "ADMIN",
    "BUSINESS_OWNER",
    "PURCHASE_USER"
  ),
  getPurchaseOrders
);

export default router;