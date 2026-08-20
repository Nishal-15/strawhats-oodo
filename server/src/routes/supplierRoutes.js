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
  requireRoles("ADMIN", "OWNER", "PURCHASING"),
  createSupplier
);

router.get(
  "/",
  requireRoles("ADMIN", "OWNER", "PURCHASING"),
  getSuppliers
);

export default router;