import { Router } from "express";
import { createProduct, getProduct, listProducts } from "../controllers/productController.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post(
  "/",
  requireRoles("ADMIN", "OWNER", "INVENTORY"),
  createProduct
);

export default router;
