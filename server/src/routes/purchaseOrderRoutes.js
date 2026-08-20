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

router.post(
  "/",
  requireRoles("ADMIN", "OWNER", "PURCHASING"),
  createPurchaseOrder
);

router.patch(
  "/:id/confirm",
  requireRoles("ADMIN", "OWNER", "PURCHASING"),
  confirmPurchaseOrderController
);

router.patch(
  "/:id/receive",
  requireRoles("ADMIN", "OWNER", "PURCHASING"),
  receivePurchaseOrderController
);

router.get(
  "/",
  requireRoles("ADMIN", "OWNER", "PURCHASING"),
  getPurchaseOrders
);


export default router;