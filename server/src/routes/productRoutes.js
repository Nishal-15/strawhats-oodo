import { Router } from "express";

import {
  createProduct,
  getProduct,
  listProducts,
} from "../controllers/productController.js";

import {
  requireAuth,
  requireRoles,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// View products
router.get(
  "/",
  requireRoles(
    "ADMIN",
    "BUSINESS_OWNER",
    "INVENTORY_MANAGER"
  ),
  listProducts
);

// View single product
router.get(
  "/:id",
  requireRoles(
    "ADMIN",
    "BUSINESS_OWNER",
    "INVENTORY_MANAGER"
  ),
  getProduct
);

// Create product
router.post(
  "/",
  requireRoles(
    "ADMIN",
    "INVENTORY_MANAGER"
  ),
  createProduct
);

export default router;