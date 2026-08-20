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
  requireRoles("ADMIN", "OWNER", "SALES"),
  createCustomer
);

router.get(
  "/",
  requireRoles("ADMIN", "OWNER", "SALES"),
  getCustomers
);

export default router;