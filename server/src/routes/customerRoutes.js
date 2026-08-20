import { Router } from "express";
import {
  createCustomer,
  getCustomers,
} from "../controllers/customerController.js";
import {
  requireAuth,
  requireRoles,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.post(
  "/",
  requireRoles("ADMIN", "BUSINESS_OWNER", "SALES_USER"),
  createCustomer
);

router.get(
  "/",
  requireRoles("ADMIN", "BUSINESS_OWNER", "SALES_USER"),
  getCustomers
);

export default router;