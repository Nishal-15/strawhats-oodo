import { Product } from "../models/Product.js";
import { SalesOrder } from "../models/SalesOrder.js";
import { PurchaseOrder } from "../models/PurchaseOrder.js";
import { ManufacturingOrder } from "../models/ManufacturingOrder.js";
import { StockMovement } from "../models/StockMovement.js";

export async function getDashboardSummary(req, res) {
  const [
    products,
    salesOrders,
    purchaseOrders,
    manufacturingOrders,
    recentMovements,
  ] = await Promise.all([
    Product.find({ active: true }),

    SalesOrder.find({
      status: {
        $in: ["DRAFT", "CONFIRMED"],
      },
    }),

    PurchaseOrder.find({
      status: {
        $in: ["DRAFT", "CONFIRMED"],
      },
    }),

    ManufacturingOrder.find({
      status: {
        $in: ["DRAFT", "CONFIRMED", "IN_PROGRESS"],
      },
    }),

    StockMovement.find()
      .populate(
        "product",
        "sku name"
      )
      .populate(
        "performedBy",
        "name email"
      )
      .sort({ createdAt: -1 })
      .limit(10),
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

    summary: {
      totalProducts: products.length,

      totalOnHand,

      totalReserved,

      totalFreeToUse:
        totalOnHand - totalReserved,

      inventoryValue,

      openSalesOrders:
        salesOrders.length,

      openSalesOrderValue:
        salesOrderValue,

      openPurchaseOrders:
        purchaseOrders.length,

      openPurchaseOrderValue:
        purchaseOrderValue,

      activeManufacturingOrders:
        manufacturingOrders.length,

      lowStockCount:
        lowStockProducts.length,
    },

    lowStockProducts,

    recentMovements,
  });
}