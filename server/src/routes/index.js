import { Router } from "express";
import authRoutes from "./authRoutes.js";
import productRoutes from "./productRoutes.js";
import inventoryRoutes from "./inventoryRoutes.js";
import bomRoutes from "./bomRoutes.js";
import workCenterRoutes from "./workCenterRoutes.js";
import manufacturingRoutes from "./manufacturingRoutes.js";
import workOrderRoutes from "./workOrderRoutes.js";
import customerRoutes from "./customerRoutes.js";
import salesOrderRoutes from "./salesOrderRoutes.js";
import supplierRoutes from "./supplierRoutes.js";
import purchaseOrderRoutes from "./purchaseOrderRoutes.js";
import inventoryAdjustmentRoutes from "./inventoryAdjustmentRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import stockMovementRoutes from "./stockMovementRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/boms", bomRoutes);
router.use("/work-centers", workCenterRoutes);
router.use(
  "/manufacturing-orders",
  manufacturingRoutes
);
router.use("/work-orders", workOrderRoutes);
router.use("/customers", customerRoutes);
router.use("/sales-orders", salesOrderRoutes);
router.use("/suppliers", supplierRoutes);
router.use(
  "/purchase-orders",
  purchaseOrderRoutes
);

router.use(
  "/inventory-adjustments",
  inventoryAdjustmentRoutes
);

router.use(
  "/dashboard",
  dashboardRoutes
);

router.use(
  "/stock-movements",
  stockMovementRoutes
);


export default router;
