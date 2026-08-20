import { Product } from "../models/Product.js";
import { SalesOrder } from "../models/SalesOrder.js";
import { PurchaseOrder } from "../models/PurchaseOrder.js";
import { ManufacturingOrder } from "../models/ManufacturingOrder.js";
import { StockMovement } from "../models/StockMovement.js";

export async function getDashboardSummary(req, res) {
  const role = req.user.role;

  const isAdmin = role === "ADMIN";
  const isOwner = role === "BUSINESS_OWNER";
  const isSales = role === "SALES_USER";
  const isPurchase = role === "PURCHASE_USER";
  const isManufacturing = role === "MANUFACTURE_USER";
  const isInventory = role === "INVENTORY_MANAGER";

  const showBusinessData = isAdmin || isOwner;
  const showSales = showBusinessData || isSales;
  const showPurchase = showBusinessData || isPurchase;
  const showManufacturing = showBusinessData || isManufacturing;
  const showInventory =
    showBusinessData || isInventory;

  const [
    products,
    salesOrders,
    purchaseOrders,
    manufacturingOrders,
    recentMovements,
  ] = await Promise.all([
    showInventory || showManufacturing
      ? Product.find({ active: true })
      : Promise.resolve([]),

    showSales
      ? SalesOrder.find({
          status: {
            $in: ["DRAFT", "CONFIRMED"],
          },
        })
      : Promise.resolve([]),

    showPurchase
      ? PurchaseOrder.find({
          status: {
            $in: ["DRAFT", "CONFIRMED"],
          },
        })
      : Promise.resolve([]),

    showManufacturing
      ? ManufacturingOrder.find({
          status: {
            $in: [
              "DRAFT",
              "CONFIRMED",
              "IN_PROGRESS",
            ],
          },
        })
      : Promise.resolve([]),

    showInventory || showBusinessData
      ? StockMovement.find()
          .populate("product", "sku name")
          .populate("performedBy", "name email")
          .sort({ createdAt: -1 })
          .limit(10)
      : Promise.resolve([]),
  ]);

  let totalOnHand = 0;
  let totalReserved = 0;
  let inventoryValue = 0;

  const lowStockProducts = [];

  for (const product of products) {
    const onHand = product.stock.onHand;
    const reserved = product.stock.reserved;

    totalOnHand += onHand;
    totalReserved += reserved;

    inventoryValue +=
      onHand * product.costPrice;

    if (onHand - reserved <= 10) {
      lowStockProducts.push({
        id: product._id,
        sku: product.sku,
        name: product.name,
        onHand,
        reserved,
        freeToUse: onHand - reserved,
      });
    }
  }

  const salesOrderValue =
    salesOrders.reduce(
      (sum, order) =>
        sum + order.totalAmount,
      0
    );

  const purchaseOrderValue =
    purchaseOrders.reduce(
      (sum, order) =>
        sum + order.totalAmount,
      0
    );

  res.json({
    success: true,

    role,

    summary: {
      totalProducts:
        showInventory || showManufacturing
          ? products.length
          : 0,

      totalOnHand:
        showInventory || showBusinessData
          ? totalOnHand
          : 0,

      totalReserved:
        showInventory || showBusinessData
          ? totalReserved
          : 0,

      totalFreeToUse:
        showInventory || showBusinessData
          ? totalOnHand - totalReserved
          : 0,

      inventoryValue:
        showInventory || showBusinessData
          ? inventoryValue
          : 0,

      openSalesOrders:
        showSales
          ? salesOrders.length
          : 0,

      openSalesOrderValue:
        showSales
          ? salesOrderValue
          : 0,

      openPurchaseOrders:
        showPurchase
          ? purchaseOrders.length
          : 0,

      openPurchaseOrderValue:
        showPurchase
          ? purchaseOrderValue
          : 0,

      activeManufacturingOrders:
        showManufacturing
          ? manufacturingOrders.length
          : 0,

      lowStockCount:
        showInventory || showBusinessData
          ? lowStockProducts.length
          : 0,
    },

    lowStockProducts:
      showInventory || showBusinessData
        ? lowStockProducts
        : [],

    recentMovements,
  });
}