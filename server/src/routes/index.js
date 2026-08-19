import { Router } from "express";
import authRoutes from "./authRoutes.js";
import productRoutes from "./productRoutes.js";
import inventoryRoutes from "./inventoryRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/inventory", inventoryRoutes);

export default router;
