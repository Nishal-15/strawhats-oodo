import { Router } from "express";
import {
  createSupplier,
  getSuppliers,
} from "../controllers/supplierController.js";
import {
  requireAuth,
  requireRoles,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.post(
  "/",
  requireRoles("ADMIN", "BUSINESS_OWNER", "PURCHASE_USER"),
  createSupplier
);

router.get(
  "/",
  requireRoles("ADMIN", "BUSINESS_OWNER", "PURCHASE_USER"),
  getSuppliers
);

export default router;