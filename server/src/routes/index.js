import { Router } from "express";
import authRoutes from "./authRoutes.js";
import productRoutes from "./productRoutes.js";
import inventoryRoutes from "./inventoryRoutes.js";
import bomRoutes from "./bomRoutes.js";
import workCenterRoutes from "./workCenterRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/boms", bomRoutes);
router.use("/work-centers", workCenterRoutes);

export default router;
